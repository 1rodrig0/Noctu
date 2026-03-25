-- ============================================
-- SISTEMA DE PRÉSTAMOS DE EQUIPOS - EMI LA PAZ
-- Schema Principal
-- ============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLA: profiles
-- Extiende auth.users de Supabase
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'lab_manager')),
  student_code TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_student_code ON public.profiles(student_code);

-- ============================================
-- TABLA: categories
-- Categorías de equipos
-- ============================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: equipment
-- Equipos del laboratorio
-- ============================================
CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'on_loan', 'maintenance', 'retired')),
  condition TEXT CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  purchase_date DATE,
  location TEXT,
  image_url TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para equipment
CREATE INDEX idx_equipment_status ON public.equipment(status);
CREATE INDEX idx_equipment_category ON public.equipment(category_id);
CREATE INDEX idx_equipment_code ON public.equipment(code);

-- ============================================
-- TABLA: loans
-- Préstamos de equipos
-- ============================================
CREATE TABLE public.loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE RESTRICT,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'returned', 'overdue')),
  
  -- Fechas
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  loan_start_date TIMESTAMPTZ,
  loan_end_date TIMESTAMPTZ,
  expected_return_date TIMESTAMPTZ NOT NULL,
  actual_return_date TIMESTAMPTZ,
  
  -- Responsables
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rejected_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  returned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Detalles
  purpose TEXT NOT NULL,
  rejection_reason TEXT,
  return_notes TEXT,
  return_condition TEXT CHECK (return_condition IN ('excellent', 'good', 'fair', 'poor', 'damaged')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para loans
CREATE INDEX idx_loans_equipment ON public.loans(equipment_id);
CREATE INDEX idx_loans_student ON public.loans(student_id);
CREATE INDEX idx_loans_status ON public.loans(status);
CREATE INDEX idx_loans_dates ON public.loans(loan_start_date, expected_return_date);

-- ============================================
-- TABLA: audit_logs
-- Registro de todas las acciones importantes
-- ============================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para audit_logs
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loans_updated_at
  BEFORE UPDATE ON public.loans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar estado de equipo según préstamo
CREATE OR REPLACE FUNCTION update_equipment_status_on_loan()
RETURNS TRIGGER AS $$
BEGIN
  -- Cuando se aprueba un préstamo
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE public.equipment
    SET status = 'on_loan'
    WHERE id = NEW.equipment_id;
  END IF;
  
  -- Cuando se devuelve un equipo
  IF NEW.status = 'returned' AND OLD.status = 'approved' THEN
    UPDATE public.equipment
    SET status = 'available'
    WHERE id = NEW.equipment_id;
  END IF;
  
  -- Cuando se rechaza o cancela
  IF NEW.status IN ('rejected') AND OLD.status = 'pending' THEN
    UPDATE public.equipment
    SET status = 'available'
    WHERE id = NEW.equipment_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER loan_status_equipment_update
  AFTER UPDATE ON public.loans
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_equipment_status_on_loan();

-- Función para registrar auditoría
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values
  )
  VALUES (
    COALESCE(auth.uid(), NULL),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers de auditoría
CREATE TRIGGER audit_equipment
  AFTER INSERT OR UPDATE OR DELETE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_loans
  AFTER INSERT OR UPDATE OR DELETE ON public.loans
  FOR EACH ROW
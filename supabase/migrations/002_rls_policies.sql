-- ============================================
-- POLÍTICAS RLS - SEGURIDAD A NIVEL DE FILA
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS: profiles
-- ============================================

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Los managers pueden ver todos los perfiles
CREATE POLICY "Lab managers can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'lab_manager'
    )
  );

-- Los usuarios pueden actualizar su propio perfil (excepto role)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Los managers pueden actualizar cualquier perfil
CREATE POLICY "Lab managers can update profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'lab_manager'
    )
  );

-- ============================================
-- POLÍTICAS: categories
-- ============================================

-- Todos pueden ver categorías
CREATE POLICY "Anyone can view categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- Solo managers pueden crear/editar categorías
CREATE POLICY "Lab managers can manage categories"
  ON public.categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'lab_manager'
    )
  );

-- ============================================
-- POLÍTICAS: equipment
-- ============================================

-- Todos los usuarios autenticados pueden ver equipos disponibles
CREATE POLICY "Authenticated users can view equipment"
  ON public.equipment
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Solo managers pueden crear equipos
CREATE POLICY "Lab managers can create equipment"
  ON public.equipment
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'lab_manager'
    )
  );

-- Solo managers pueden actualizar equipos
CREATE POLICY "Lab managers can update equipment"
  ON public.equipment
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'lab_manager'
    )
  );

-- Solo managers pueden eliminar equipos
CREATE POLICY "Lab managers can delete equipment"
  ON public.equipment
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'lab_manager'
    )
  );

-- ============================================
-- POLÍTICAS: loans
-- ============================================

-- Los estudiantes pueden ver sus propios préstamos
CREATE POLICY "Students can view own loans"
  ON public.loans
  FOR SELECT
  USING (
    student_id = auth.uid()
  );

-- Los managers pueden ver todos los préstamos
CREATE POLICY "Lab managers can view all loans"
  ON public.loans
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'lab_manager'
    )
  );

-- Los estudiantes pueden crear préstamos (solicitudes)
CREATE POLICY "Students can create loan requests"
  ON public.loans
  FOR INSERT
  WITH CHECK (
    student_id = auth.uid() AND
    status = 'pending'
  );

-- Solo managers pueden aprobar/rechazar préstamos
CREATE POLICY "Lab managers can approve/reject loans"
  ON public.loans
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'lab_manager'
    )
  );

-- Los estudiantes pueden cancelar sus propios préstamos pendientes
CREATE POLICY "Students can cancel own pending loans"
  ON public.loans
  FOR UPDATE
  USING (
    student_id = auth.uid() AND
    status = 'pending'
  )
  WITH CHECK (
    student_id = auth.uid() AND
    status IN ('pending', 'rejected')
  );

-- Solo managers pueden eliminar préstamos
CREATE POLICY "Lab managers can delete loans"
  ON public.loans
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'lab_manager'
    )
  );

-- ============================================
-- POLÍTICAS: audit_logs
-- ============================================

-- Solo managers pueden ver logs de auditoría
CREATE POLICY "Lab managers can view audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'lab_manager'
    )
  );

-- Nadie puede modificar o eliminar logs (solo insertar mediante triggers)
CREATE POLICY "No one can modify audit logs"
  ON public.audit_logs
  FOR UPDATE
  USING (false);

CREATE POLICY "No one can delete audit logs"
  ON public.audit_logs
  FOR DELETE
  USING (false);

-- ============================================
-- FUNCIONES DE AYUDA PARA POLÍTICAS
-- ============================================

-- Función para verificar si el usuario es manager
CREATE OR REPLACE FUNCTION is_lab_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'lab_manager'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si el usuario es estudiante
CREATE OR REPLACE FUNCTION is_student()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'student'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
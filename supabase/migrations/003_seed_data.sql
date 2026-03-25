-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- Insertar categorías
INSERT INTO public.categories (name, description, icon) VALUES
  ('Routers', 'Routers y equipos de enrutamiento', '🌐'),
  ('Switches', 'Switches de red y conmutadores', '🔌'),
  ('Cables', 'Cables de red, fibra óptica y conectores', '🔗'),
  ('Herramientas', 'Herramientas de red y crimpadoras', '🔧'),
  ('Medición', 'Multímetros, testers y equipos de medición', '📊'),
  ('Inalámbrico', 'Access Points y equipos WiFi', '📡'),
  ('Seguridad', 'Firewalls y equipos de seguridad', '🔒'),
  ('Servidores', 'Servidores y equipos de cómputo', '💻')
ON CONFLICT (name) DO NOTHING;

-- Insertar equipos de ejemplo
INSERT INTO public.equipment (code, name, description, category_id, brand, model, serial_number, status, condition, location, notes)
SELECT
  'RTR-001',
  'Router Cisco 2901',
  'Router empresarial con soporte para WAN',
  (SELECT id FROM public.categories WHERE name = 'Routers'),
  'Cisco',
  '2901/K9',
  'FTX1234567A',
  'available',
  'excellent',
  'Laboratorio A - Rack 1',
  'Router principal para prácticas de CCNA'
UNION ALL SELECT
  'RTR-002',
  'Router Cisco 1841',
  'Router de acceso modular',
  (SELECT id FROM public.categories WHERE name = 'Routers'),
  'Cisco',
  '1841',
  'FTX7654321B',
  'available',
  'good',
  'Laboratorio A - Rack 1',
  'Tiene configuración básica previa'
UNION ALL SELECT
  'SWI-001',
  'Switch Cisco Catalyst 2960',
  'Switch de 24 puertos administrable',
  (SELECT id FROM public.categories WHERE name = 'Switches'),
  'Cisco',
  'WS-C2960-24TT-L',
  'FOC1234567C',
  'available',
  'excellent',
  'Laboratorio A - Rack 2',
  'Incluye cables de consola'
UNION ALL SELECT
  'SWI-002',
  'Switch Cisco Catalyst 3560',
  'Switch de capa 3 con 48 puertos',
  (SELECT id FROM public.categories WHERE name = 'Switches'),
  'Cisco',
  'WS-C3560-48PS-S',
  'FOC9876543D',
  'available',
  'good',
  'Laboratorio A - Rack 2',
  'Soporta PoE en todos los puertos'
UNION ALL SELECT
  'CBL-001',
  'Cable UTP Cat6 - 5m',
  'Cable de red categoría 6',
  (SELECT id FROM public.categories WHERE name = 'Cables'),
  'Genérico',
  'Cat6',
  NULL,
  'available',
  'good',
  'Almacén - Estante 3',
  'Disponibles 20 unidades'
UNION ALL SELECT
  'CBL-002',
  'Cable Serial DCE/DTE',
  'Cable serial para conexiones WAN',
  (SELECT id FROM public.categories WHERE name = 'Cables'),
  'Cisco',
  'CAB-SS-V35MT',
  NULL,
  'available',
  'excellent',
  'Almacén - Estante 3',
  'Disponibles 5 pares'
UNION ALL SELECT
  'HER-001',
  'Crimpadora RJ45',
  'Herramienta para crimpar conectores',
  (SELECT id FROM public.categories WHERE name = 'Herramientas'),
  'Klein Tools',
  'VDV226-110',
  NULL,
  'available',
  'good',
  'Caja de herramientas',
  'Incluye corta cables'
UNION ALL SELECT
  'MED-001',
  'Multímetro Digital',
  'Multímetro para mediciones eléctricas',
  (SELECT id FROM public.categories WHERE name = 'Medición'),
  'Fluke',
  '117',
  'FL1234567',
  'available',
  'excellent',
  'Caja de medición',
  'Con funda y cables de prueba'
UNION ALL SELECT
  'MED-002',
  'Certificador de Cables',
  'Tester para certificación de cables',
  (SELECT id FROM public.categories WHERE name = 'Medición'),
  'Fluke Networks',
  'DSX-5000',
  'FN9876543',
  'available',
  'excellent',
  'Caja de medición',
  'Solo para uso con supervisor'
UNION ALL SELECT
  'WAP-001',
  'Access Point Ubiquiti',
  'Access Point inalámbrico AC',
  (SELECT id FROM public.categories WHERE name = 'Inalámbrico'),
  'Ubiquiti',
  'UAP-AC-PRO',
  'UB1234567',
  'available',
  'excellent',
  'Laboratorio B - Rack 1',
  'Soporta 802.11ac Wave 2'
UNION ALL SELECT
  'FWL-001',
  'Firewall Fortinet',
  'Firewall de próxima generación',
  (SELECT id FROM public.categories WHERE name = 'Seguridad'),
  'Fortinet',
  'FortiGate 60E',
  'FG60E1234567',
  'maintenance',
  'good',
  'Laboratorio C',
  'En mantenimiento hasta 15/12/2025'
UNION ALL SELECT
  'SRV-001',
  'Servidor Dell PowerEdge',
  'Servidor de rack 1U',
  (SELECT id FROM public.categories WHERE name = 'Servidores'),
  'Dell',
  'R340',
  'SRV1234567',
  'available',
  'excellent',
  'Sala de servidores - Rack principal',
  'Configurado con Ubuntu Server 22.04';

-- Nota: Los usuarios se crean mediante Supabase Auth
-- Los perfiles se crean automáticamente con el trigger
-- Puedes crear usuarios de prueba desde el dashboard de Supabase o mediante la API

-- Ejemplo de cómo insertar un préstamo de prueba (después de crear usuarios)
-- Descomentar cuando tengas usuarios reales:

/*
INSERT INTO public.loans (
  equipment_id,
  student_id,
  status,
  purpose,
  expected_return_date
)
SELECT
  (SELECT id FROM public.equipment WHERE code = 'RTR-001'),
  (SELECT id FROM public.profiles WHERE email = 'estudiante@emi.edu.bo'),
  'pending',
  'Práctica de configuración de OSPF',
  NOW() + INTERVAL '7 days';
*/
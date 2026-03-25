import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EquipmentCard from '@/components/equipment/EquipmentCard';
import { Plus } from 'lucide-react';
import type { Database } from '@/lib/types/database.types';

type EquipmentWithCategory = Database['public']['Tables']['equipment']['Row'] & {
  category?: { id: string; name: string; icon?: string | null };
};

export default async function EquipmentPage() {
  const supabase = await createClient();

  // Obtener usuario
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Obtener perfil
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const profile = profileData as Database['public']['Tables']['profiles']['Row'] | null;
  const isManager = profile?.role === 'lab_manager';

  // Obtener equipos con join virtual
  const { data: equipmentData } = await supabase
    .from('equipment')
    .select(`
      *,
      category:categories(id, name, icon)
    `)
    .order('created_at', { ascending: false });

  const equipmentArray = (equipmentData ?? []) as EquipmentWithCategory[];

  // Transformar null → undefined para compatibilidad con EquipmentCard
  const equipment = equipmentArray.map((item) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    brand: item.brand ?? undefined,
    model: item.model ?? undefined,
    status: item.status,
    condition: item.condition ?? undefined,
    location: item.location ?? undefined,
    category: item.category
      ? { name: item.category.name, icon: item.category.icon ?? undefined }
      : undefined,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Equipos</h2>
          <p className="text-gray-500">Catálogo de equipos del laboratorio</p>
        </div>
        {isManager && (
          <Link href="/dashboard/equipment/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Equipo
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <EquipmentCard key={item.id} equipment={item} isManager={isManager} />
        ))}
      </div>

      {equipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay equipos registrados</p>
        </div>
      )}
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import type { Database } from '@/lib/types/database.types';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 👇 Tipamos profile explícitamente, evitando que TS haga inferencia infinita
  const profile = data as Database['public']['Tables']['profiles']['Row'] | null;

  if (!profile) return redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={profile} />
      <div className="flex">
        <Sidebar role={profile.role} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

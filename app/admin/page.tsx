import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboard from '../../components/AdminDashboard';
import { isAdminEmail } from '../../lib/admin';

export default async function AdminPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anon key are required. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_URL and SUPABASE_ANON_KEY.');
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll: () =>
          cookieStore.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          })),
        setAll: (cookieList) => {
          cookieList.forEach((cookie) => {
            cookieStore.set(cookie.name, cookie.value);
          });
        },
      },
    }
  );
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user || !isAdminEmail(user.email)) {
    redirect('/admin/login');
  }

  return (
    <section className="bg-black text-white min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-[#A1A1AA]">Admin dashboard</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Manage confessions</h1>
          <p className="max-w-3xl text-[#A1A1AA]">View submitted confessions, inspect details, and sign out securely.</p>
        </div>
        <AdminDashboard />
      </div>
    </section>
  );
}

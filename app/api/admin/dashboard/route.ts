import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '../../../../lib/admin';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials.' }, { status: 500 });
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
            options: cookie.options ?? {},
          })),
        setAll: (cookieList) => {
          cookieList.forEach((cookie) => {
            cookieStore.set(cookie.name, cookie.value, cookie.options ?? {});
          });
        },
      },
    }
  );
  const { data } = await supabase.auth.getUser();

  const user = data.user;
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const submissions = await supabase
    .from('confessions')
    .select('id,title,story,category,created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (submissions.error) {
    return NextResponse.json(
      { error: submissions.error.message ?? 'Unable to load dashboard data' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    submissions: submissions.data ?? []
  });
}

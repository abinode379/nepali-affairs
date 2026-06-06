import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '../../../../lib/admin';

export async function POST(req: Request) {
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

  const body = await req.json();
  const action = body.action as string;
  const id = body.id as string;

  if (!id || !['approve', 'reject', 'delete', 'feature', 'unfeature'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  let result;

  switch (action) {
    case 'approve':
      result = await supabase.from('confessions').update({ status: 'approved' }).eq('id', id);
      break;
    case 'reject':
      result = await supabase.from('confessions').update({ status: 'rejected' }).eq('id', id);
      break;
    case 'feature':
      result = await supabase.from('confessions').update({ featured: true }).eq('id', id);
      break;
    case 'unfeature':
      result = await supabase.from('confessions').update({ featured: false }).eq('id', id);
      break;
    case 'delete':
      result = await supabase.from('confessions').delete().eq('id', id);
      break;
  }

  if (result?.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

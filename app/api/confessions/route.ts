import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase-server';

const categories = ['Crush', 'Relationship', 'Marriage', 'Secret', 'Friendship', 'Other'] as const;

type Category = (typeof categories)[number];

export async function POST(req: NextRequest) {
  const body = await req.json();

  const title = typeof body.title === 'string' ? body.title.trim() : null;
  const story = typeof body.story === 'string' ? body.story.trim() : '';
  const category = typeof body.category === 'string' ? body.category : '';
  if (story.length === 0) {
    return NextResponse.json({ error: 'Please provide a story for your confession.' }, { status: 400 });
  }

  if (!categories.includes(category as Category)) {
    return NextResponse.json({ error: 'Please choose a valid category.' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('confessions').insert({
    title: title || null,
    story,
    category,
    status: 'pending',
    featured: false
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Your confession has been submitted anonymously.' }, { status: 201 });
}

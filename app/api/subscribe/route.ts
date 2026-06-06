import { NextResponse } from 'next/server';
import { subscribeEmail } from '../../../actions/subscribe';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const result = await subscribeEmail(body.email);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unable to subscribe at this time.'
      },
      { status: 400 }
    );
  }
}

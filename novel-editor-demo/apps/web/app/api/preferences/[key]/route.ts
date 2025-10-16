import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET /api/preferences/[key] - Get a preference
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const pref = await queryOne(
      'SELECT preference_value as value FROM user_preferences WHERE preference_key = ?',
      [key]
    );

    return NextResponse.json({ value: pref?.value || null });
  } catch (error) {
    console.error('Error fetching preference:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preference' },
      { status: 500 }
    );
  }
}

// PUT /api/preferences/[key] - Set a preference
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const body = await req.json();
    const { value } = body;

    await query(
      `INSERT INTO user_preferences (preference_key, preference_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE preference_value = ?, updated_at = CURRENT_TIMESTAMP`,
      [key, value, value]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting preference:', error);
    return NextResponse.json(
      { error: 'Failed to set preference' },
      { status: 500 }
    );
  }
}

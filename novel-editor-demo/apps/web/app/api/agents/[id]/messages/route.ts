import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/agents/[id]/messages - Get chat messages for agent
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = await query(
      `SELECT 
        id,
        agent_id as agentId,
        role,
        content,
        timestamp,
        created_at as createdAt
       FROM chat_messages
       WHERE agent_id = ?
       ORDER BY timestamp ASC`,
      [id]
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/agents/[id]/messages - Add chat message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { role, content, timestamp } = body;

    if (!role || !content || !timestamp) {
      return NextResponse.json(
        { error: 'Role, content, and timestamp are required' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO chat_messages (agent_id, role, content, timestamp)
       VALUES (?, ?, ?, ?)`,
      [id, role, content, timestamp]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/[id]/messages - Clear all messages for agent
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM chat_messages WHERE agent_id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting messages:', error);
    return NextResponse.json(
      { error: 'Failed to delete messages' },
      { status: 500 }
    );
  }
}

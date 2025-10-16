import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET /api/agents/[id] - Get single agent
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agent = await queryOne(
      `SELECT 
        id,
        name,
        system_prompt as systemPrompt,
        model,
        created_at as createdAt,
        updated_at as updatedAt
       FROM agents
       WHERE id = ?`,
      [id]
    );

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

// PUT /api/agents/[id] - Update agent
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, systemPrompt, model } = body;

    await query(
      `UPDATE agents 
       SET name = COALESCE(?, name),
           system_prompt = COALESCE(?, system_prompt),
           model = COALESCE(?, model),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, systemPrompt, model, id]
    );

    const agent = await queryOne(
      `SELECT 
        id,
        name,
        system_prompt as systemPrompt,
        model,
        created_at as createdAt,
        updated_at as updatedAt
       FROM agents
       WHERE id = ?`,
      [id]
    );

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/[id] - Delete agent
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Chat messages will be cascade deleted
    await query('DELETE FROM agents WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}

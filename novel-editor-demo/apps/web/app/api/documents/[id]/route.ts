import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET /api/documents/[id] - Get single document
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await queryOne(
      `SELECT 
        id,
        title,
        content,
        folder_id as folderId,
        total_investment as totalInvestment,
        created_at as createdAt,
        updated_at as updatedAt
       FROM documents
       WHERE id = ?`,
      [id]
    );

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Update document
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, content, folderId, totalInvestment } = body;

    await query(
      `UPDATE documents 
       SET title = COALESCE(?, title),
           content = COALESCE(?, content),
           folder_id = COALESCE(?, folder_id),
           total_investment = COALESCE(?, total_investment),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, content, folderId, totalInvestment, id]
    );

    const document = await queryOne(
      `SELECT 
        id,
        title,
        content,
        folder_id as folderId,
        total_investment as totalInvestment,
        created_at as createdAt,
        updated_at as updatedAt
       FROM documents
       WHERE id = ?`,
      [id]
    );

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Delete document
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM documents WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}

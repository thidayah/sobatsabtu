import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// PATCH method untuk update member (termasuk is_active)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate member ID
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Member ID is required',
          error: 'Missing member identifier',
        },
        { status: 400 }
      );
    }

    // Check if member exists
    const { data: existingMember, error: findError } = await supabaseServer
      .from('ss_members')
      .select('id, full_name, is_active')
      .eq('id', id)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            message: 'Member not found',
            error: 'The specified member does not exist',
          },
          { status: 404 }
        );
      }

      console.error('Error finding member:', findError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to find member',
          error: findError.message,
        },
        { status: 500 }
      );
    }

    // Prepare update data (only allow specific fields to be updated)
    const allowedFields = ['full_name', 'email', 'ig_username', 'gender', 'emergency_contact_name', 'emergency_contact_phone', 'medical_notes', 'is_active'];
    const updateData: any = { updated_at: new Date().toISOString() };

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Update member
    const { data: updatedMember, error: updateError } = await supabaseServer
      .from('ss_members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating member:', updateError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update member',
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    // Remove sensitive fields if any
    const { ...memberWithoutSensitive } = updatedMember;

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Member ${updatedMember.is_active ? 'activated' : 'deactivated'} successfully`,
      data: memberWithoutSensitive,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
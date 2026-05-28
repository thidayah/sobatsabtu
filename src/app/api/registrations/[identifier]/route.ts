import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { checkUUID, generateSlug } from "@/lib/utils";

// PUT method untuk update registrations (is_attendance)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;
    const body = await request.json();

    // Validate registration Id/Code
    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          message: 'Registration Id or Code is required',
          error: 'Missing registration id/code',
        },
        { status: 400 }
      );
    }

    // Check if registration exists
    let findQuery = supabaseServer
      .from('ss_registrations')
      .select('id, code, is_attendance');

    // Check if identifier is UUID or slug
    if (checkUUID(identifier)) {
      findQuery = findQuery.eq('id', identifier);
    } else {
      findQuery = findQuery.eq('code', identifier);
    }

    const { data: existingRegistration, error: findError } = await findQuery.single();;

    if (findError) {
      if (findError.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            message: 'Registration not found',
            error: 'The specified registration does not exist',
          },
          { status: 404 }
        );
      }

      console.error('Error finding registration:', findError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to find registration',
          error: findError.message,
        },
        { status: 500 }
      );
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (body.is_attendance !== undefined) updateData.is_attendance = body.is_attendance;

    // Update member
    const { data: updatedRegistration, error: updateError } = await supabaseServer
      .from('ss_registrations')
      .update(updateData)
      .eq('id', existingRegistration.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating registration:', updateError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update registration',
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Member ${updatedRegistration.is_attendance ? 'marked as attended' : 'marked as not attended'} successfully`,
      data: updatedRegistration,
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
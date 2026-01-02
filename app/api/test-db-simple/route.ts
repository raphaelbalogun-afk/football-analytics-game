import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/test-db-simple
 * 
 * Simple database test
 */
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test 1: Select
    const { data: selectData, error: selectError } = await supabase
      .from('players')
      .select('*')
      .limit(1)
    
    console.log('[Test DB] Select result:', { data: selectData, error: selectError })
    
    // Test 2: Insert
    const testPlayer = {
      name: `Test Player ${Date.now()}`,
      team: 'Test Team',
      position: 'MID',
      base_price: 25.00,
      current_price: 25.00,
      price_cap: 50.00,
      price_floor: 12.50,
      total_shares: 1000,
      available_shares: 1000
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('players')
      .insert(testPlayer)
      .select()
    
    console.log('[Test DB] Insert result:', { data: insertData, error: insertError })
    
    // Clean up
    if (insertData && insertData[0]) {
      await supabase
        .from('players')
        .delete()
        .eq('id', insertData[0].id)
    }
    
    return NextResponse.json({
      success: true,
      select: {
        success: !selectError,
        error: selectError?.message,
        count: selectData?.length || 0
      },
      insert: {
        success: !insertError,
        error: insertError?.message,
        data: insertData
      }
    })
  } catch (error: any) {
    console.error('[Test DB] Fatal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}


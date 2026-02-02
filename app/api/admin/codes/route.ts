"use server"

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// 获取所有兑换码
export async function GET() {
  const supabase = await createClient()

  const { data: codes, error } = await supabase
    .from("redemption_codes")
    .select(`
      *,
      test_results (
        id,
        total_score,
        gsi,
        pst,
        psi,
        created_at
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ codes })
}

// 批量生成兑换码
export async function POST(request: Request) {
  const supabase = await createClient()
  const { count, prefix } = await request.json()

  if (!count || count < 1 || count > 100) {
    return NextResponse.json(
      { error: "数量必须在1-100之间" },
      { status: 400 }
    )
  }

  const codePrefix = prefix || "SCL90"
  const codes: { code: string }[] = []

  for (let i = 0; i < count; i++) {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
    const timestamp = Date.now().toString(36).toUpperCase()
    codes.push({ code: `${codePrefix}-${timestamp}-${randomPart}` })
  }

  const { data, error } = await supabase
    .from("redemption_codes")
    .insert(codes)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ codes: data })
}

// 删除兑换码
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { id } = await request.json()

  // 先删除关联的测评结果
  await supabase.from("test_results").delete().eq("code_id", id)

  const { error } = await supabase
    .from("redemption_codes")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  // 获取总兑换码数
  const { count: totalCodes } = await supabase
    .from("redemption_codes")
    .select("*", { count: "exact", head: true })

  // 获取已使用的兑换码数
  const { count: usedCodes } = await supabase
    .from("redemption_codes")
    .select("*", { count: "exact", head: true })
    .eq("is_used", true)

  // 获取测评结果数
  const { count: totalResults } = await supabase
    .from("test_results")
    .select("*", { count: "exact", head: true })

  return NextResponse.json({
    totalCodes: totalCodes || 0,
    usedCodes: usedCodes || 0,
    unusedCodes: (totalCodes || 0) - (usedCodes || 0),
    totalResults: totalResults || 0,
    usageRate: totalCodes ? ((usedCodes || 0) / totalCodes * 100).toFixed(1) : 0,
  })
}

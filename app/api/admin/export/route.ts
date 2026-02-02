"use server"

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("redemption_codes")
    .select(`
      code,
      is_used,
      created_at,
      used_at,
      test_results (
        total_score,
        gsi,
        pst,
        psi,
        factor_scores,
        created_at
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 转换为CSV格式
  const headers = [
    "兑换码",
    "是否使用",
    "创建时间",
    "使用时间",
    "总分",
    "总症状指数(GSI)",
    "阳性项目数(PST)",
    "阳性症状均分(PSI)",
    "躯体化",
    "强迫症状",
    "人际敏感",
    "抑郁",
    "焦虑",
    "敌对",
    "恐怖",
    "偏执",
    "精神病性",
  ]

  const rows = data.map((item) => {
    const result = item.test_results?.[0]
    const factorScores = result?.factor_scores as Record<string, number> | undefined

    return [
      item.code,
      item.is_used ? "是" : "否",
      item.created_at ? new Date(item.created_at).toLocaleString("zh-CN") : "",
      item.used_at ? new Date(item.used_at).toLocaleString("zh-CN") : "",
      result?.total_score ?? "",
      result?.gsi ?? "",
      result?.pst ?? "",
      result?.psi ?? "",
      factorScores?.somatization ?? "",
      factorScores?.obsessive_compulsive ?? "",
      factorScores?.interpersonal_sensitivity ?? "",
      factorScores?.depression ?? "",
      factorScores?.anxiety ?? "",
      factorScores?.hostility ?? "",
      factorScores?.phobic_anxiety ?? "",
      factorScores?.paranoid_ideation ?? "",
      factorScores?.psychoticism ?? "",
    ].join(",")
  })

  const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="scl90_export_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}

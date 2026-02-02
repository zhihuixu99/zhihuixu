import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { codeId, answers, totalScore, gsi, pst, psi, factorScores } =
      await request.json();

    if (!codeId || !answers || totalScore === undefined) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 保存测评结果
    const { error: insertError } = await supabase.from("test_results").insert({
      code_id: codeId,
      answers,
      total_score: totalScore,
      gsi,
      pst,
      psi,
      factor_scores: factorScores,
    });

    if (insertError) {
      console.error("保存结果错误:", insertError);
      return NextResponse.json(
        { error: "保存结果失败" },
        { status: 500 }
      );
    }

    // 更新兑换码状态为已使用
    const { error: updateError } = await supabase
      .from("redemption_codes")
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq("id", codeId);

    if (updateError) {
      console.error("更新兑换码状态错误:", updateError);
      return NextResponse.json(
        { error: "更新兑换码状态失败" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("保存结果错误:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}

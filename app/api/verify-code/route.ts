import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "请输入兑换码" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 查找兑换码
    const { data: codeData, error: codeError } = await supabase
      .from("redemption_codes")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .single();

    if (codeError || !codeData) {
      return NextResponse.json(
        { error: "兑换码错误，请重新输入", valid: false },
        { status: 404 }
      );
    }

    // 检查是否已使用
    if (codeData.is_used) {
      // 获取之前的测评结果
      const { data: resultData, error: resultError } = await supabase
        .from("test_results")
        .select("*")
        .eq("code_id", codeData.id)
        .single();

      if (resultError || !resultData) {
        return NextResponse.json(
          { error: "兑换码已使用但未找到测评结果", valid: false },
          { status: 404 }
        );
      }

      return NextResponse.json({
        valid: true,
        used: true,
        codeId: codeData.id,
        previousResult: {
          answers: resultData.answers,
          totalScore: resultData.total_score,
          gsi: parseFloat(resultData.gsi),
          pst: resultData.pst,
          psi: parseFloat(resultData.psi),
          factorScores: resultData.factor_scores,
          createdAt: resultData.created_at,
        },
      });
    }

    // 兑换码有效且未使用
    return NextResponse.json({
      valid: true,
      used: false,
      codeId: codeData.id,
    });
  } catch (error) {
    console.error("验证兑换码错误:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}

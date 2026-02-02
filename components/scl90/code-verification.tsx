"use client";

import React from "react"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, KeyRound, Loader2 } from "lucide-react";

interface CodeVerificationProps {
  onVerified: (codeId: string) => void;
  onPreviousResult: (result: PreviousResult) => void;
}

export interface PreviousResult {
  answers: Record<number, number>;
  totalScore: number;
  gsi: number;
  pst: number;
  psi: number;
  factorScores: Record<string, { score: number; average: number }>;
  createdAt: string;
}

export function CodeVerification({
  onVerified,
  onPreviousResult,
}: CodeVerificationProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("请输入兑换码");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "验证失败，请重试");
        return;
      }

      if (data.valid) {
        if (data.used && data.previousResult) {
          // 已使用，显示之前的结果
          onPreviousResult(data.previousResult);
        } else {
          // 未使用，开始测评
          onVerified(data.codeId);
        }
      }
    } catch (err) {
      setError("网络错误，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            SCL-90 心理健康自评量表
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            请输入您的兑换码开始测评
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="请输入兑换码"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError("");
                }}
                className="text-center text-lg tracking-widest font-mono h-12"
                disabled={isLoading}
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  验证中...
                </>
              ) : (
                "验证并开始测评"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-2">
              如何获取兑换码？
            </h4>
            <p className="text-sm text-muted-foreground">
              请前往我们的小红书店铺购买SCL-90心理测评服务，购买成功后将获得专属兑换码。
            </p>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>免责声明：</strong>本测评结果仅供参考，不作为医学诊断依据。SCL-90量表是一种心理健康筛查工具，测评结果不能替代专业心理咨询或医学诊断。如您感到持续的心理困扰或出现严重症状，请及时咨询专业心理咨询师或前往医疗机构就诊。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

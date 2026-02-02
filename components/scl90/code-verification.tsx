"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CodeVerificationProps {
  onVerified: (codeId: string) => void
  onPreviousResult: (result: any) => void
}

export function CodeVerification({
  onVerified,
  onPreviousResult,
}: CodeVerificationProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!code.trim()) {
      setError("请输入兑换码")
      return
    }
    setIsLoading(true)

    try {
      const WORKER_URL = "https://restless-limit-308e.920542828.workers.dev/verify"
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "兑换码无效")
        return
      }

      if (data.success) {
        if (data.used && data.previousResult) {
          onPreviousResult(data.previousResult)
        } else {
          onVerified(data.codeId || code.trim())
        }
      } else {
        setError("验证失败")
      }
    } catch (err) {
      setError("网络错误，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Key className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">SCL-90 测评</CardTitle>
          <CardDescription>请输入兑换码开始</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="请输入兑换码"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="text-center text-lg uppercase"
              disabled={isLoading}
            />
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "验证开始"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

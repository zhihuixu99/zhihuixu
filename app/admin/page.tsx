"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Lock, Plus, Download, Trash2, Eye, RefreshCw, Copy, Check } from "lucide-react"

interface Stats {
  totalCodes: number
  usedCodes: number
  unusedCodes: number
  totalResults: number
  usageRate: string
}

interface TestResult {
  id: string
  total_score: number
  gsi: number
  pst: number
  psi: number
  created_at: string
}

interface Code {
  id: string
  code: string
  is_used: boolean
  created_at: string
  used_at: string | null
  test_results: TestResult[]
}

const ADMIN_PASSWORD = "scl90admin2024"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [stats, setStats] = useState<Stats | null>(null)
  const [codes, setCodes] = useState<Code[]>([])
  const [loading, setLoading] = useState(false)
  const [generateCount, setGenerateCount] = useState(10)
  const [generatePrefix, setGeneratePrefix] = useState("SCL90")
  const [generating, setGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, codesRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/codes"),
      ])
      const statsData = await statsRes.json()
      const codesData = await codesRes.json()
      setStats(statsData)
      setCodes(codesData.codes || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, fetchData])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordError("")
    } else {
      setPasswordError("密码错误，请重试")
    }
  }

  const handleGenerateCodes = async () => {
    setGenerating(true)
    try {
      const res = await fetch("/api/admin/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: generateCount, prefix: generatePrefix }),
      })
      if (res.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error("Failed to generate codes:", error)
    } finally {
      setGenerating(false)
    }
  }

  const handleDeleteCode = async (id: string) => {
    if (!confirm("确定要删除此兑换码吗？关联的测评结果也会被删除。")) return
    try {
      const res = await fetch("/api/admin/codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error("Failed to delete code:", error)
    }
  }

  const handleExport = () => {
    window.open("/api/admin/export", "_blank")
  }

  const handleCopyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>管理后台</CardTitle>
            <CardDescription>请输入管理密码以访问后台</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">管理密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="请输入密码"
              />
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
            <Button onClick={handleLogin} className="w-full">
              登录
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              默认密码：scl90admin2024
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">SCL-90 管理后台</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              刷新
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              导出CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-foreground">{stats?.totalCodes ?? "-"}</div>
              <p className="text-sm text-muted-foreground">总兑换码数</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-foreground">{stats?.usedCodes ?? "-"}</div>
              <p className="text-sm text-muted-foreground">已使用</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-foreground">{stats?.unusedCodes ?? "-"}</div>
              <p className="text-sm text-muted-foreground">未使用</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-foreground">{stats?.usageRate ?? "-"}%</div>
              <p className="text-sm text-muted-foreground">使用率</p>
            </CardContent>
          </Card>
        </div>

        {/* 生成兑换码 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">批量生成兑换码</CardTitle>
            <CardDescription>生成新的兑换码供用户使用</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="prefix">前缀</Label>
                <Input
                  id="prefix"
                  value={generatePrefix}
                  onChange={(e) => setGeneratePrefix(e.target.value)}
                  placeholder="SCL90"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="count">数量 (1-100)</Label>
                <Input
                  id="count"
                  type="number"
                  min={1}
                  max={100}
                  value={generateCount}
                  onChange={(e) => setGenerateCount(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleGenerateCodes} disabled={generating}>
                  <Plus className="w-4 h-4 mr-2" />
                  {generating ? "生成中..." : "生成"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 兑换码列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">兑换码列表</CardTitle>
            <CardDescription>查看和管理所有兑换码</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>兑换码</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>使用时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    codes.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell className="font-mono">
                          <div className="flex items-center gap-2">
                            {code.code}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleCopyCode(code.code, code.id)}
                            >
                              {copiedId === code.id ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={code.is_used ? "secondary" : "default"}>
                            {code.is_used ? "已使用" : "未使用"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(code.created_at).toLocaleString("zh-CN")}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {code.used_at
                            ? new Date(code.used_at).toLocaleString("zh-CN")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {code.test_results?.[0] && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedResult(code.test_results[0])}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>测评结果</DialogTitle>
                                    <DialogDescription>
                                      兑换码 {code.code} 的测评结果
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedResult && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-muted rounded-lg p-3">
                                          <div className="text-sm text-muted-foreground">总分</div>
                                          <div className="text-xl font-bold">{selectedResult.total_score}</div>
                                        </div>
                                        <div className="bg-muted rounded-lg p-3">
                                          <div className="text-sm text-muted-foreground">总症状指数</div>
                                          <div className="text-xl font-bold">{selectedResult.gsi}</div>
                                        </div>
                                        <div className="bg-muted rounded-lg p-3">
                                          <div className="text-sm text-muted-foreground">阳性项目数</div>
                                          <div className="text-xl font-bold">{selectedResult.pst}</div>
                                        </div>
                                        <div className="bg-muted rounded-lg p-3">
                                          <div className="text-sm text-muted-foreground">阳性症状均分</div>
                                          <div className="text-xl font-bold">{selectedResult.psi}</div>
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        测评时间：{new Date(selectedResult.created_at).toLocaleString("zh-CN")}
                                      </p>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCode(code.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

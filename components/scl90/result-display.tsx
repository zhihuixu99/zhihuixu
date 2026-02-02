"use client"

import { useState } from "react"
import { TestResult, factors, getOverallAssessment } from "@/lib/scl90-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { RotateCcw, Download, AlertCircle, BookOpen, BarChart3, Info, X } from "lucide-react"

interface ResultDisplayProps {
  result: TestResult
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const [showRestartDialog, setShowRestartDialog] = useState(false)
  const assessment = getOverallAssessment(result)
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case "正常": return "bg-accent/20 text-accent-foreground border-accent/30"
      case "轻度": return "bg-chart-4/20 text-chart-4 border-chart-4/30"
      case "中度": return "bg-chart-1/20 text-chart-1 border-chart-1/30"
      case "中重度": return "bg-destructive/20 text-destructive border-destructive/30"
      case "重度": return "bg-destructive/30 text-destructive border-destructive/50"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getAssessmentColor = (level: string) => {
    switch (level) {
      case "状态良好": return "bg-accent/10 border-accent/30 text-accent"
      case "轻度症状": return "bg-chart-4/10 border-chart-4/30 text-chart-4"
      case "中度症状": return "bg-chart-1/10 border-chart-1/30 text-chart-1"
      case "需要关注": return "bg-destructive/10 border-destructive/30 text-destructive"
      default: return "bg-muted/50 border-border text-muted-foreground"
    }
  }

  const handleRestartClick = () => {
    setShowRestartDialog(true)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 总体评估 */}
      <div className={cn(
        "rounded-2xl p-8 mb-8 border-2",
        getAssessmentColor(assessment.level)
      )}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-background/50">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{assessment.level}</h2>
            <p className="text-foreground/80 leading-relaxed">{assessment.description}</p>
          </div>
        </div>
      </div>

      {/* 统计指标 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">总分</p>
          <p className="text-3xl font-bold text-foreground">{result.totalScore}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">总症状指数</p>
          <p className="text-3xl font-bold text-foreground">{result.gsi}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">阳性项目数</p>
          <p className="text-3xl font-bold text-foreground">{result.positiveItems}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">阳性症状均分</p>
          <p className="text-3xl font-bold text-foreground">{result.psi}</p>
        </div>
      </div>

      {/* 因子分数 */}
      <div className="bg-card rounded-2xl p-6 border border-border mb-8">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">各因子评分详情</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(factors).map(([key, factor]) => {
            const factorResult = result.factorScores[key]
            const barWidth = Math.min((factorResult.average / 5) * 100, 100)
            
            return (
              <div key={key} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-foreground">{factor.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({factor.description})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-foreground">{factorResult.average}</span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      getLevelColor(factorResult.level)
                    )}>
                      {factorResult.level}
                    </span>
                  </div>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 结果解读卡片 */}
      <div className="bg-card rounded-2xl p-6 border border-border mb-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">结果解读</h3>
        </div>
        <div className="space-y-4 text-foreground/80">
          <div>
            <h4 className="font-semibold text-foreground mb-2">总分 (Total Score)</h4>
            <p className="text-sm leading-relaxed">
              您的总分为 <span className="font-semibold text-primary">{result.totalScore}</span> 分。
              总分是所有90个项目的得分之和，反映病情的严重程度。总分越高，说明心理健康问题越突出。
              一般认为总分超过160分表示阳性，需要引起关注。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">总症状指数 (GSI)</h4>
            <p className="text-sm leading-relaxed">
              您的总症状指数为 <span className="font-semibold text-primary">{result.gsi}</span>。
              总症状指数是总分除以90，代表从总体情况来看自觉症状的严重程度。
              GSI {">"} 1 被认为是筛查阳性的临界值。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">阳性项目数 (PST)</h4>
            <p className="text-sm leading-relaxed">
              您的阳性项目数为 <span className="font-semibold text-primary">{result.positiveItems}</span> 项。
              阳性项目数是指评分 ≥ 2 的项目数量，反映存在多少心理症状。
              阳性项目数超过43项被认为是筛查阳性的临界值。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">阳性症状均分 (PSI)</h4>
            <p className="text-sm leading-relaxed">
              您的阳性症状均分为 <span className="font-semibold text-primary">{result.psi}</span>。
              阳性症状均分是阳性项目的总分除以阳性项目数，反映阳性症状的平均严重程度。
            </p>
          </div>
        </div>
      </div>

      {/* 分级标准展示 */}
      <div className="bg-card rounded-2xl p-6 border border-border mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Info className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">症状分级标准</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">等级</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">因子均分范围</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">症状描述</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", getLevelColor("正常"))}>
                    正常
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">1.0 - 1.5</td>
                <td className="py-3 px-4 text-muted-foreground">心理健康状态良好，无明显症状</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", getLevelColor("轻度"))}>
                    轻度
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">1.5 - 2.0</td>
                <td className="py-3 px-4 text-muted-foreground">存在轻微心理困扰，可自我调节</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", getLevelColor("中度"))}>
                    中度
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">2.0 - 2.5</td>
                <td className="py-3 px-4 text-muted-foreground">心理症状较明显，建议寻求帮助</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", getLevelColor("中重度"))}>
                    中重度
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">2.5 - 3.0</td>
                <td className="py-3 px-4 text-muted-foreground">症状较为严重，需要专业干预</td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", getLevelColor("重度"))}>
                    重度
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{">"} 3.0</td>
                <td className="py-3 px-4 text-muted-foreground">症状严重，强烈建议尽快就医</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 中国常模参考 */}
      <div className="bg-muted/50 rounded-2xl p-6 mb-8 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-muted-foreground" />
          <h4 className="font-semibold text-foreground">中国常模参考</h4>
        </div>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            本量表采用中国成人常模作为参考标准。中国常模数据来源于大规模流行病学调查研究，
            具有良好的信度和效度，适用于中国成人群体的心理健康筛查。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
            <div>
              <p className="font-medium text-foreground mb-1">常模参考值</p>
              <ul className="space-y-1 text-xs">
                <li>总症状指数 (GSI) 常模均值: 1.44 ± 0.43</li>
                <li>阳性项目数 (PST) 常模均值: 24.92 ± 18.41</li>
                <li>阳性症状均分 (PSI) 常模均值: 2.60 ± 0.59</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">筛查阳性标准</p>
              <ul className="space-y-1 text-xs">
                <li>总分 ≥ 160 分</li>
                <li>或阳性项目数 ≥ 43 项</li>
                <li>或任一因子分 ≥ 2</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">免责声明：</strong>本测评结果仅供参考，不作为医学诊断依据。
            SCL-90量表是一种心理健康筛查工具，测评结果不能替代专业心理咨询或医学诊断。
            如您感到持续的心理困扰或出现严重症状，请及时咨询专业心理咨询师或前往医疗机构就诊。
          </p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleRestartClick} variant="outline" size="lg" className="gap-2 bg-transparent">
          <RotateCcw className="w-4 h-4" />
          重新测评
        </Button>
        <Button 
          onClick={() => window.print()} 
          size="lg" 
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          打印结果
        </Button>
      </div>

      {/* 重新测评弹窗 */}
      {showRestartDialog && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl border border-border animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <AlertCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">温馨提示</h3>
              </div>
              <button 
                onClick={() => setShowRestartDialog(false)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="text-foreground/80 space-y-3 mb-6">
              <p>兑换码仅限使用一次，若需重新测试，请到小红书店铺重新购买测试。</p>
              <p>若无需重新测试，可截图保存本次测试结果。</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowRestartDialog(false)}
                className="flex-1 bg-transparent"
              >
                取消
              </Button>
              <Button 
                onClick={() => window.print()}
                className="flex-1"
              >
                保存结果
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

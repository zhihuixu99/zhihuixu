"use client"

import { useState, useCallback } from "react"
import { questions, calculateResults, TestResult } from "@/lib/scl90-data"
import { QuestionCard } from "./question-card"
import { ProgressBar } from "./progress-bar"
import { ResultDisplay } from "./result-display"
import { CodeVerification, PreviousResult } from "./code-verification"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from "lucide-react"

type Phase = "verify" | "intro" | "test" | "result"

const QUESTIONS_PER_PAGE = 5

export function Assessment() {
  const [phase, setPhase] = useState<Phase>("verify")
  const [codeId, setCodeId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [currentPage, setCurrentPage] = useState(0)
  const [result, setResult] = useState<TestResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE)
  const startIndex = currentPage * QUESTIONS_PER_PAGE
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, questions.length)
  const currentQuestions = questions.slice(startIndex, endIndex)
  
  const answeredCount = Object.keys(answers).length
  const currentPageAnswered = currentQuestions.every(q => answers[q.id] !== undefined)
  const allAnswered = answeredCount === questions.length

  const handleAnswer = useCallback((questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }, [])

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    if (!codeId) return
    
    setIsSubmitting(true)
    const testResult = calculateResults(answers)
    
    try {
      // 【关键修改】：把这里的 URL 换成你上面 Worker 的真实地址
      const WORKER_URL = "https://你的worker名字.子域.workers.dev/save";
      
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codeId,
          answers,
          totalScore: testResult.totalScore,
          gsi: testResult.gsi,
          pst: testResult.positiveItems,
          psi: testResult.psi,
          factorScores: testResult.factorScores,
        }),
      })

      if (!response.ok) {
        console.error("保存结果失败")
      }
    } catch (error) {
      console.error("保存结果错误:", error)
    }
    setResult(testResult)
    setPhase("result")
    setIsSubmitting(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCodeVerified = (verifiedCodeId: string) => {
    setCodeId(verifiedCodeId)
    setPhase("intro")
  }

  const handlePreviousResult = (previousResult: PreviousResult) => {
    // 将之前的结果转换为 TestResult 格式
    const testResult: TestResult = {
      totalScore: previousResult.totalScore,
      gsi: previousResult.gsi,
      positiveItems: previousResult.pst,
      psi: previousResult.psi,
      factorScores: previousResult.factorScores,
    }
    setResult(testResult)
    setPhase("result")
  }

  const startTest = () => {
    setPhase("test")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 验证页面
  if (phase === "verify") {
    return (
      <CodeVerification
        onVerified={handleCodeVerified}
        onPreviousResult={handlePreviousResult}
      />
    )
  }

  // 介绍页面
  if (phase === "intro") {
    return (
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            SCL-90 心理健康自评量表
          </h1>
          <p className="text-lg text-muted-foreground">
            症状自评量表（Symptom Checklist 90）
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border text-left mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">测评说明</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              SCL-90是目前世界上最著名的心理健康测试量表之一，是用于评定个体近期（一周内）的心理健康状况的自评量表。
            </p>
            <p>
              本量表共有90个项目，每个项目按5级评分制进行评定：
            </p>
            <ul className="list-none space-y-2 pl-4">
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">1</span>
                <span>没有 - 自觉无该项症状</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">2</span>
                <span>很轻 - 自觉有该项症状，但发生得不频繁、不严重</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">3</span>
                <span>中等 - 自觉有该项症状，其严重程度为中度</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">4</span>
                <span>偏重 - 自觉有该项症状，其程度为中度到严重之间</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">5</span>
                <span>严重 - 自觉该症状的频度和强度都十分严重</span>
              </li>
            </ul>
            <p className="pt-4 border-t border-border">
              请根据您<strong>最近一周</strong>的实际感受，认真、如实地回答每一个问题。
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span>共 90 题，约需 15-20 分钟</span>
          </div>
        </div>
        
        <Button onClick={startTest} size="lg" className="mt-8 px-12">
          开始测评
        </Button>
      </div>
    )
  }

  // 结果页面
  if (phase === "result" && result) {
    return <ResultDisplay result={result} />
  }

  // 测试页面
  return (
    <div className="max-w-3xl mx-auto">
      {/* 顶部进度 */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 mb-6 -mx-4 px-4">
        <ProgressBar current={answeredCount} total={questions.length} />
        <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
          <span>第 {currentPage + 1} / {totalPages} 页</span>
          <span>题目 {startIndex + 1} - {endIndex}</span>
        </div>
      </div>

      {/* 问题列表 */}
      <div className="space-y-6 mb-8">
        {currentQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            questionId={question.id}
            questionText={question.text}
            currentAnswer={answers[question.id]}
            onAnswer={handleAnswer}
          />
        ))}
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between items-center gap-4 pb-8">
        <Button
          onClick={handlePrev}
          variant="outline"
          disabled={currentPage === 0}
          className="gap-2 bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
          上一页
        </Button>

        <div className="text-sm text-muted-foreground">
          {!currentPageAnswered && (
            <span className="text-destructive">请完成本页所有题目</span>
          )}
        </div>

        {currentPage === totalPages - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                提交答案
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!currentPageAnswered}
            className="gap-2"
          >
            下一页
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

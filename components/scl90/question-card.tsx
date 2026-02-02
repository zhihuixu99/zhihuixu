"use client"

import { cn } from "@/lib/utils"
import { ratingOptions } from "@/lib/scl90-data"

interface QuestionCardProps {
  questionId: number
  questionText: string
  currentAnswer: number | undefined
  onAnswer: (questionId: number, value: number) => void
}

export function QuestionCard({ questionId, questionText, currentAnswer, onAnswer }: QuestionCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="mb-6">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          {questionId}
        </span>
        <p className="text-lg font-medium text-card-foreground leading-relaxed">{questionText}</p>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {ratingOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(questionId, option.value)}
            className={cn(
              "flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200",
              "hover:border-primary/50 hover:bg-primary/5",
              currentAnswer === option.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground"
            )}
          >
            <span className="text-2xl font-semibold mb-1">{option.value}</span>
            <span className="text-xs text-center">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

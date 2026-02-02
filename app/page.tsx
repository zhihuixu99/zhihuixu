import { Assessment } from "@/components/scl90/assessment"
import { Brain } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">心理健康测评</h1>
              <p className="text-xs text-muted-foreground">SCL-90 自评量表</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Assessment />
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            本测评仅供参考，不能替代专业心理诊断
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            如有心理困扰，请及时寻求专业帮助
          </p>
        </div>
      </footer>
    </main>
  )
}

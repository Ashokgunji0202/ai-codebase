"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Trophy, Calendar, TrendingUp, Clock, Target, BookOpen, ChevronRight, Award } from "lucide-react"
import QuizResult from "./quiz-result"

export default function QuizList({ assessments }) {
  const router = useRouter()
  const [selectedQuiz, setSelectedQuiz] = useState(null)

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return "bg-green-900/50 text-green-300 border-green-700/50"
    if (score >= 60) return "bg-yellow-900/50 text-yellow-300 border-yellow-700/50"
    return "bg-red-900/50 text-red-300 border-red-700/50"
  }

  const getPerformanceIcon = (score) => {
    if (score >= 80) return <Trophy className="h-4 w-4 text-green-400" />
    if (score >= 60) return <Target className="h-4 w-4 text-yellow-400" />
    return <TrendingUp className="h-4 w-4 text-red-400" />
  }

  if (!assessments || assessments.length === 0) {
    return (
      <Card className="bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-200 dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
                <BookOpen className="h-6 w-6 text-primary" />
                Recent Quizzes
              </CardTitle>
              <CardDescription className="text-slate-400 dark:text-slate-500 mt-1">
                Review your past quiz performance
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push("/interview/mock")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Play className="mr-2 h-4 w-4" />
              Start New Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="mx-auto w-16 h-16 bg-slate-700/50 dark:bg-slate-800/50 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-slate-500 dark:text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 dark:text-slate-300">No quizzes yet</h3>
              <p className="text-slate-400 dark:text-slate-500 text-sm">Start your first quiz to track your progress</p>
            </div>
            <Button
              onClick={() => router.push("/interview/mock")}
              variant="outline"
              className="border-slate-600 dark:border-slate-700 bg-slate-800/50 dark:bg-slate-900/50 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 text-slate-200 dark:text-slate-300"
            >
              <Play className="mr-2 h-4 w-4" />
              Take Your First Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800 shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-200 dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
                <BookOpen className="h-6 w-6 text-primary" />
                Recent Quizzes
              </CardTitle>
              <CardDescription className="text-slate-400 dark:text-slate-500 mt-1">
                Review your past quiz performance and track improvement
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push("/interview/mock")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px]"
            >
              <Play className="mr-2 h-4 w-4" />
              Start New Quiz
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="bg-slate-700/50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-600/50 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">Total</span>
              </div>
              <p className="text-lg font-bold text-slate-100 dark:text-slate-200">{assessments.length}</p>
            </div>
            <div className="bg-slate-700/50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-600/50 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-green-400" />
                <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">Best</span>
              </div>
              <p className="text-lg font-bold text-green-400">
                {Math.max(...assessments.map((a) => a.quizScore)).toFixed(0)}%
              </p>
            </div>
            <div className="bg-slate-700/50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-600/50 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">Average</span>
              </div>
              <p className="text-lg font-bold text-blue-400">
                {(assessments.reduce((sum, a) => sum + a.quizScore, 0) / assessments.length).toFixed(0)}%
              </p>
            </div>
            <div className="bg-slate-700/50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-600/50 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">Latest</span>
              </div>
              <p className="text-lg font-bold text-purple-400">
                {format(new Date(assessments[0]?.createdAt), "MMM dd")}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {assessments?.map((assessment, i) => (
              <Card
                key={assessment.id}
                className="cursor-pointer hover:bg-slate-700/30 dark:hover:bg-slate-800/30 transition-all duration-200 bg-slate-700/20 dark:bg-slate-800/20 border-slate-600/50 dark:border-slate-700/50 group hover:border-slate-500/50 dark:hover:border-slate-600/50 hover:shadow-lg"
                onClick={() => setSelectedQuiz(assessment)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-600/50 dark:bg-slate-700/50 rounded-lg flex items-center justify-center">
                        {getPerformanceIcon(assessment.quizScore)}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-100 dark:text-slate-200 flex items-center gap-2">
                          Quiz {i + 1}
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getScoreBadgeVariant(assessment.quizScore)}`}
                          >
                            {assessment.quizScore.toFixed(0)}%
                          </Badge>
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-slate-400 dark:text-slate-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(assessment.createdAt), "MMM dd, yyyy")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(assessment.createdAt), "HH:mm")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(assessment.quizScore)}`}>
                          {assessment.quizScore.toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500">Score</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors" />
                    </div>
                  </div>
                </CardHeader>

                {assessment.improvementTip && (
                  <CardContent className="pt-0">
                    <div className="bg-slate-600/30 dark:bg-slate-700/30 rounded-lg p-3 border-l-4 border-l-primary/50">
                      <div className="flex items-start gap-2">
                        <Award className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                            Improvement Tip
                          </p>
                          <p className="text-sm text-slate-200 dark:text-slate-300 leading-relaxed">
                            {assessment.improvementTip}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {assessments.length > 5 && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                className="border-slate-600 dark:border-slate-700 bg-slate-800/50 dark:bg-slate-900/50 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 text-slate-200 dark:text-slate-300"
              >
                View All Quizzes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800/95 dark:bg-slate-900/95 border-slate-700 dark:border-slate-800 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-slate-100 dark:text-slate-200">Quiz Results</DialogTitle>
          </DialogHeader>
          <QuizResult result={selectedQuiz} hideStartNew onStartNew={() => router.push("/interview/mock")} />
        </DialogContent>
      </Dialog>
    </>
  )
}

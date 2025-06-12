import { Brain, Target, Trophy, TrendingUp, TrendingDown, Minus, Calendar, Award, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StatsCards({ assessments }) {
  const getAverageScore = () => {
    if (!assessments?.length) return 0
    const total = assessments.reduce((sum, assessment) => sum + assessment.quizScore, 0)
    return (total / assessments.length).toFixed(1)
  }

  const getLatestAssessment = () => {
    if (!assessments?.length) return null
    return assessments[0]
  }

  const getTotalQuestions = () => {
    if (!assessments?.length) return 0
    return assessments.reduce((sum, assessment) => sum + assessment.questions.length, 0)
  }

  const getBestScore = () => {
    if (!assessments?.length) return 0
    return Math.max(...assessments.map((a) => a.quizScore)).toFixed(1)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBadge = (score) => {
    if (score >= 80) return { text: "Excellent", class: "bg-green-900/50 text-green-300 border-green-700/50" }
    if (score >= 60) return { text: "Good", class: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50" }
    return { text: "Improving", class: "bg-red-900/50 text-red-300 border-red-700/50" }
  }

  const getTrend = () => {
    if (!assessments?.length || assessments.length < 2)
      return { icon: Minus, color: "text-slate-400", text: "No trend" }

    const recent = assessments.slice(0, Math.ceil(assessments.length / 2))
    const older = assessments.slice(Math.ceil(assessments.length / 2))

    const recentAvg = recent.reduce((sum, a) => sum + a.quizScore, 0) / recent.length
    const olderAvg = older.reduce((sum, a) => sum + a.quizScore, 0) / older.length

    const diff = recentAvg - olderAvg

    if (diff > 2) return { icon: TrendingUp, color: "text-green-400", text: `+${diff.toFixed(1)}%` }
    if (diff < -2) return { icon: TrendingDown, color: "text-red-400", text: `${diff.toFixed(1)}%` }
    return { icon: Minus, color: "text-slate-400", text: "Stable" }
  }

  const averageScore = Number.parseFloat(getAverageScore())
  const latestScore = getLatestAssessment()?.quizScore || 0
  const bestScore = Number.parseFloat(getBestScore())
  const trend = getTrend()
  const TrendIcon = trend.icon

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Average Score Card */}
      <Card className="bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-200 dark:text-slate-300">Average Score</CardTitle>
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Trophy className="h-4 w-4 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-baseline gap-2">
            <div className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}%</div>
            {averageScore > 0 && (
              <Badge variant="secondary" className={getScoreBadge(averageScore).class}>
                {getScoreBadge(averageScore).text}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TrendIcon className={`h-3 w-3 ${trend.color}`} />
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {trend.text} • {assessments?.length || 0} assessments
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Questions Practiced Card */}
      <Card className="bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-200 dark:text-slate-300">
            Questions Practiced
          </CardTitle>
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-3xl font-bold text-slate-100 dark:text-slate-200">{getTotalQuestions()}</div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-3 w-3 text-purple-400" />
            <p className="text-xs text-slate-400 dark:text-slate-500">Total questions answered</p>
          </div>
        </CardContent>
      </Card>

      {/* Latest Score Card */}
      <Card className="bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-200 dark:text-slate-300">Latest Score</CardTitle>
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-green-400" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className={`text-3xl font-bold ${getScoreColor(latestScore)}`}>{latestScore.toFixed(1)}%</div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-green-400" />
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {getLatestAssessment()
                ? new Date(getLatestAssessment().createdAt).toLocaleDateString()
                : "No recent quiz"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Best Score Card */}
      <Card className="bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-200 dark:text-slate-300">Best Score</CardTitle>
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Award className="h-4 w-4 text-orange-400" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className={`text-3xl font-bold ${getScoreColor(bestScore)}`}>{bestScore}%</div>
          <div className="flex items-center gap-2">
            <Trophy className="h-3 w-3 text-orange-400" />
            <p className="text-xs text-slate-400 dark:text-slate-500">Personal best achievement</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

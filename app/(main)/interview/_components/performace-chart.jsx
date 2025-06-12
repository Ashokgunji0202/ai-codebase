"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react"

export default function PerformanceChart({ assessments }) {
  const [chartData, setChartData] = useState([])
  const [stats, setStats] = useState({
    average: 0,
    trend: "stable",
    improvement: 0,
    bestScore: 0,
    worstScore: 0,
  })

  useEffect(() => {
    if (assessments && assessments.length > 0) {
      const formattedData = assessments.map((assessment, index) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
        index: index + 1,
      }))

      setChartData(formattedData)

      // Calculate statistics
      const scores = assessments.map((a) => a.quizScore)
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
      const bestScore = Math.max(...scores)
      const worstScore = Math.min(...scores)

      // Calculate trend
      let trend = "stable"
      let improvement = 0
      if (scores.length >= 2) {
        const firstHalf = scores.slice(0, Math.floor(scores.length / 2))
        const secondHalf = scores.slice(Math.floor(scores.length / 2))
        const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length
        const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length
        improvement = secondAvg - firstAvg

        if (improvement > 2) trend = "up"
        else if (improvement < -2) trend = "down"
      }

      setStats({
        average: Math.round(average),
        trend,
        improvement: Math.round(Math.abs(improvement)),
        bestScore,
        worstScore,
      })
    }
  }, [assessments])

  const getTrendIcon = () => {
    switch (stats.trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <Minus className="h-4 w-4 text-slate-400" />
    }
  }

  const getTrendColor = () => {
    switch (stats.trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 dark:bg-slate-900/95 border border-slate-700 dark:border-slate-800 rounded-lg p-3 shadow-xl backdrop-blur-sm">
          <p className="text-sm font-semibold text-slate-100 dark:text-slate-200">Score: {payload[0].value}%</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
          <div className="mt-1 h-1 bg-gradient-to-r from-primary/50 to-primary rounded-full" />
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <Card className="bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100 dark:text-slate-200">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance Trend
          </CardTitle>
          <CardDescription className="text-slate-400 dark:text-slate-500">Your quiz scores over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center space-y-2">
              <BarChart3 className="h-12 w-12 text-slate-600 dark:text-slate-700 mx-auto" />
              <p className="text-slate-400 dark:text-slate-500">No assessment data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800 shadow-xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-200 dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
              <BarChart3 className="h-6 w-6 text-primary" />
              Performance Trend
            </CardTitle>
            <CardDescription className="text-slate-400 dark:text-slate-500 mt-1">
              Your quiz scores over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {stats.trend === "up" && `+${stats.improvement}% improvement`}
              {stats.trend === "down" && `-${stats.improvement}% decline`}
              {stats.trend === "stable" && "Stable performance"}
            </span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-700/50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-600/50 dark:border-slate-700/50">
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">Average</p>
            <p className="text-lg font-bold text-slate-100 dark:text-slate-200">{stats.average}%</p>
          </div>
          <div className="bg-slate-700/50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-600/50 dark:border-slate-700/50">
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">Best</p>
            <p className="text-lg font-bold text-green-400">{stats.bestScore}%</p>
          </div>
          <div className="bg-slate-700/50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-600/50 dark:border-slate-700/50">
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">Lowest</p>
            <p className="text-lg font-bold text-red-400">{stats.worstScore}%</p>
          </div>
          <div className="bg-slate-700/50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-600/50 dark:border-slate-700/50">
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">Total</p>
            <p className="text-lg font-bold text-slate-100 dark:text-slate-200">{chartData.length}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[350px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(71 85 105 / 0.3)" horizontal={true} vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgb(148 163 184)", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgb(148 163 184)", fontSize: 12 }}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="url(#scoreGradient)"
                dot={{
                  fill: "hsl(var(--primary))",
                  strokeWidth: 2,
                  stroke: "rgb(30 41 59)",
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: "hsl(var(--primary))",
                  stroke: "rgb(30 41 59)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Performance Badge */}
          <div className="absolute top-4 right-4">
            <Badge
              variant="secondary"
              className={`
                ${
                  stats.average >= 80
                    ? "bg-green-900/50 text-green-300 border-green-700/50"
                    : stats.average >= 60
                      ? "bg-yellow-900/50 text-yellow-300 border-yellow-700/50"
                      : "bg-red-900/50 text-red-300 border-red-700/50"
                }
              `}
            >
              {stats.average >= 80 ? "Excellent" : stats.average >= 60 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

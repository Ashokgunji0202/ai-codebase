"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { generateQuiz, saveQuizResult } from "@/actions/interview"
import QuizResult from "./quiz-result"
import useFetch from "@/hooks/use-fetch"
import { BarLoader } from "react-spinners"
import {
  Play,
  Brain,
  CheckCircle,
  XCircle,
  Lightbulb,
  Clock,
  Target,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Loader2,
} from "lucide-react"

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  const { loading: generatingQuiz, fn: generateQuizFn, data: quizData } = useFetch(generateQuiz)

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult)

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null))
      setQuestionStartTime(Date.now())
    }
  }, [quizData])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswer = (answer) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
      setQuestionStartTime(Date.now())
    } else {
      finishQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
      setQuestionStartTime(Date.now())
    }
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++
      }
    })
    return (correct / quizData.length) * 100
  }

  const finishQuiz = async () => {
    const score = calculateScore()
    try {
      await saveQuizResultFn(quizData, answers, score)
      toast.success("Quiz completed successfully!")
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results")
    }
  }

  const startNewQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowExplanation(false)
    setTimeSpent(0)
    generateQuizFn()
    setResultData(null)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getAnsweredCount = () => answers.filter((answer) => answer !== null).length

  if (generatingQuiz) {
    return (
      <Card className="mx-2 bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800 shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Brain className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-slate-100 dark:text-slate-200">Generating Your Quiz</h3>
            <p className="text-slate-400 dark:text-slate-500">
              Creating personalized questions based on your profile...
            </p>
          </div>
          <BarLoader width={200} color="hsl(var(--primary))" />
        </CardContent>
      </Card>
    )
  }

  // Show results if quiz is completed
  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    )
  }

  if (!quizData) {
    return (
      <Card className="mx-2 bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl md:text-3xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-200 dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
            Ready to Test Your Knowledge?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-slate-300 dark:text-slate-400 text-lg">
              Challenge yourself with 10 carefully crafted questions
            </p>
            <p className="text-slate-400 dark:text-slate-500">
              Questions are tailored to your industry and skill level. Take your time and choose the best answer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 dark:bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600/50 dark:border-slate-700/50">
              <BookOpen className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-200 dark:text-slate-300">10 Questions</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Comprehensive coverage</p>
            </div>
            <div className="bg-slate-700/50 dark:bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600/50 dark:border-slate-700/50">
              <Clock className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-200 dark:text-slate-300">No Time Limit</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Take your time</p>
            </div>
            <div className="bg-slate-700/50 dark:bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600/50 dark:border-slate-700/50">
              <Lightbulb className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-200 dark:text-slate-300">Explanations</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Learn as you go</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={generateQuizFn}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 h-12"
          >
            <Play className="mr-2 h-5 w-5" />
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const question = quizData[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.length) * 100
  const isCorrectAnswer = answers[currentQuestion] === question.correctAnswer

  return (
    <Card className="mx-2 bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800 shadow-xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-100 dark:text-slate-200">
                Question {currentQuestion + 1} of {quizData.length}
              </CardTitle>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {getAnsweredCount()} of {quizData.length} answered
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1 text-slate-300 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-mono">{formatTime(timeSpent)}</span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-slate-700 dark:bg-slate-800 text-slate-200 dark:text-slate-300">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>Progress</span>
            <span>
              {currentQuestion + 1}/{quizData.length}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-slate-700/30 dark:bg-slate-800/30 rounded-lg p-6 border border-slate-600/50 dark:border-slate-700/50">
          <p className="text-lg font-medium text-slate-100 dark:text-slate-200 leading-relaxed">{question.question}</p>
        </div>

        <RadioGroup onValueChange={handleAnswer} value={answers[currentQuestion]} className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = answers[currentQuestion] === option
            const isCorrect = option === question.correctAnswer
            const showCorrectness = showExplanation && isSelected

            return (
              <div
                key={index}
                className={`
                  flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200
                  ${
                    isSelected
                      ? "bg-primary/10 border-primary/50"
                      : "bg-slate-700/20 dark:bg-slate-800/20 border-slate-600/50 dark:border-slate-700/50 hover:bg-slate-700/30 dark:hover:bg-slate-800/30"
                  }
                  ${showCorrectness && isCorrect ? "bg-green-900/20 border-green-500/50" : ""}
                  ${showCorrectness && !isCorrect ? "bg-red-900/20 border-red-500/50" : ""}
                `}
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 text-slate-200 dark:text-slate-300 cursor-pointer">
                  {option}
                </Label>
                {showCorrectness && (
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </RadioGroup>

        {showExplanation && (
          <div className="bg-slate-700/30 dark:bg-slate-800/30 rounded-lg p-4 border-l-4 border-l-primary/50">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-200 dark:text-slate-300 mb-2">Explanation:</p>
                <p className="text-slate-300 dark:text-slate-400 leading-relaxed">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-2">
          {currentQuestion > 0 && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="border-slate-600 dark:border-slate-700 bg-slate-800/50 dark:bg-slate-900/50 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 text-slate-200 dark:text-slate-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}
          {!showExplanation && (
            <Button
              onClick={() => setShowExplanation(true)}
              variant="outline"
              disabled={!answers[currentQuestion]}
              className="border-slate-600 dark:border-slate-700 bg-slate-800/50 dark:bg-slate-900/50 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 text-slate-200 dark:text-slate-300 disabled:opacity-50"
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Show Explanation
            </Button>
          )}
        </div>

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px]"
        >
          {savingResult ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

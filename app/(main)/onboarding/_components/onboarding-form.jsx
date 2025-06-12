"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, User, Briefcase, Award, Code, FileText, CheckCircle, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useFetch from "@/hooks/use-fetch"
import { onboardingSchema } from "@/app/lib/schema"
import { updateUser } from "@/actions/user"

const OnboardingForm = ({ industries }) => {
  const router = useRouter()
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [completedSteps, setCompletedSteps] = useState(new Set())

  const { loading: updateLoading, fn: updateUserFn, data: updateResult } = useFetch(updateUser)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  })

  const onSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g, "-")}`

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      })
    } catch (error) {
      console.error("Onboarding error:", error)
    }
  }

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile completed successfully!")
      router.push("/dashboard")
      router.refresh()
    }
  }, [updateResult, updateLoading])

  const watchIndustry = watch("industry")
  const watchSubIndustry = watch("subIndustry")
  const watchExperience = watch("experience")
  const watchSkills = watch("skills")
  const watchBio = watch("bio")

  // Track completed steps
  useEffect(() => {
    const newCompletedSteps = new Set()
    if (watchIndustry) newCompletedSteps.add("industry")
    if (watchSubIndustry) newCompletedSteps.add("subIndustry")
    if (watchExperience) newCompletedSteps.add("experience")
    if (watchSkills) newCompletedSteps.add("skills")
    if (watchBio) newCompletedSteps.add("bio")
    setCompletedSteps(newCompletedSteps)
  }, [watchIndustry, watchSubIndustry, watchExperience, watchSkills, watchBio])

  const getProgressPercentage = () => {
    const totalSteps = watchIndustry ? 5 : 4 // Include subIndustry only if industry is selected
    return Math.round((completedSteps.size / totalSteps) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 dark:bg-primary/10 rounded-full border border-primary/20 dark:border-primary/20 backdrop-blur-sm">
            <User className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Profile Setup</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-white dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <p className="text-slate-300 dark:text-slate-400 max-w-xl mx-auto">
            Help us personalize your experience with tailored career insights and recommendations
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-200 dark:text-slate-300">Profile Completion</span>
              <Badge variant="secondary" className="bg-slate-700 dark:bg-slate-800 text-slate-200 dark:text-slate-300">
                {getProgressPercentage()}%
              </Badge>
            </div>
            <div className="w-full bg-slate-700 dark:bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100 dark:text-slate-200">Professional Information</CardTitle>
            <CardDescription className="text-slate-400 dark:text-slate-500">
              Tell us about your professional background to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Industry Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-400" />
                  <Label htmlFor="industry" className="text-sm font-semibold text-slate-200 dark:text-slate-300">
                    Industry
                  </Label>
                  {completedSteps.has("industry") && <CheckCircle className="h-4 w-4 text-green-400" />}
                </div>
                <Select
                  onValueChange={(value) => {
                    setValue("industry", value)
                    setSelectedIndustry(industries.find((ind) => ind.id === value))
                    setValue("subIndustry", "")
                  }}
                >
                  <SelectTrigger
                    id="industry"
                    className="h-11 bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200"
                  >
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 dark:bg-slate-900 border-slate-700 dark:border-slate-800">
                    <SelectGroup>
                      <SelectLabel className="text-slate-400 dark:text-slate-500">Industries</SelectLabel>
                      {industries.map((ind) => (
                        <SelectItem
                          key={ind.id}
                          value={ind.id}
                          className="text-slate-200 dark:text-slate-300 focus:bg-slate-700 dark:focus:bg-slate-800"
                        >
                          {ind.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.industry.message}
                  </p>
                )}
              </div>

              {/* Specialization */}
              {watchIndustry && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-400" />
                    <Label htmlFor="subIndustry" className="text-sm font-semibold text-slate-200 dark:text-slate-300">
                      Specialization
                    </Label>
                    {completedSteps.has("subIndustry") && <CheckCircle className="h-4 w-4 text-green-400" />}
                  </div>
                  <Select onValueChange={(value) => setValue("subIndustry", value)}>
                    <SelectTrigger
                      id="subIndustry"
                      className="h-11 bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200"
                    >
                      <SelectValue placeholder="Select your specialization" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 dark:bg-slate-900 border-slate-700 dark:border-slate-800">
                      <SelectGroup>
                        <SelectLabel className="text-slate-400 dark:text-slate-500">Specializations</SelectLabel>
                        {selectedIndustry?.subIndustries.map((sub) => (
                          <SelectItem
                            key={sub}
                            value={sub}
                            className="text-slate-200 dark:text-slate-300 focus:bg-slate-700 dark:focus:bg-slate-800"
                          >
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.subIndustry && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {errors.subIndustry.message}
                    </p>
                  )}
                </div>
              )}

              {/* Experience */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-green-400" />
                  <Label htmlFor="experience" className="text-sm font-semibold text-slate-200 dark:text-slate-300">
                    Years of Experience
                  </Label>
                  {completedSteps.has("experience") && <CheckCircle className="h-4 w-4 text-green-400" />}
                </div>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="Enter years of experience"
                  className="h-11 bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  {...register("experience")}
                />
                {errors.experience && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.experience.message}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-orange-400" />
                  <Label htmlFor="skills" className="text-sm font-semibold text-slate-200 dark:text-slate-300">
                    Skills
                  </Label>
                  {completedSteps.has("skills") && <CheckCircle className="h-4 w-4 text-green-400" />}
                </div>
                <Input
                  id="skills"
                  placeholder="e.g., Python, JavaScript, Project Management"
                  className="h-11 bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  {...register("skills")}
                />
                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Code className="h-3 w-3" />
                  Separate multiple skills with commas
                </p>
                {errors.skills && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.skills.message}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-teal-400" />
                  <Label htmlFor="bio" className="text-sm font-semibold text-slate-200 dark:text-slate-300">
                    Professional Bio
                  </Label>
                  {completedSteps.has("bio") && <CheckCircle className="h-4 w-4 text-green-400" />}
                </div>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your professional background, achievements, and career goals..."
                  className="min-h-[120px] resize-none bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold"
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Complete Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Your information is secure and will only be used to personalize your experience
          </p>
        </div>
      </div>
    </div>
  )
}

export default OnboardingForm

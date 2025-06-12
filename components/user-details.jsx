"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Loader2, Save, Briefcase, AlertTriangle } from "lucide-react"
import { useUser } from "@clerk/nextjs"

const userDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  industry: z.string().optional(),
  experience: z.number().min(0, "Experience must be 0 or greater").optional(),
  skills: z.string().optional(),
  bio: z.string().optional(),
})

// API functions
const fetchUserDetails = async () => {
  const response = await fetch("/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user details")
  }

  return response.json()
}

const updateUserDetails = async (userData) => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error("Failed to update user details")
  }

  return response.json()
}

export default function UserDetailsDialog() {
  const [open, setOpen] = useState(false)
  const { user } = useUser()
  const [userDetails, setUserDetails] = useState(null)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [fetchingDetails, setFetchingDetails] = useState(false)
  const [updatingUser, setUpdatingUser] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      industry: "",
      experience: 0,
      skills: "",
      bio: "",
    },
  })

  // Load user details when dialog opens
  useEffect(() => {
    if (open && !isDataLoaded) {
      const loadData = async () => {
        try {
          setFetchingDetails(true)
          const details = await fetchUserDetails()
          console.log("Fetched user details:", details)
          setUserDetails(details)
          setIsDataLoaded(true)

          // Convert skills array to comma-separated string
          const skillsString = Array.isArray(details.skills) ? details.skills.join(", ") : details.skills || ""

          // Set form values with explicit setValue calls
          setValue("name", details.name || "")
          setValue("email", details.email || "")
          setValue("industry", details.industry || "")
          setValue("experience", details.experience || 0)
          setValue("skills", skillsString)
          setValue("bio", details.bio || "")

          // Also use reset as backup
          reset({
            name: details.name || "",
            email: details.email || "",
            industry: details.industry || "",
            experience: details.experience || 0,
            skills: skillsString,
            bio: details.bio || "",
          })

          console.log("Form values set:", {
            name: details.name,
            email: details.email,
            industry: details.industry,
            experience: details.experience,
            skills: skillsString,
            bio: details.bio,
          })
        } catch (error) {
          
          toast.error("Failed to load user details")
          
            setUserDetails(fallbackData)
            reset(fallbackData)
            setIsDataLoaded(true)
          
        } finally {
          setFetchingDetails(false)
        }
      }

      loadData()
    }
  }, [open, isDataLoaded, setValue, reset, user])

  // Reset data loaded flag when dialog closes
  useEffect(() => {
    if (!open) {
      setIsDataLoaded(false)
      setUserDetails(null)
    }
  }, [open])

  const onSubmit = async (data) => {
    try {
      console.log("Submitting data:", data)
      setUpdatingUser(true)

      // Convert skills string back to array for submission
      const submissionData = {
        name: data.name,
        email: data.email,
        industry: data.industry || "",
        experience: data.experience || 0,
        bio: data.bio || "",
        skills: data.skills
          ? data.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : [],
      }

      console.log("Processed submission data:", submissionData)
      const updatedUser = await updateUserDetails(submissionData)
      console.log("Updated user response:", updatedUser)

      toast.success("Profile updated successfully!")
      setUserDetails({ ...userDetails, ...updatedUser })
      setOpen(false)
    } catch (error) {
      toast.error("Failed to update profile")
      console.error("Update error:", error)
    } finally {
      setUpdatingUser(false)
    }
  }

  const watchedFields = watch()
  const getCompletionPercentage = () => {
    const fields = ["name", "email", "industry", "experience", "skills", "bio"]
    const completed = fields.filter((field) => {
      const value = watchedFields[field]
      if (field === "experience") {
        return value !== null && value !== undefined && value >= 0
      }
      return value !== null && value !== undefined && value !== ""
    }).length
    return Math.round((completed / fields.length) * 100)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-200 dark:text-slate-300 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 hover:text-white transition-all duration-200"
        >
          <Settings className="h-4 w-4 md:mr-2" />
          <span className="hidden md:block">Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800/95 dark:bg-slate-900/95 border-slate-700 dark:border-slate-800 backdrop-blur-sm">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl text-slate-100 dark:text-slate-200">Profile Settings</DialogTitle>
              <DialogDescription className="text-slate-400 dark:text-slate-500">
                Update your personal and professional information
              </DialogDescription>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-slate-700/30 dark:bg-slate-800/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-200 dark:text-slate-300">Profile Completion</span>
              <Badge variant="secondary" className="bg-slate-700 dark:bg-slate-800 text-slate-200 dark:text-slate-300">
                {getCompletionPercentage()}%
              </Badge>
            </div>
            <div className="w-full bg-slate-600 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </div>
        </DialogHeader>

        {fetchingDetails ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-slate-400 dark:text-slate-500">Loading your details...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 dark:text-slate-200 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-400" />
                Basic Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-200 dark:text-slate-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200"
                />
                {errors.name && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-200 dark:text-slate-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200"
                />
                {errors.email && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 dark:text-slate-200 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-green-400" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium text-slate-200 dark:text-slate-300">
                    Industry
                  </Label>
                  <Input
                    id="industry"
                    {...register("industry")}
                    placeholder="e.g., Software Development"
                    className="bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium text-slate-200 dark:text-slate-300">
                    Years of Experience
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    {...register("experience", { valueAsNumber: true })}
                    placeholder="e.g., 5"
                    className="bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm font-medium text-slate-200 dark:text-slate-300">
                  Skills
                </Label>
                <Input
                  id="skills"
                  {...register("skills")}
                  placeholder="e.g., React, Node.js, Python"
                  className="bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">Separate skills with commas</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-slate-200 dark:text-slate-300">
                  Professional Bio
                </Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="Tell us about your professional background..."
                  className="min-h-[100px] bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-slate-600 dark:border-slate-700 text-slate-200 dark:text-slate-300 hover:bg-slate-700/50 dark:hover:bg-slate-800/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updatingUser || !isDirty}
                className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]"
              >
                {updatingUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

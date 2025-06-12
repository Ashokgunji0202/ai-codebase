"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
  User,
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  Code,
} from "lucide-react"
import { toast } from "sonner"
import MDEditor from "@uiw/react-md-editor"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { saveResume } from "@/actions/resume"
import { EntryForm } from "./entry-form"
import useFetch from "@/hooks/use-fetch"
import { useUser } from "@clerk/nextjs"
import { entriesToMarkdown } from "@/app/lib/helper"
import { resumeSchema } from "@/app/lib/schema"
import html2pdf from "html2pdf.js/dist/html2pdf.min.js"

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit")
  const [previewContent, setPreviewContent] = useState(initialContent)
  const { user } = useUser()
  const [resumeMode, setResumeMode] = useState("preview")

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  })

  const { loading: isSaving, fn: saveResumeFn, data: saveResult, error: saveError } = useFetch(saveResume)

  // Watch form fields for preview updates
  const formValues = watch()

  useEffect(() => {
    if (initialContent) setActiveTab("preview")
  }, [initialContent])

  // Update preview content when form values change
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent()
      setPreviewContent(newContent ? newContent : initialContent)
    }
  }, [formValues, activeTab])

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!")
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume")
    }
  }, [saveResult, saveError, isSaving])

  const getContactMarkdown = () => {
    const { contactInfo } = formValues
    const parts = []
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`)
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`)
    if (contactInfo.linkedin) parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`)
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`)

    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : ""
  }

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n")
  }

  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      const element = document.getElementById("resume-pdf")
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }

      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error("PDF generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim()

      console.log(previewContent, formattedContent)
      await saveResumeFn(previewContent)
    } catch (error) {
      console.error("Save error:", error)
    }
  }

  return (
    <div
      data-color-mode="dark"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 dark:bg-primary/10 rounded-full border border-primary/20 dark:border-primary/20 backdrop-blur-sm">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Professional Resume Builder</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-slate-200 to-white dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
            Build Your Perfect Resume
          </h1>
          <p className="text-lg text-slate-300 dark:text-slate-400 max-w-2xl mx-auto">
            Create a professional resume with our intuitive builder. Edit in form mode or customize with markdown.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            size="lg"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="min-w-[140px] shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Resume
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={generatePDF}
            disabled={isGenerating}
            className="min-w-[140px] shadow-lg hover:shadow-xl transition-all duration-200 border-slate-600 dark:border-slate-700 bg-slate-800/50 dark:bg-slate-900/50 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 text-slate-200 dark:text-slate-300 backdrop-blur-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>

        {/* Main Content */}
        <Card className="shadow-2xl border-slate-700 dark:border-slate-800 bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-slate-700 dark:border-slate-800 bg-slate-800/50 dark:bg-slate-900/50 px-6 py-4">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-slate-700 dark:bg-slate-800 shadow-sm">
                  <TabsTrigger
                    value="edit"
                    className="flex items-center gap-2 data-[state=active]:bg-slate-600 dark:data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300"
                  >
                    <Edit className="h-4 w-4" />
                    Form Editor
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="flex items-center gap-2 data-[state=active]:bg-slate-600 dark:data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300"
                  >
                    <Monitor className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="edit" className="p-6 space-y-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Contact Information */}
                  <Card className="border-l-4 border-l-blue-400 dark:border-l-blue-500 shadow-sm bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-slate-100 dark:text-slate-200">
                        <User className="h-5 w-5 text-blue-400 dark:text-blue-500" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-200 dark:text-slate-300">
                            Email Address
                          </label>
                          <Input
                            {...register("contactInfo.email")}
                            type="email"
                            placeholder="your@email.com"
                            className="h-11 bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          />
                          {errors.contactInfo?.email && (
                            <p className="text-sm text-red-400 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {errors.contactInfo.email.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-200 dark:text-slate-300">
                            Phone Number
                          </label>
                          <Input
                            {...register("contactInfo.mobile")}
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            className="h-11 bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          />
                          {errors.contactInfo?.mobile && (
                            <p className="text-sm text-red-400 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {errors.contactInfo.mobile.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-200 dark:text-slate-300">
                            LinkedIn Profile
                          </label>
                          <Input
                            {...register("contactInfo.linkedin")}
                            type="url"
                            placeholder="https://linkedin.com/in/your-profile"
                            className="h-11 bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          />
                          {errors.contactInfo?.linkedin && (
                            <p className="text-sm text-red-400 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {errors.contactInfo.linkedin.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-200 dark:text-slate-300">
                            Twitter/X Profile
                          </label>
                          <Input
                            {...register("contactInfo.twitter")}
                            type="url"
                            placeholder="https://twitter.com/your-handle"
                            className="h-11 bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          />
                          {errors.contactInfo?.twitter && (
                            <p className="text-sm text-red-400 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {errors.contactInfo.twitter.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Professional Summary */}
                  <Card className="border-l-4 border-l-green-400 dark:border-l-green-500 shadow-sm bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-slate-100 dark:text-slate-200">
                        <FileText className="h-5 w-5 text-green-400 dark:text-green-500" />
                        Professional Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Controller
                        name="summary"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            className="min-h-[120px] resize-none bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="Write a compelling professional summary that highlights your key achievements and career objectives..."
                          />
                        )}
                      />
                      {errors.summary && (
                        <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {errors.summary.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card className="border-l-4 border-l-purple-400 dark:border-l-purple-500 shadow-sm bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-slate-100 dark:text-slate-200">
                        <Award className="h-5 w-5 text-purple-400 dark:text-purple-500" />
                        Skills & Expertise
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Controller
                        name="skills"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            className="min-h-[120px] resize-none bg-slate-700/50 dark:bg-slate-800/50 border-slate-600 dark:border-slate-700 text-slate-100 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="List your key technical and soft skills, separated by commas or bullet points..."
                          />
                        )}
                      />
                      {errors.skills && (
                        <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {errors.skills.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Work Experience */}
                  <Card className="border-l-4 border-l-orange-400 dark:border-l-orange-500 shadow-sm bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-slate-100 dark:text-slate-200">
                        <Briefcase className="h-5 w-5 text-orange-400 dark:text-orange-500" />
                        Work Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Controller
                        name="experience"
                        control={control}
                        render={({ field }) => (
                          <EntryForm type="Experience" entries={field.value} onChange={field.onChange} />
                        )}
                      />
                      {errors.experience && (
                        <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {errors.experience.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Education */}
                  <Card className="border-l-4 border-l-indigo-400 dark:border-l-indigo-500 shadow-sm bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-slate-100 dark:text-slate-200">
                        <GraduationCap className="h-5 w-5 text-indigo-400 dark:text-indigo-500" />
                        Education
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Controller
                        name="education"
                        control={control}
                        render={({ field }) => (
                          <EntryForm type="Education" entries={field.value} onChange={field.onChange} />
                        )}
                      />
                      {errors.education && (
                        <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {errors.education.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Projects */}
                  <Card className="border-l-4 border-l-teal-400 dark:border-l-teal-500 shadow-sm bg-slate-800/50 dark:bg-slate-900/50 border-slate-700 dark:border-slate-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-slate-100 dark:text-slate-200">
                        <Code className="h-5 w-5 text-teal-400 dark:text-teal-500" />
                        Projects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Controller
                        name="projects"
                        control={control}
                        render={({ field }) => (
                          <EntryForm type="Project" entries={field.value} onChange={field.onChange} />
                        )}
                      />
                      {errors.projects && (
                        <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {errors.projects.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </form>
              </TabsContent>

              <TabsContent value="preview" className="p-6">
                <div className="space-y-4">
                  {activeTab === "preview" && (
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-sm bg-slate-700 dark:bg-slate-800 text-slate-200 dark:text-slate-300"
                      >
                        Live Preview
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}
                        className="flex items-center gap-2 border-slate-600 dark:border-slate-700 bg-slate-800/50 dark:bg-slate-900/50 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 text-slate-200 dark:text-slate-300"
                      >
                        {resumeMode === "preview" ? (
                          <>
                            <Edit className="h-4 w-4" />
                            Edit Markdown
                          </>
                        ) : (
                          <>
                            <Monitor className="h-4 w-4" />
                            Preview Mode
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {activeTab === "preview" && resumeMode !== "preview" && (
                    <div className="flex p-4 gap-3 items-start border-2 border-amber-500/50 dark:border-amber-600/50 bg-amber-900/20 dark:bg-amber-900/10 text-amber-200 dark:text-amber-300 rounded-lg backdrop-blur-sm">
                      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Warning</p>
                        <p className="text-sm opacity-90">
                          Manual markdown changes will be lost if you update the form data. Save your changes before
                          switching tabs.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border border-slate-700 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm bg-slate-800/30 dark:bg-slate-900/30">
                    <MDEditor
                      value={previewContent}
                      onChange={setPreviewContent}
                      height={800}
                      preview={resumeMode}
                      data-color-mode="dark"
                    />
                  </div>
                </div>

                <div className="hidden">
                  <div id="resume-pdf">
                    <MDEditor.Markdown
                      source={previewContent}
                      style={{
                        background: "white",
                        color: "black",
                        padding: "20px",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

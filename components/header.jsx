import { Button } from "./ui/button"
import { PenBox, LayoutDashboard, FileText, GraduationCap, ChevronDown, StarsIcon } from "lucide-react"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { checkUser } from "@/lib/checkUser"
import UserDetailsDialog from "./user-details"

export default async function Header() {
  await checkUser()

  return (
    <header className="fixed top-0 w-full border-b border-slate-700/50 dark:border-slate-800/50 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl z-50 shadow-lg">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-blue-500 font-bold text-lg">Ai</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent hidden sm:block">
            Ai Codder
          </span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <SignedIn>
            {/* Dashboard Link */}
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="hidden md:inline-flex items-center gap-2 text-slate-200 dark:text-slate-300 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 hover:text-white transition-all duration-200"
              >
                <LayoutDashboard className="h-4 w-4" />
                Industry Insights
              </Button>
              <Button
                variant="ghost"
                className="md:hidden w-10 h-10 p-0 text-slate-200 dark:text-slate-300 hover:bg-slate-800/50 dark:hover:bg-slate-800/50"
              >
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200">
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-slate-800/95 dark:bg-slate-900/95 border-slate-700 dark:border-slate-800 backdrop-blur-sm shadow-xl"
              >
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Career Tools
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-slate-700 dark:bg-slate-800" />
                <DropdownMenuItem asChild>
                  <Link
                    href="/resume"
                    className="flex items-center gap-3 px-3 py-2 text-slate-200 dark:text-slate-300 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Build Resume</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Create professional resume</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-3 px-3 py-2 text-slate-200 dark:text-slate-300 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <PenBox className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Cover Letter</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">AI-powered cover letters</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/interview"
                    className="flex items-center gap-3 px-3 py-2 text-slate-200 dark:text-slate-300 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">Interview Prep</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Practice with AI</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Details Dialog */}
            <UserDetailsDialog />

            {/* User Button */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-slate-700 dark:ring-slate-800 hover:ring-primary/50 transition-all",
                  userButtonPopoverCard:
                    "shadow-2xl bg-slate-800 dark:bg-slate-900 border-slate-700 dark:border-slate-800",
                  userPreviewMainIdentifier: "font-semibold text-slate-100 dark:text-slate-200",
                  userPreviewSecondaryIdentifier: "text-slate-400 dark:text-slate-500",
                  userButtonPopoverActionButton:
                    "text-slate-200 dark:text-slate-300 hover:bg-slate-700 dark:hover:bg-slate-800",
                  userButtonPopoverActionButtonText: "text-slate-200 dark:text-slate-300",
                  userButtonPopoverActionButtonIcon: "text-slate-400 dark:text-slate-500",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button
                variant="outline"
                className="border-slate-600 dark:border-slate-700 bg-slate-800/50 dark:bg-slate-900/50 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 text-slate-200 dark:text-slate-300 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  )
}

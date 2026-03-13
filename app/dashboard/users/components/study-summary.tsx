"use client"

import type { StudySummary as StudySummaryType } from "../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Award,
  TrendingUp,
  Activity
} from "lucide-react"

interface StudySummaryProps {
  studySummary: StudySummaryType
}

export function StudySummary({ studySummary }: StudySummaryProps) {
  const completionRate = studySummary.totalCoursesAdded > 0 
    ? Math.round((studySummary.totalCoursesCompleted / studySummary.totalCoursesAdded) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{studySummary.totalCoursesAdded}</p>
                <p className="text-sm text-muted-foreground">Courses Added</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{studySummary.totalCoursesCompleted}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{studySummary.totalCEHours}</p>
                <p className="text-sm text-muted-foreground">CE Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{studySummary.certificatesUploaded}</p>
                <p className="text-sm text-muted-foreground">Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completion Rate</span>
              <Badge variant={completionRate >= 70 ? "default" : completionRate >= 40 ? "secondary" : "destructive"}>
                {completionRate}%
              </Badge>
            </div>
            
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  completionRate >= 70 ? "bg-green-500" : 
                  completionRate >= 40 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${completionRate}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-lg font-semibold text-green-600">
                  {studySummary.totalCoursesCompleted}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-lg font-semibold text-orange-600">
                  {studySummary.totalCoursesAdded - studySummary.totalCoursesCompleted}
                </p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm">{studySummary.recentActivity}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type { Course } from "../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Award,
  PlayCircle
} from "lucide-react"

interface CourseSummaryProps {
  courses: Course[]
}

export function CourseSummary({ courses }: CourseSummaryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <PlayCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getProgressPercentage = (hoursCompleted: number, hoursRequired: number) => {
    return Math.round((hoursCompleted / hoursRequired) * 100)
  }

  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No courses enrolled yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Course Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => {
            const progressPercentage = getProgressPercentage(course.hoursCompleted, course.hoursRequired)
            
            return (
              <div key={course.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{course.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`flex items-center gap-1 ${getStatusColor(course.status)}`}>
                        {getStatusIcon(course.status)}
                        {course.status}
                      </Badge>
                      {course.certificateUploaded && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Certificate
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {course.hoursCompleted} / {course.hoursRequired} hours
                    </span>
                  </div>
                  
                  <Progress 
                    value={progressPercentage} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{progressPercentage}% complete</span>
                    {course.status === "Completed" && course.certificateUploaded && (
                      <span className="text-green-600">✓ Certificate uploaded</span>
                    )}
                    {course.status === "Completed" && !course.certificateUploaded && (
                      <span className="text-orange-600">⚠ Certificate pending</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

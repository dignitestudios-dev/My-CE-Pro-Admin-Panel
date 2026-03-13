export interface Course {
  id: number
  name: string
  status: "In Progress" | "Completed"
  hoursCompleted: number
  hoursRequired: number
  certificateUploaded: boolean
}

export interface StudySummary {
  totalCoursesAdded: number
  totalCoursesCompleted: number
  totalCEHours: number
  certificatesUploaded: number
  recentActivity: string
}

export interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: string
  plan: string
  billing: string
  status: "Active" | "Suspended" | "Deactivated"
  joinedDate: string
  lastLogin: string
  profession: string
  licenseNumber: string
  licenseExpiry: string
  activityStatus: "Recently active" | "Inactive"
  studySummary: StudySummary
  courses: Course[]
}

export interface UserFormValues {
  name: string
  email: string
  role: string
  plan: string
  billing: string
  status: "Active" | "Suspended" | "Deactivated"
  profession: string
  licenseNumber: string
  licenseExpiry: string
}

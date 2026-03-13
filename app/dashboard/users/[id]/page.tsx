"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { fetchUserById } from "@/lib/slices/userSlice";
import { AppDispatch, RootState } from "@/lib/store";

interface User {
  id: string;
  fullName: string;
  email: string;
  profession: string;
  department: string;
  phoneNumber: string;
  licenseNumber: string;
  licenseExpiry: string;
  accountStatus: "Active" | "Inactive" | "Suspended";
  lastActivity: string;
  registrationDate: string;
  avatarUrl?: string;
}

interface StudySummary {
  totalCoursesAdded: number;
  totalCoursesCompleted: number;
  totalCEHours: number;
  certificateUploads: number;
  recentActivity: string;
}

interface Course {
  id: string;
  name: string;
  institution: string;
  status: "In Progress" | "Completed";
  hoursCompleted: number;
  hoursRequired: number;
  certificateUploaded: boolean;
  completionYear?: string;
}

export default function IdPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userDetail, loading, error } = useSelector((state: RootState) => state.users);
  const params = useParams();
  const { id } = params;

  const [showActionMenu, setShowActionMenu] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      dispatch(fetchUserById(id));
    }
  }, [id, dispatch])
  // Dummy user data; aap real API call se replace kar sakte ho
  
  const studySummary: StudySummary = {
    totalCoursesAdded: 12,
    totalCoursesCompleted: 8,
    totalCEHours: 24.5,
    certificateUploads: 8,
    recentActivity: 'Completed "Patient Safety" course on Feb 20, 2024',
  };

  


   
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      case "Suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
    const user = {
    id: userDetail?._id || "",
    fullName: userDetail?.fullName || "Unknown",
    email: userDetail?.emailAddress || "",
    profession: userDetail?.profession || "-",
    department: "-", // agar API me nahi hai
    phoneNumber: "-", // agar API me nahi hai
    licenseNumber: userDetail?.licenseNumber?.toString() || "-",
    licenseExpiry: userDetail?.licenseExpiry || "",
    accountStatus: userDetail?.accountStatus ? "Active" : "Inactive",
    lastActivity: userDetail?.lastActivity || "",
    registrationDate: "-", // agar API me nahi hai
    avatarUrl: `https://ui-avatars.com/api/?name=${userDetail?.fullName || "User"}`,
    totalCourses: 0, // Default values since not in API
    courses: [], // Default empty array
    completedCourses: 0, // Default value
    totalCEMinutes: 0, // Default value
    certificateUploadCount: 0 // Default value
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 p-2 hover:bg-gray-200 rounded-full transition-colors inline-flex items-center gap-2"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm text-gray-700">Back to Users</span>
        </button>

        {/* Header Card with shade */}
        <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-2xl font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1 flex flex-col items-start justify-start ">
                  {user.fullName} 
                
                  <span>{user?.email}</span>
                </h1>
                <p className="text-sm text-blue-600 font-medium mb-2">
                  {user.profession} | {user.department}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    user.accountStatus
                  )}`}
                >
                  {user.accountStatus}
                </span>
              </div>
            </div>

            {/* Action Menu */}
            <div className="relative">
              <button
                onClick={() => setShowActionMenu(!showActionMenu)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Actions
              </button>

              {showActionMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <button
                    onClick={() => {
                      console.log("Activate", user.id);
                      setShowActionMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                  >
                    Activate Account
                  </button>
                  <button
                    onClick={() => {
                      console.log("Deactivate", user.id);
                      setShowActionMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                  >
                    Deactivate Account
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      console.log("Suspend", user.id);
                      setShowActionMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-sm text-red-600"
                  >
                    Suspend User
                  </button>
                </div>
              
              )}
             <div>
  {user.licenseExpiry
    ? new Date(user.licenseExpiry).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"}
</div>
            </div>
            
          </div>
        </div>

        {/* Study Summary Card with shade */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Study Summary</h2>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Courses Added</p>
              <p className="text-3xl font-bold text-gray-900">{user.totalCourses}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Courses Completed</p>
              <p className="text-3xl font-bold text-green-600">{user.completedCourses}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total CE Hours</p>
              <p className="text-3xl font-bold text-blue-600">{ user?.totalCEMinutes}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Certificates Uploaded</p>
              <p className="text-3xl font-bold text-purple-600">{user.certificateUploadCount}</p>
            </div>
          </div>
        </div>

        {/* Courses Card with shade */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-4">
  <h2 className="text-lg font-semibold text-gray-700 mb-4">Course Summary</h2>
  {user.courses.map((course: any) => (
    <div
      key={course.id}
      className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 cursor-pointer hover:bg-gray-50 "
     >
      {/* Top row: Name, Institution, Year */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{course.name}</h3>
          <p className="text-sm text-gray-500">{course.institution}</p>
        </div>
        <span className="text-sm font-semibold">{course.completionYear}</span>
      </div>

      {/* Status / Hours / Certificate */}
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div>
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              course.status === "Completed"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {course.status}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Hours Progress</p>
          <p className="text-sm font-semibold text-gray-900">
            {course.hoursCompleted} / {course.hoursRequired} hrs
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Certificate</p>
          <p
            className={`text-sm font-semibold ${
              course.certificateUploaded ? "text-green-600" : "text-gray-400"
            }`}
          >
            {course.certificateUploaded ? "Uploaded" : "Not Uploaded"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${
              course.status === "Completed" ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{
              width: `${(course.hoursCompleted / course.hoursRequired) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  deactivateUser,
  fetchUserById,
  fetchUserCourses,
  reactivateUser,
} from "@/lib/slices/userSlice";
import { AppDispatch, RootState } from "@/lib/store";
import CourseDetailModal, { Course } from "../components/course-detail-modal";

export default function IdPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userDetail, loading, userCourses } = useSelector((state: RootState) => state.users);

  const params = useParams();
  const { id } = params;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(fetchUserById(id));
    }
  }, [id, dispatch]);

 const handleCourseClick = (courseId: string) => {
    if (id && typeof id === "string") {
      dispatch(fetchUserCourses(courseId));
     setSelectedCourse(userCourses)
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleDeactivate = () => {
    if (!userDetail?._id) return;
    dispatch(deactivateUser(userDetail._id));
    setShowActionMenu(false);
  };

  const handleActivate = () => {
    if (!userDetail?._id) return;
    dispatch(reactivateUser(userDetail._id));
    setShowActionMenu(false);
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

  // ✅ Map API data to UI
  const user = {
    id: userDetail?._id || "",
    fullName: userDetail?.fullName || "Unknown",
    email: userDetail?.emailAddress || "",
    profession: userDetail?.profession || "-",
    licenseNumber: userDetail?.licenseNumber?.toString() || "-",
    licenseExpiry: userDetail?.licenseExpiry || "",
    accountStatus: userDetail?.accountStatus ? "Active" : "Inactive",
    lastActivity: userDetail?.lastActivity || "",
    totalCourses: userDetail?.totalCourses ?? 0,
    completedCourses: userDetail?.completedCourses ?? 0,
    totalCEMinutes: userDetail?.totalCEMinutes ?? 0,
    certificateUploadCount: userDetail?.certificateUploadCount ?? 0,
    avatarUrl: `https://ui-avatars.com/api/?name=${userDetail?.fullName || "User"}`,
    courses:
      userDetail?.courses?.map((course: any) => ({
        _id: course._id,
        name: course.name,
        institute: course.institute || course.institution || "-",
        startDate: course.startDate || null,
        endDate: course.endDate || null,
        certificate: course.certificate || null,
        minsRequired: course.minsRequired,
        completedMinutes: course.completedMinutes,
        status: (
          course.status?.toLowerCase() === "completed"
            ? "completed"
            : course.status?.toLowerCase() === "inprogress"
            ? "inProgress"
            : course.status?.toLowerCase() === "active"
            ? "active"
            : "pending"
        ) as "pending" | "active" | "completed" | "inProgress",
        completionPercentage: Math.min(
          (course.completedMinutes / course.minsRequired) * 100,
          100
        ),
      })) || [],
  };

  return (
    <div className="min-h-screen p-3">
      <h2 className="text-2xl font-bold text-gray-900 ">User Details</h2>
        <button
          onClick={() => window.history.back()}
          className="mb-6 p-2 hover:bg-gray-200  rounded-full transition-colors inline-flex items-center gap-2"
        >
          <span className="text-sm text-primary">Back to Users</span>
        </button>
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}

        {/* Header Card */}
        <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl flex flex-col font-bold text-gray-900 mb-1">
                  {user.fullName}
                  <span>{user.email}</span>
                </h1>
                <p className="text-sm text-blue-600 font-medium mb-2">
                  {user.profession}
                </p>
              
              </div>
            </div>

            {/* Action Menu */}
            <div className="relative  flex gap-3">
              <div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    user.accountStatus
                  )}`}
                >
                  {user.accountStatus}
                </span>
                </div>
              <button
                onClick={() => setShowActionMenu(!showActionMenu)}
                className="cursor-pointer px-4 py-1 bg-primary text-white rounded-lg font-medium transition-colors text-sm"
              >
                Actions
              </button>
              {showActionMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <button
                    onClick={handleActivate}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                  >
                    Activate Account
                  </button>
                  <button
                    onClick={handleDeactivate}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                  >
                    Deactivate Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Study Summary */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Study Summary</h2>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Courses Added</p>
              <p className="text-3xl font-bold text-secondary">{user.totalCourses}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Courses Completed</p>
              <p className="text-3xl font-bold text-primary">{user.completedCourses}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total CE Hours</p>
              <p className="text-3xl font-bold text-secondary">{user.totalCEMinutes}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Certificates Uploaded</p>
              <p className="text-3xl font-bold text-purple-600">{user.certificateUploadCount}</p>
            </div>
          </div>
        </div>

        {/* Course Summary */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Course Summary</h2>
          {user.courses.map((course) => {
            const progressPercent = Math.min(
              (course.completedMinutes / course.minsRequired) * 100,
              100
            );
            const isCompleted = course.status === "completed";
            return (
              <div
                key={course._id}
                onClick={() => handleCourseClick(course._id)}
                className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-500">{course.institute}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        isCompleted ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {isCompleted ? "Completed" : "In Progress"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Minutes Progress</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {course.completedMinutes} / {course.minsRequired} mins
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${isCompleted ? "bg-primary" : "bg-secondary"}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Detail Modal */}
      <CourseDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        data={selectedCourse}
        loading={loading}
      />
    </div>
  );
}
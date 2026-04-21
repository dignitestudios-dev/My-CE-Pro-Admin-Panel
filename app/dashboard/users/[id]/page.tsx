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
  const { userDetail, loading, userCourses } = useSelector(
    (state: RootState) => state.users
  );

  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(fetchUserById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (userCourses && isModalOpen) {
      setSelectedCourse(userCourses);
    }
  }, [userCourses, isModalOpen]);

  const handleCourseClick = (courseId: string) => {
    if (id && typeof id === "string") {
      dispatch(fetchUserCourses(courseId));
      setIsModalOpen(true);
    }
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

  // ✅ Account Status UI
  const getAccountStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ✅ Course Status UI (FIXED)
  const getCourseStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          text: "Completed",
          className: "bg-green-100 text-green-700",
        };
      case "inprogress":
      case "in progress":
        return {
          text: "In Progress",
          className: "bg-blue-100 text-blue-700",
        };
      case "pending":
        return {
          text: "Pending",
          className: "bg-yellow-100 text-yellow-700",
        };
      default:
        return {
          text: "Pending",
          className: "bg-gray-100 text-gray-700",
        };
    }
  };

  const user = {
    profile : userDetail?.profilePicture ||"https://ui-avatars.com/api/?name",
    fullName: userDetail?.fullName || "Unknown",
    email: userDetail?.emailAddress || "",
    profession: userDetail?.profession || "-",
    accountStatus: userDetail?.accountStatus ? "Active" : "Inactive",
    totalCourses: userDetail?.totalCourses ?? 0,
    completedCourses: userDetail?.completedCourses ?? 0,
    totalCEMinutes: userDetail?.totalCEMinutes ?? 0,
    licenseNumber: userDetail?.licenseNumber ,
    licenseExpiry: userDetail?.licenseExpiry ,
    certificateUploadCount: userDetail?.certificateUploadCount ?? 0,
    avatarUrl: `https://ui-avatars.com/api/?name=${
      userDetail?.fullName || "User"
    }`,
    courses:
      userDetail?.courses?.map((course: any) => ({
        _id: course._id,
        name: course.name,
        institute: course.institute || "-",
        minsRequired: course.minsRequired,
        completedMinutes: course.completedMinutes,
        status: course.status,
      })) || [],
  };

  return (
    <div className="min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-2">User Details</h2>

      <button
        onClick={() => window.history.back()}
        className="mb-6 text-primary text-sm"
      >
        ← Back to Users
      </button>

      <div className="max-w-6xl mx-auto">

        {/* Profile */}
        <div className="bg-white shadow rounded-lg p-6 mb-4 flex justify-between ">
          <div className=" flex items-center  ">
          <div className="flex gap-4">
            <img
              src={user.profile || user.avatarUrl }
              className="w-16 h-16 rounded-full"
            />

            <div>
              <h1 className="text-xl font-bold">{user.fullName}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <p className="text-blue-600 text-sm">{user.profession}</p>
            </div>
          </div>
          
</div>
          <div className="relative flex gap-3 items-start">
            <span
              className={`px-3 py-1 rounded-full text-xs ${getAccountStatusColor(
                user.accountStatus
              )}`}
            >
              {user.accountStatus}
            </span>

            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="bg-primary text-white px-4 py-1 rounded text-sm"
            >
              Actions
            </button>

            {showActionMenu && (
              <div className="absolute right-0 top-10 bg-white border shadow rounded w-40">
                <button
                  onClick={handleActivate}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                >
                  Activate
                </button>
                <button
                  onClick={handleDeactivate}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                >
                  Deactivate
                </button>
              </div>
            )}
          </div>
          
        </div>
        <div className="grid grid-cols-2 gap-3 shadow mt-4 pt-4 border-t border-gray-100 bg-white rounded-lg p-6 mb-4">
  <div>
    <p className="text-xs text-gray-400 uppercase tracking-wide">License number</p>
    <p className="text-sm mt-1">{user.licenseNumber || 'N/A'}</p>
  </div>
  <div>
    <p className="text-xs text-gray-400 uppercase tracking-wide">License expiry</p>
    <p className="text-sm mt-1">{user.licenseExpiry ? new Date(user.licenseExpiry).toLocaleDateString() : 'N/A'}</p>
  </div>
</div>

        {/* Stats */}
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
              <p className="text-xs text-gray-500 mb-1">Total CE Minutes</p>
              <p className="text-3xl font-bold text-secondary">{user.totalCEMinutes}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Certificates Uploaded</p>
              <p className="text-3xl font-bold text-purple-600">{user.certificateUploadCount}</p>
            </div>
          </div>
        </div>

        {/* Courses */}
       <div className="bg-white shadow rounded-lg p-6">
  <h2 className="text-lg font-semibold mb-4">Course Summary</h2>

  {user?.courses?.length ? (
    user.courses.map((course) => {
      const percent = Math.min(
        (course.completedMinutes / course.minsRequired) * 100,
        100
      );

      const statusObj = getCourseStatus(course.status);

      return (
        <div
          key={course._id}
          onClick={() => handleCourseClick(course._id)}
          className="border-b pb-4 mb-4 last:border-0 cursor-pointer hover:bg-gray-50 rounded px-2"
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{course.name || "-"}</h3>
              <p className="text-sm text-gray-500">
                {course.institute || "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 mt-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <span className={`px-2 py-1 rounded text-xs ${statusObj.className}`}>
                {statusObj.text}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Minutes Progress</p>
              <p className="text-sm font-semibold">
                {course.completedMinutes || 0} / {course.minsRequired || 0}
              </p>
            </div>
          </div>

          <div className="mt-3 w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${percent || 0}%` }}
            />
          </div>
        </div>
      );
    })
  ) : (
    <div className="text-center text-gray-500 py-5">
      Data not found
    </div>
  )}
</div>
      </div>

      <CourseDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedCourse}
        loading={loading}
      />
    </div>
  );
}

// ✅ Reusable Stat

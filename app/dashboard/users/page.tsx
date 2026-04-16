"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/lib/slices/userSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { DataTable } from "./components/data-table";
import { StatCards } from "./components/stat-cards";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    users,
    pagination,
    activeUsers,
    deactivatedUsers,
    totalUsers,
    loading,
    userCourses,
  } = useSelector((state: RootState) => state.users);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // 👈 NEW

  const [accountStatus, setAccountStatus] = useState<"all" | "active" | "deactivated">("all");
  const [licenseExpired, setLicenseExpired] = useState<"all" | "true" | "false">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // ✅ API call
  useEffect(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch, // 👈 use debounced value
        accountStatus: accountStatus === "all" ? undefined : accountStatus,
        licenseExpired: licenseExpired === "all" ? undefined : licenseExpired,
        startDate,
        endDate,
      })
    );
  }, [
    dispatch,
    currentPage,
    pageSize,
    debouncedSearch, // 👈 dependency change
    accountStatus,
    licenseExpired,
    startDate,
    endDate,
  ]);

  // ✅ Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const paginationData = {
    currentPage: pagination?.currentPage ?? currentPage,
    itemsPerPage: pagination?.itemsPerPage ?? pageSize,
    totalPages: pagination?.totalPages ?? 1,
    setCurrentPage: (page: number) => setCurrentPage(page),
    setPageSize: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
  };

  // Map ApiUser to User interface for DataTable compatibility
  const mappedUsers = users.map((user) => ({
    _id: user._id,
    fullName: user.fullName,
    emailAddress: user.emailAddress,
    profession: user.profession,
    licenseNumber: user.licenseNumber,
    licenseExpiry: user.licenseExpiry,
    accountStatus: user.accountStatus,
    profilePicture: user.profilePicture || null, // Convert undefined to null
  }));

  return (
    <div className="space-y-6">
      <StatCards
        activeUsers={activeUsers}
        deactivatedUsers={deactivatedUsers}
        totalUsers={totalUsers}
      />

      <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
        <DataTable
          users={mappedUsers}
          pagination={paginationData}
          loading={loading}
          search={search}
          setSearch={setSearch}
          accountStatus={accountStatus}
          setAccountStatus={setAccountStatus}
          licenseExpired={licenseExpired}
          setLicenseExpired={setLicenseExpired}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          userCourses={userCourses}
        />
      </div>
    </div>
  );
}
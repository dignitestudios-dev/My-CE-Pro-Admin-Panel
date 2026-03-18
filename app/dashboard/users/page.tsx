"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/lib/slices/userSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { DataTable } from "./components/data-table";
import { StatCards } from "./components/stat-cards";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { users, pagination, activeUsers, deactivatedUsers, totalUsers, loading, userCourses } =
    useSelector((state: RootState) => state.users);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filters
  const [search, setSearch] = useState("");
  const [accountStatus, setAccountStatus] = useState<"all" | "active" | "deactivated">("all");
  const [licenseExpired, setLicenseExpired] = useState<"all" | "true" | "false">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        limit: pageSize,
        search,
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
    search,
    accountStatus,
    licenseExpired,
    startDate,
    endDate,
  ]);

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      <div className="flex items-center justify-between">
        <StatCards
          activeUsers={activeUsers}
          deactivatedUsers={deactivatedUsers}
          totalUsers={totalUsers}
        />
      </div>

      <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
        <DataTable
          users={users}
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
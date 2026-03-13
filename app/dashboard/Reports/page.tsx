"use client";

import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./components/data-table";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchReportsUsers,
  fetchReportsCourses,
} from "@/lib/slices/reportsSlice";
import { Button } from "@/components/ui/button";

// Download APIs
import {
  downloadUsersExcel,
  downloadUsersCSV,
  downloadCoursesExcel,
  downloadCoursesCSV,
} from "@/lib/api/reports.api";

export default function Reports() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, courses, loading } = useSelector(
    (state: RootState) => state.reports,
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Toggle state
  const [reportType, setReportType] = useState<"users" | "courses">("users");

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [accountStatus, setAccountStatus] = useState<
    "all" | "active" | "deactivated"
  >("all");
  const [licenseExpired, setLicenseExpired] = useState<
    "all" | "true" | "false"
  >("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 2000);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset filters on toggle
  useEffect(() => {
    setCurrentPage(1);
    if (reportType === "users") {
      setSearch("");
      setAccountStatus("all");
      setLicenseExpired("all");
    }
    setStartDate("");
    setEndDate("");
  }, [reportType]);

  // Pagination data
  const paginationData = {
    currentPage,
    itemsPerPage: pageSize,
    totalPages: 1,
    setCurrentPage: (page: number) => setCurrentPage(page),
    setPageSize: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
  };

  // Fetch reports
  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: pageSize,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    if (reportType === "users") {
      params.search = debouncedSearch || undefined;
      params.accountStatus =
        accountStatus === "all" ? undefined : accountStatus;
      params.licenseExpired =
        licenseExpired === "all" ? undefined : licenseExpired === "true";
      dispatch(fetchReportsUsers(params));
    } else {
      dispatch(fetchReportsCourses(params));
    }
  }, [
    dispatch,
    reportType,
    currentPage,
    pageSize,
    debouncedSearch,
    accountStatus,
    licenseExpired,
    startDate,
    endDate,
  ]);

  // Download handler
  const handleDownload = async (
    type: "users" | "courses",
    format: "excel" | "csv",
  ) => {
    const params: any = {
      search: debouncedSearch || undefined,
      accountStatus: accountStatus === "all" ? undefined : accountStatus,
      licenseExpired:
        licenseExpired === "all" ? undefined : licenseExpired === "true",
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    try {
      let blob;
      if (type === "users" && format === "excel")
        blob = await downloadUsersExcel(params);
      if (type === "users" && format === "csv")
        blob = await downloadUsersCSV(params);
      if (type === "courses" && format === "excel")
        blob = await downloadCoursesExcel(params);
      if (type === "courses" && format === "csv")
        blob = await downloadCoursesCSV(params);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${type}_report.${format === "excel" ? "xlsx" : "csv"}`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Reports</h1>

      {/* Toggle + Download Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-between">
        <div className="space-x-3.5">
          {" "}
          <Button
            variant={reportType === "users" ? "default" : "outline"}
            onClick={() => setReportType("users")}
          >
            Users Reports
          </Button>
          <Button
            variant={reportType === "courses" ? "default" : "outline"}
            onClick={() => setReportType("courses")}
          >
            Courses Reports
          </Button>
        </div>
        <div className="space-x-3.5">
          <Button onClick={() => handleDownload(reportType, "excel")}>
            Download Excel
          </Button>
          <Button onClick={() => handleDownload(reportType, "csv")}>
            Download CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        reports={reportType === "users" ? users : courses}
        pagination={paginationData}
        loading={loading}
        type={reportType}
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
      />
    </div>
  );
}

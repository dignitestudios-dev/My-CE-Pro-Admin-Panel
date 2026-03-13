"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye } from "lucide-react";
import React, { useState, useEffect } from "react";

interface User {
  _id: string;
  fullName: string;
  emailAddress: string;
  profession: string;
  licenseNumber: string;
  licenseExpiry: string;
  accountStatus: boolean;
}

interface Course {
  _id: string;
  name: string;
  institute: string;
  mins: number;
  completedMinutes: number;
  completionPercentage: number;
  status: string;
}

interface DataTableProps {
  reports: any[];
  loading: boolean;
  type: "users" | "courses";
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
  search: string;
  setSearch: (val: string) => void;
  accountStatus: "all" | "active" | "deactivated";
  setAccountStatus: (val: "all" | "active" | "deactivated") => void;
  licenseExpired: "all" | "true" | "false";
  setLicenseExpired: (val: "all" | "true" | "false") => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
}

export function DataTable({
  reports,
  pagination,
  loading,
  type,
  search,
  setSearch,
  accountStatus,
  setAccountStatus,
  licenseExpired,
  setLicenseExpired,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: DataTableProps) {
  // Remove internal useState for filters
  // Debounce search handled in Reports.tsx

  // Reset filters when type changes
  useEffect(() => {
    setSearch("");
    setAccountStatus("all");
    setLicenseExpired("all");
    setStartDate("");
    setEndDate("");
    pagination.setCurrentPage(1);
  }, [type]);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    pagination.setPageSize(Number(e.target.value));
    pagination.setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) pagination.setCurrentPage(pagination.currentPage - 1);
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) pagination.setCurrentPage(pagination.currentPage + 1);
  };

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className={`grid gap-2 ${type === "users" ? "sm:grid-cols-5" : "sm:grid-cols-3"} sm:gap-4`}>
        {/* Users filters */}
        {type === "users" && (
          <>
            {/* Search */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Search by name/email</Label>
              <Input
                type="text"
                placeholder="Type to search..."
                className="w-full pr-10"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  pagination.setCurrentPage(1);
                }}
              />
            </div>

            {/* Account Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Account status</Label>
              <select
                value={accountStatus}
                onChange={(e) => {
                  setAccountStatus(e.target.value as "all" | "active" | "deactivated");
                  pagination.setCurrentPage(1);
                }}
                className="w-full border rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>

            {/* License Expired */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">License expired</Label>
              <select
                value={licenseExpired}
                onChange={(e) => {
                  setLicenseExpired(e.target.value as "all" | "true" | "false");
                  pagination.setCurrentPage(1);
                }}
                className="w-full border rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="true">Expired</option>
                <option value="false">Not expired</option>
              </select>
            </div>
          </>
        )}

        {/* Start Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Start date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              pagination.setCurrentPage(1);
            }}
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">End date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              pagination.setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {type === "users" ? (
                <>
                  <TableHead>User</TableHead>
                  <TableHead>Profession</TableHead>
                  <TableHead>License number</TableHead>
                  <TableHead>License expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Institute</TableHead>
                  <TableHead>Total Minutes</TableHead>
                  <TableHead>Completed Minutes</TableHead>
                  <TableHead>Completion %</TableHead>
                  <TableHead>Status</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : reports.length ? (
              type === "users" ? (
                reports.map((user: User) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.emailAddress}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{user.profession}</TableCell>
                    <TableCell>{user.licenseNumber}</TableCell>
                    <TableCell>{new Date(user.licenseExpiry).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge>{user.accountStatus ? "Active" : "Inactive"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/users/${user._id}`}>
                        <Button size="icon" variant="ghost">
                          <Eye className="size-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                reports.map((course: Course) => (
                  <TableRow key={course._id}>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.institute}</TableCell>
                    <TableCell>{course.mins}</TableCell>
                    <TableCell>{course.completedMinutes}</TableCell>
                    <TableCell>{course.completionPercentage}%</TableCell>
                    <TableCell>
                      <Badge>{course.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Items per page:</span>
          <select
            value={pagination.itemsPerPage}
            onChange={handlePageSizeChange}
            className="border rounded px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={pagination.currentPage <= 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={pagination.currentPage >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
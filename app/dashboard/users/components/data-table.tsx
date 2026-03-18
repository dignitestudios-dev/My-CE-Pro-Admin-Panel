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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import React from "react";
import CourseDetailModal from "./course-detail-modal";

interface User {
  _id: string;
  fullName: string | null;
  emailAddress: string;
  profession: string | null;
  licenseNumber: string | number | null;
  licenseExpiry: string | null;
  accountStatus: boolean;
}

interface DataTableProps {
  users: User[];
  loading: boolean;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };

  // Filters passed from parent
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
  userCourses: any;
}

export function DataTable({
  users,
  loading,
  pagination,
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

  const getStatusColor = (status: boolean) =>
    status ? "text-green-600 bg-green-50" : "text-gray-600 bg-gray-50";

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="grid gap-2 sm:grid-cols-5 sm:gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Search by name/email</Label>
          <Input
            type="text"
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Account Status</Label>
          <select
            value={accountStatus}
            onChange={(e) => setAccountStatus(e.target.value as "all" | "active" | "deactivated")}
            className="w-full border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">License Expired</Label>
          <select
            value={licenseExpired}
            onChange={(e) => setLicenseExpired(e.target.value as "all" | "true" | "false")}
            className="w-full border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="true">Expired</option>
            <option value="false">Not expired</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Start Date</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">End Date</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>License Number</TableHead>
              <TableHead>License Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <LoadingSpinner size="md" />
                </TableCell>
              </TableRow>
            ) : users.length ? (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.fullName?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.fullName || "Unknown"}</span>
                        <span className="text-sm">{user.emailAddress}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{user.profession || "-"}</TableCell>
                  <TableCell>{user.licenseNumber || "-"}</TableCell>
                  <TableCell>{user.licenseExpiry ? new Date(user.licenseExpiry).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.accountStatus)}>
                      {user.accountStatus ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Link href={`/dashboard/users/${user._id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="size-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results.
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
          <select value={pagination.itemsPerPage} onChange={handlePageSizeChange} className="border rounded px-2 py-1 text-sm">
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={pagination.currentPage <= 1}>
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={pagination.currentPage >= pagination.totalPages}>
            Next
          </Button>
        </div>
      </div>
     
    </div>
  );
}
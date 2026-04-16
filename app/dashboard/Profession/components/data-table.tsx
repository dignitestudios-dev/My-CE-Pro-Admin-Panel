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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye } from "lucide-react";
import { AppDispatch } from "@/lib/store";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchNotifications } from "@/lib/slices/notificationSlice";
import { fetchProfessions } from "@/lib/slices/professionSlice";
import EditProfessionModal from "./editprofessionmodal";
import DeleteProfessionModal from "./deleteprofessionmodal";



interface DataTableProps {
  professions: any[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
  loading: boolean;
}

export function DataTable({ professions, pagination, loading }: DataTableProps) {
 

  
 const dispatch = useDispatch<AppDispatch>();

const [showEditModal, setShowEditModal] = useState(false);
const [selectedProfession, setSelectedProfession] = useState<any>(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);


const handleEditClick = (profession: any) => {
  setSelectedProfession(profession);
  setShowEditModal(true);
};


const handleDeleteClick = (profession: any) => {
  setSelectedProfession(profession);
  setShowDeleteModal(true);
};
  

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    pagination.setPageSize(Number(e.target.value));
    pagination.setCurrentPage(1); // Reset to first page
  };

  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) pagination.setCurrentPage(pagination.currentPage - 1);
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) pagination.setCurrentPage(pagination.currentPage + 1);
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Profession Name</TableHead>
              <TableHead className="text-lift">CE Hours</TableHead>
              <TableHead className="">Actions</TableHead>
              
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <LoadingSpinner size="md" />
                </TableCell>
              </TableRow>
            ) : professions.length ? (
              professions.map((profession, index) => (
                <TableRow key={profession._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="capitalize">{profession.name || "-"}</TableCell>
                  <TableCell className="text-lift">{profession.ceHours || "-"}</TableCell>
                <TableCell className="flex gap-2 ">
  <Button
    variant="outline"
    size="sm"
    onClick={() => handleEditClick(profession)}
  >
    Edit
  </Button>

  <Button
    variant="destructive"
    size="sm"
    onClick={() => handleDeleteClick(profession)}
  >
    Delete
  </Button>
</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No professions found.
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
              <option key={size} value={size}>{size}</option>
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
      </div>?
      <EditProfessionModal
  open={showEditModal}
  onClose={() => setShowEditModal(false)}
  profession={selectedProfession}
 onSuccess={() => {
  dispatch(fetchProfessions({
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
  }));
}}
/>

<DeleteProfessionModal
  open={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  profession={selectedProfession}
  onSuccess={() => {
    dispatch(fetchProfessions({
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
    }));
  }}
/>
    </div>
  );
}
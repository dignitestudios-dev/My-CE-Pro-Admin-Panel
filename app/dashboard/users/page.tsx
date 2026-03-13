"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/lib/slices/userSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { DataTable } from "./components/data-table";
import { StatCards } from "./components/stat-cards";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, pagination, activeUsers, deactivatedUsers , totalUsers, loading } = useSelector((state: RootState) => state.users);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit: pageSize,  }));
  }, [dispatch, currentPage, pageSize]);

  const paginationData = {
    currentPage: pagination?.currentPage ?? currentPage,
    itemsPerPage: pagination?.itemsPerPage ?? pageSize,
    totalPages: pagination?.totalPages ?? 1,
    setCurrentPage: (page: number) => setCurrentPage(page),
    setPageSize: (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // page size change hone par page 1 par reset
    },
  };

  

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      <div className="flex items-center justify-between">
         <StatCards activeUsers={activeUsers} deactivatedUsers={deactivatedUsers} totalUsers={totalUsers} />
      </div>
      <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
      
        <DataTable users={users} pagination={paginationData} />
      </div>
    </div>
  );
}
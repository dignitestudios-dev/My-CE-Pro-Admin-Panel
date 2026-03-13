
"use client";

import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./components/data-table";
import { AppDispatch, RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { fetchProfessions } from "@/lib/slices/professionSlice";




export default function Profession() {
  const dispatch = useDispatch<AppDispatch>();
  const { professions, pagination, loading } = useSelector(
    (state: RootState) => state.profession

  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
const paginationData = {
    currentPage: pagination?.currentPage ?? currentPage,
    itemsPerPage: pagination?.itemsPerPage ?? pageSize,
    totalPages: pagination?.totalPages ?? 1,
    setCurrentPage: (page: number) => setCurrentPage(page),
    setPageSize: (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // reset to first page if page size changes
    },
  };

;

  

    return (

        <div>
           <DataTable professions={professions} pagination={paginationData} loading={loading} />
        </div>
    );
}
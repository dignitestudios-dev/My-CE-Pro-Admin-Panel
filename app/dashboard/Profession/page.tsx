
"use client";

import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./components/data-table";
import { AppDispatch, RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { fetchProfessions } from "@/lib/slices/professionSlice";
import { Button } from "@/components/ui/button";
import CreateProfessionModal from "./components/create-notification-modal";




export default function Profession() {
  const dispatch = useDispatch<AppDispatch>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { professions, pagination, loading } = useSelector(
    (state: RootState) => state.profession

  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
const paginationData = {
  currentPage,
  itemsPerPage: pageSize,
  totalPages: pagination?.totalPages || 1,
  setCurrentPage,
  setPageSize,
};

useEffect(() => {
  
  dispatch(
    fetchProfessions({
      page: currentPage,
      limit: pageSize,
    })
  );
}, [dispatch, currentPage, pageSize]);
  

    return (

        <div>
           <div className="flex justify-end mb-4">
        <Button className="bg-primary" onClick={() => setShowCreateModal(true)}>Add Profession</Button>
      </div>
           <DataTable professions={professions} pagination={paginationData} loading={loading} />
           <CreateProfessionModal
  showCreateModal={showCreateModal}
  setShowCreateModal={setShowCreateModal}
  onSuccess={() => {
    setCurrentPage(1); // Reset to page 1
    dispatch(
      fetchProfessions({
        page: currentPage,
        limit: pageSize,
      })
    );
  }}
/>
        </div>
    );
}
"use client";
import { DataTable } from "./components/data-table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { createNotification, fetchNotifications } from "@/lib/slices/notificationSlice";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CreateNotificationModal from "./components/create-notification-modal";


export default function Notification() {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, pagination, loading } = useSelector(
    (state: RootState) => state.notification
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false); // modal state

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

  useEffect(() => {
    dispatch(fetchNotifications({ page: currentPage, limit: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  // Function to handle notification submission
  const handleCreateNotification = (data: { title: string; description: string; when?: string }) => {
    console.log("New notification data:", data);
    dispatch(createNotification(data));
    dispatch(fetchNotifications({ page: currentPage, limit: pageSize }));
    // yahan API call kar sakte ho to create notification
    // example: dispatch(createNotification(data))
  };

  return (
    <div>
      {/* Add Notification Button */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowCreateModal(true)}>Add Notification</Button>
      </div>

      {/* Create Notification Modal */}
      <CreateNotificationModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        onSubmitNotification={handleCreateNotification}
      />

      {/* Data Table */}
      <div className="p-4">
        <DataTable notifications={notifications} pagination={paginationData} />
      </div>
    </div>
  );
}
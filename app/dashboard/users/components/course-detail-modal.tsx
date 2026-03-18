"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// ✅ Course type
export interface Course {
  _id: string;
  name: string;
  institute: string;
  startDate: string | null;
  endDate: string | null;
  certificate: string | null;
  minsRequired: number;
  completedMinutes: number;
  status: "pending" | "active" | "completed" | "inProgress";
  completionPercentage: number;
}

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Course | null;
  loading: boolean;
}

// Badge variants
const statusVariantMap: Record<
  Course["status"],
  "secondary" | "default" | "destructive"
> = {
  pending: "secondary",
  active: "default",
  inProgress: "default",
  completed: "destructive",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Not set";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CourseDetailModal({
  isOpen,
  onClose,
  data,
  loading,
}: CourseDetailModalProps) {
  const course = data;
  console.log("course", course);
  const progress =
    course?.completionPercentage ??
    (course
      ? Math.min((course.completedMinutes / course.minsRequired) * 100, 100)
      : 0);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-500">
              Loading course details...
            </span>
          </div>
        )}

        {/* No Data */}
        {!loading && !course && (
          <div className="py-12 text-center text-sm text-gray-400">
            Course details not available
          </div>
        )}

        {/* Course Data */}
        {!loading && course && (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Course details
                  </p>
                  <DialogTitle className="text-lg font-medium">
                    {course.name}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.institute}
                  </p>
                </div>

                <Badge
                  variant={statusVariantMap[course.status] ?? "secondary"}
                  className="mt-1 shrink-0 capitalize"
                >
                  {course.status}
                </Badge>
              </div>
            </DialogHeader>

            <Separator />

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Start date</p>
                <p className="text-sm font-medium">{formatDate(course.startDate)}</p>
              </div>

              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">End date</p>
                <p
                  className={`text-sm font-medium ${
                    !course.endDate ? "text-muted-foreground" : ""
                  }`}
                >
                  {formatDate(course.endDate)}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Completed minutes
                </p>
                <p className="text-sm font-medium">
                  {course.completedMinutes}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    / {course.minsRequired} required
                  </span>
                </p>
              </div>

              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Certificate</p>
                {course.certificate ? (
                  <a
                    href={course.certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="text-sm font-medium text-blue-600 hover:underline break-all"
                  >
                    View / Download Certificate
                  </a>
                ) : (
                  <p className="text-sm font-medium text-muted-foreground">None</p>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2 mt-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Completion progress</p>
                <p className="text-sm font-medium">{Math.round(progress)}%</p>
              </div>

              <Progress value={progress} className="h-1.5" />
            </div>

            <Separator />

            {/* Footer */}
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
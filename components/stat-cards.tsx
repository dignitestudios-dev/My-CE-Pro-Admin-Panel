import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  CreditCard,
  UserCheck,
  Clock5,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatCards({ activeUsers, deactivatedUsers, totalUsers }: { activeUsers: number; deactivatedUsers: number; totalUsers: number }) {
  
  return (
    <div className="w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    
        <Card  className="border w-full ">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <Users className="text-muted-foreground size-6" />
              {totalUsers && (
                <Badge
                  variant="outline"
                  className={cn(
                    totalUsers > 0
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  )}
                >
                  {totalUsers > 0 ? (
                    <>
                      <TrendingUp className="me-1 size-3" />
                      {totalUsers > 0 ? "+" : ""}
                      {totalUsers}%
                    </>
                  ) : (
                    <>
                      <TrendingDown className="me-1 size-3" />
                      {totalUsers}%
                    </>
                  )}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                Total Users
              </p>
              <div className="text-2xl font-bold">{totalUsers}</div>
              {totalUsers && (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span>from {totalUsers}</span>
                  <ArrowUpRight className="size-3" />
                </div>
              )}
            </div>
          </CardContent>
          
        </Card>
     <Card className="border">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <Users className="text-muted-foreground size-6" />
              {activeUsers && (
                <Badge
                  variant="outline"
                  className={cn(
                    activeUsers > 0
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  )}
                >
                  {activeUsers > 0 ? (
                    <>
                      <TrendingUp className="me-1 size-3" />
                      {activeUsers > 0 ? "+" : ""}
                      {activeUsers}%
                    </>
                  ) : (
                    <>
                      <TrendingDown className="me-1 size-3" />
                      {activeUsers}%
                    </>
                  )}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
             Activate Users
              </p>
              <div className="text-2xl font-bold">{activeUsers}</div>
              {totalUsers && (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span>from {activeUsers}</span>
                  <ArrowUpRight className="size-3" />
                </div>
              )}
            </div>
          </CardContent>
          
        </Card>
        <Card  className="border">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <Users className="text-muted-foreground size-6" />
              {deactivatedUsers && (
                <Badge
                  variant="outline"
                  className={cn(
                    deactivatedUsers > 0
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  )}
                >
                  {deactivatedUsers > 0 ? (
                    <>
                      <TrendingUp className="me-1 size-3" />
                      {deactivatedUsers > 0 ? "+" : ""}
                      {deactivatedUsers}
                    </>
                  ) : (
                    <>
                      <TrendingDown className="me-1 size-3" />
                      {deactivatedUsers}
                    </>
                  )}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                Total Users
              </p>
              <div className="text-2xl font-bold">{deactivatedUsers}</div>
              {totalUsers && (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span>from {deactivatedUsers}</span>
                  <ArrowUpRight className="size-3" />
                </div>
              )}
            </div>
          </CardContent>
          
        </Card>
    </div>
  );
}

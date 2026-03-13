"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Shield, 
  Power, 
  Ban, 
  UserCheck,
  AlertTriangle
} from "lucide-react"

interface AdminControlsProps {
  user: {
    id: number
    name: string
    status: "Active" | "Suspended" | "Deactivated"
  }
  onActivateAccount: (id: number) => void
  onDeactivateAccount: (id: number) => void
  onSuspendAccount: (id: number) => void
}

export function AdminControls({ 
  user, 
  onActivateAccount, 
  onDeactivateAccount, 
  onSuspendAccount 
}: AdminControlsProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAction = async (action: () => void) => {
    setIsProcessing(true)
    try {
      action()
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Suspended":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Deactivated":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Administrative Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Status:</span>
            <Badge className={getStatusColor(user.status)}>
              {user.status}
            </Badge>
          </div>

          {/* Control Actions */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Admin can control user access but cannot modify learning data:
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              {user.status !== "Active" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="default" 
                      className="w-full justify-start"
                      disabled={isProcessing}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Activate Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Activate Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to activate {user.name}&apos;s account? 
                        They will regain full access to the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleAction(() => onActivateAccount(user.id))}
                        disabled={isProcessing}
                      >
                        Activate
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {user.status === "Active" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      disabled={isProcessing}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Suspend Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to suspend {user.name}&apos;s account? 
                        They will temporarily lose access to the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleAction(() => onSuspendAccount(user.id))}
                        disabled={isProcessing}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        Suspend
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {user.status !== "Deactivated" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      disabled={isProcessing}
                    >
                      <Power className="h-4 w-4 mr-2" />
                      Deactivate Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deactivate Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to deactivate {user.name}&apos;s account? 
                        This action will permanently remove their access to the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleAction(() => onDeactivateAccount(user.id))}
                        disabled={isProcessing}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Deactivate
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-800">
                <p className="font-medium mb-1">Important Notice:</p>
                <ul className="space-y-1">
                  <li>• Admin controls only affect account access</li>
                  <li>• Learning data and CE hours remain unchanged</li>
                  <li>• All actions are logged for audit purposes</li>
                  <li>• Legal compliance is maintained</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

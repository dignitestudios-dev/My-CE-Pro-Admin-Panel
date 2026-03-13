"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

interface UserFiltersProps {
  onFilterChange: (filters: any) => void
}

export function UserFormDialog({ onFilterChange }: UserFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    activity: "",
    licenseExpiry: "",
    registrationDate: "",
  })

  function updateFilters(key: string, value: string) {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    onFilterChange(updated)
  }

  return (
    <div className="grid grid-cols-5 gap-4 mb-4">

      {/* 🔍 Search */}
      <Input
        placeholder="Search name, email, profession"
        value={filters.search}
        onChange={(e) => updateFilters("search", e.target.value)}
      />

      {/* Account Status */}
      <div className="w-2xl">
      
      <Select 
        value={filters.status}
        onValueChange={(value) => updateFilters("status", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Account Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
          <SelectItem value="Suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>
      </div>

      {/* Activity Status */}
      <Select
        value={filters.activity}
        onValueChange={(value) => updateFilters("activity", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Activity Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Recently Active">Recently Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {/* License Expiry */}
      <Select
        value={filters.licenseExpiry}
        onValueChange={(value) => updateFilters("licenseExpiry", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="License Expiry" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Valid">Valid</SelectItem>
          <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
          <SelectItem value="Expired">Expired</SelectItem>
        </SelectContent>
      </Select>

      {/* Registration Date */}
      <Input
        type="date"
        value={filters.registrationDate}
        onChange={(e) =>
          updateFilters("registrationDate", e.target.value)
        }
      />
    </div>
  )
}
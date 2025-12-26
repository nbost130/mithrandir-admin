import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { transcriptionApi } from "../api/transcription-api"
import { TranscriptionJob } from "../data/types"
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Clock, 
  RotateCw,
  Trash2,
  Download 
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const statusIcons = {
  completed: <CheckCircle2 className="h-4 w-4" />,
  failed: <XCircle className="h-4 w-4" />,
  processing: <Loader2 className="h-4 w-4 animate-spin" />,
  pending: <Clock className="h-4 w-4" />,
}

const statusColors = {
  completed: "bg-green-500",
  failed: "bg-red-500",
  processing: "bg-blue-500",
  pending: "bg-yellow-500",
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}

function formatDuration(seconds: number | undefined): string {
  if (!seconds) return "—"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}m ${secs}s`
}

export function TranscriptionTable() {
  const queryClient = useQueryClient()
  const [globalFilter, setGlobalFilter] = useState("")

  const { data: jobs = [], isLoading, refetch } = useQuery({
    queryKey: ["transcription-jobs"],
    queryFn: () => transcriptionApi.getAllJobs(),
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  })

  const handleRetry = async (jobId: string) => {
    try {
      await transcriptionApi.retryJob(jobId)
      queryClient.invalidateQueries({ queryKey: ["transcription-jobs"] })
    } catch (error) {
      console.error("Failed to retry job:", error)
    }
  }

  const handleDelete = async (jobId: string) => {
    try {
      await transcriptionApi.deleteJob(jobId)
      queryClient.invalidateQueries({ queryKey: ["transcription-jobs"] })
    } catch (error) {
      console.error("Failed to delete job:", error)
    }
  }

  const columns: ColumnDef<TranscriptionJob>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as TranscriptionJob["status"]
        return (
          <Badge className={`${statusColors[status]} text-white gap-1`}>
            {statusIcons[status]}
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "fileName",
      header: "File Name",
      cell: ({ row }) => (
        <div className="font-medium max-w-md truncate">
          {row.getValue("fileName")}
        </div>
      ),
    },
    {
      accessorKey: "fileSize",
      header: "Size",
      cell: ({ row }) => formatFileSize(row.getValue("fileSize")),
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = row.getValue("progress") as number
        return (
          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground min-w-12">
                {progress}%
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        )
      },
    },
    {
      accessorKey: "completedAt",
      header: "Duration",
      cell: ({ row }) => {
        const started = row.original.startedAt
        const completed = row.original.completedAt
        if (!started || !completed) return "—"
        
        const duration = (new Date(completed).getTime() - new Date(started).getTime()) / 1000
        return formatDuration(duration)
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const job = row.original
        return (
          <div className="flex gap-2">
            {job.status === "failed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRetry(job.jobId)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            )}
            {job.status === "completed" && (
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(job.jobId)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  const stats = {
    total: jobs.length,
    completed: jobs.filter((j) => j.status === "completed").length,
    failed: jobs.filter((j) => j.status === "failed").length,
    processing: jobs.filter((j) => j.status === "processing").length,
    pending: jobs.filter((j) => j.status === "pending").length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Files</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          <div className="text-sm text-muted-foreground">Processing</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search files..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => refetch()} variant="outline">
          <RotateCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No transcription jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

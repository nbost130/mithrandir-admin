import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, ChevronDown, Clock, Download, Loader2, RotateCw, Trash2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { transcriptionApi } from '../api/transcription-api';
import type { TranscriptionJob } from '../data/types';

const statusIcons = {
  completed: <CheckCircle2 className="h-4 w-4" />,
  failed: <XCircle className="h-4 w-4" />,
  processing: <Loader2 className="h-4 w-4 animate-spin" />,
  pending: <Clock className="h-4 w-4" />,
};

const statusColors = {
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  processing: 'bg-blue-500',
  pending: 'bg-yellow-500',
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / k ** i) * 100) / 100 + ' ' + sizes[i];
}

function formatDuration(seconds: number | undefined): string {
  if (!seconds) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
}

const priorityMap: { [key: number]: string } = {
  1: 'URGENT',
  2: 'HIGH',
  3: 'NORMAL',
  4: 'LOW',
};

const priorityConfig: { [key: string]: { label: string; color: string } } = {
  URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-800' },
  HIGH: { label: 'High', color: 'bg-orange-100 text-orange-800' },
  NORMAL: { label: 'Normal', color: 'bg-blue-100 text-blue-800' },
  LOW: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
};

export function TranscriptionTable() {
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<null | 'pending' | 'processing' | 'completed' | 'failed'>(null);

  const {
    data: jobs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['transcription-jobs'],
    queryFn: () => transcriptionApi.getAllJobs(),
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const handleRetry = async (jobId: string) => {
    try {
      await transcriptionApi.retryJob(jobId);
      queryClient.invalidateQueries({ queryKey: ['transcription-jobs'] });
    } catch {
      // Error handling could be improved with toast notifications
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      await transcriptionApi.deleteJob(jobId);
      queryClient.invalidateQueries({ queryKey: ['transcription-jobs'] });
    } catch {
      // Error handling could be improved with toast notifications
    }
  };

  const handlePriorityChange = async (jobId: string, priority: number) => {
    try {
      await transcriptionApi.updateJobPriority(jobId, priority);
      toast.success('Priority updated successfully');
      queryClient.invalidateQueries({ queryKey: ['transcription-jobs'] });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update priority:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          toast.error('Cannot update priority', {
            description: 'Job is already completed or failed',
          });
        } else if (error.response?.status === 404) {
          toast.error('Job not found', {
            description: 'The job may have been deleted',
          });
        } else {
          toast.error('Failed to update priority', {
            description: error.message,
          });
        }
      } else if (error instanceof Error) {
        toast.error('Failed to update priority', {
          description: error.message,
        });
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const handleStatusFilter = (status: 'pending' | 'processing' | 'completed' | 'failed') => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const columns: ColumnDef<TranscriptionJob>[] = [
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as TranscriptionJob['status'];
        return (
          <Badge className={`${statusColors[status]} gap-1 text-white`}>
            {statusIcons[status]}
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const job = row.original;
        const priority = job.priority || 3; // Default to Normal
        const priorityName = priorityMap[priority as keyof typeof priorityMap] || 'NORMAL';
        const config = priorityConfig[priorityName];
        const isFinished = job.status === 'completed' || job.status === 'failed';

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`${config.color} h-6 cursor-pointer px-2.5 hover:opacity-80`}
                disabled={isFinished}
              >
                {config.label}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Set Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlePriorityChange(job.jobId, 1)}>
                <div className="flex items-center gap-2">
                  <span>🔥</span>
                  <span className="text-red-800">Urgent</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityChange(job.jobId, 2)}>
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span className="text-orange-800">High</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityChange(job.jobId, 3)}>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span className="text-blue-800">Normal</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityChange(job.jobId, 4)}>
                <div className="flex items-center gap-2">
                  <span>—</span>
                  <span className="text-gray-800">Low</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: 'fileName',
      header: 'File Name',
      cell: ({ row }) => <div className="max-w-md truncate font-medium">{row.getValue('fileName')}</div>,
    },
    {
      accessorKey: 'fileSize',
      header: 'Size',
      cell: ({ row }) => formatFileSize(row.getValue('fileSize')),
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      cell: ({ row }) => {
        const progress = row.getValue('progress') as number;
        return (
          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-muted-foreground min-w-12 text-sm">{progress}%</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <span className="text-muted-foreground text-sm">{formatDistanceToNow(date, { addSuffix: true })}</span>;
      },
    },
    {
      accessorKey: 'completedAt',
      header: 'Duration',
      cell: ({ row }) => {
        const started = row.original.startedAt;
        const completed = row.original.completedAt;
        if (!started || !completed) return '—';

        const duration = (new Date(completed).getTime() - new Date(started).getTime()) / 1000;
        return formatDuration(duration);
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="flex gap-2">
            {job.status === 'failed' && (
              <Button variant="ghost" size="sm" onClick={() => handleRetry(job.jobId)}>
                <RotateCw className="h-4 w-4" />
              </Button>
            )}
            {job.status === 'completed' && (
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => handleDelete(job.jobId)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Filter jobs based on selected status and search term
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((job) => job.status === selectedStatus);
    }

    // Filter by search term (filename)
    if (globalFilter) {
      const searchLower = globalFilter.toLowerCase();
      filtered = filtered.filter((job) => job.fileName.toLowerCase().includes(searchLower));
    }

    return filtered;
  }, [jobs, selectedStatus, globalFilter]);

  const table = useReactTable({
    data: filteredJobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Stats are always based on full jobs array (unfiltered)
  const stats = {
    total: jobs.length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
    processing: jobs.filter((j) => j.status === 'processing').length,
    pending: jobs.filter((j) => j.status === 'pending').length,
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-muted-foreground text-sm">Total Files</div>
        </div>
        <div
          className={cn(
            'bg-card rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md',
            selectedStatus === 'completed' && 'ring-2 ring-primary'
          )}
          onClick={() => handleStatusFilter('completed')}
        >
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-muted-foreground text-sm">Completed</div>
        </div>
        <div
          className={cn(
            'bg-card rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md',
            selectedStatus === 'failed' && 'ring-2 ring-primary'
          )}
          onClick={() => handleStatusFilter('failed')}
        >
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-muted-foreground text-sm">Failed</div>
        </div>
        <div
          className={cn(
            'bg-card rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md',
            selectedStatus === 'processing' && 'ring-2 ring-primary'
          )}
          onClick={() => handleStatusFilter('processing')}
        >
          <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          <div className="text-muted-foreground text-sm">Processing</div>
        </div>
        <div
          className={cn(
            'bg-card rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md',
            selectedStatus === 'pending' && 'ring-2 ring-primary'
          )}
          onClick={() => handleStatusFilter('pending')}
        >
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-muted-foreground text-sm">Pending</div>
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
          <RotateCw className="mr-2 h-4 w-4" />
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
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No transcription jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generates page numbers for pagination with ellipsis
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 *
 * Examples:
 * - Small dataset (≤5 pages): [1, 2, 3, 4, 5]
 * - Near beginning: [1, 2, 3, 4, '...', 10]
 * - In middle: [1, '...', 4, 5, 6, '...', 10]
 * - Near end: [1, '...', 7, 8, 9, 10]
 */
export function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const maxVisible = 5

  // Small dataset - show all pages
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // Near beginning
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages]
  }

  // Near end
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  // Middle
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

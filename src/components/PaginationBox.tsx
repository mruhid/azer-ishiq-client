import { Dispatch, SetStateAction, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type PaginationProps = {
  page: number;
  size: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  totalPage?: number;
};
export function PaginationBox({
  page,
  size,
  setPageNumber,
  totalPage,
}: PaginationProps) {
  const totalPages = size;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPageNumber(page);
    }
  };

  const generatePagination = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2);

      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(3, page - 1);
      const end = Math.min(totalPages - 2, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages - 1, totalPages);
    }

    return pages.map((Page, index) => (
      <PaginationItem key={index}>
        {typeof Page === "number" ? (
          <PaginationLink
            onClick={() => handlePageChange(Page)}
            isActive={page === Page}
            className="cursor-pointer rounded-full"
          >
            {Page}
          </PaginationLink>
        ) : (
          <PaginationEllipsis />
        )}
      </PaginationItem>
    ));
  };

  return totalPages > 1 ? (
    <Pagination className="mx-auto my-2">
      <PaginationContent className="w-full">
        <div className="flex w-full items-center justify-between">
          {totalPage ? (
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages} ({totalPage} items)
            </div>
          ) : (
            ""
          )}
          <div className="flex flex-row gap-1">{generatePagination()}</div>
          <div className="flex flex-row gap-1">
            <PaginationItem>
              <PaginationPrevious
                className="hidden cursor-pointer md:flex"
                onClick={() => handlePageChange(page - 1)}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                className="hidden cursor-pointer md:flex"
                onClick={() => handlePageChange(page + 1)}
              />
            </PaginationItem>
          </div>
        </div>
      </PaginationContent>
    </Pagination>
  ) : null;
}

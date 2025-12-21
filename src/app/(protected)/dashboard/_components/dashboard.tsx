"use client";

import { useState } from "react";
import { FormCreateLink } from "@/components/auth/form-create-link";
import { columns } from "@/components/dashboard/columns";
import { DataTable } from "@/components/dashboard/data-table";
import { useQuery } from "@tanstack/react-query";
import { TLink } from "@/types/auth";
import { Metadata } from "next";

async function getLinks(
  page: number,
  limit: number
): Promise<{ data: TLink[]; total: number }> {
  const response = await fetch(`/api/links?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch links");
  }
  return response.json();
}

export default function DashboardPageClient() {
  const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(1);
  const limit = 10;
  const {
    data: links,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["links", page, limit],
    queryFn: () => getLinks(page, limit),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <FormCreateLink refetch={refetch} />
      </div>

      <DataTable
        columns={columns}
        data={links?.data ?? []}
        total={links?.total ?? 0}
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { FormCreateLink } from "@/components/auth/form-create-link";
import { columns } from "@/components/dashboard/columns";
import { DataTable } from "@/components/dashboard/data-table";
import { useQuery } from "@tanstack/react-query";
import { TLink } from "@/types/auth";
import { Input } from "@/components/ui/input";

async function getLinks(
  page: number,
  limit: number,
  q: string
): Promise<{ data: TLink[]; total: number }> {
  const response = await fetch(`/api/links?page=${page}&limit=${limit}&q=${q}`);
  if (!response.ok) {
    throw new Error("Failed to fetch links");
  }
  return response.json();
}

export default function DashboardPageClient() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  // const [limit, setLimit] = useState(1);
  const limit = 10;
  const {
    data: links,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["links", page, limit, query],
    queryFn: () => getLinks(page, limit, query),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQuery(search);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Links</h1>
        <FormCreateLink />
      </div>

      <Input
        placeholder="Search..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-sm"
      />

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

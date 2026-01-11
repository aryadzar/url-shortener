"use client";

import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { type DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getBaseUrl } from "@/lib/getBaseUrl";

// Types
interface ClicksOverTime {
  date: string;
  clicks: number;
}

interface TopReferer {
  referer: string;
  count: number;
  percentage: number;
}

interface TopRegion {
  country: string;
  count: number;
  percentage: number;
}

interface TopBrowser {
  browser: string;
  count: number;
  percentage: number;
}

interface TopDevice {
  device: string;
  count: number;
  percentage: number;
}

interface PopularLink {
  key: string;
  url: string;
  title: string | null;
  clicks: number;
  percentage: number;
}

interface AnalyticsData {
  clicksOverTime: ClicksOverTime[];
  totalClicks: number;
  popularLinks: PopularLink[];
  topReferers: TopReferer[];
  topRegions: TopRegion[];
  topBrowsers: TopBrowser[];
  topDevices: TopDevice[];
}

async function getAnalytics(
  startDate: string,
  endDate: string
): Promise<AnalyticsData> {
  const response = await fetch(
    `/api/analytics?startDate=${startDate}&endDate=${endDate}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return response.json();
}

// Chart colors
const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

// Custom tooltip for charts
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-2 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPageClient() {
  // Default date range: last 30 days
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const startDate = dateRange?.from
    ? format(dateRange.from, "yyyy-MM-dd")
    : "";
  const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

  const { data, isLoading, isError, refetch } = useQuery<AnalyticsData>({
    queryKey: ["analytics", startDate, endDate],
    queryFn: () => getAnalytics(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  // Refetch when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      refetch();
    }
  }, [startDate, endDate, refetch]);

  const baseUrl = getBaseUrl();

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-muted-foreground">
            View detailed analytics for your links
          </p>
        </div>
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Failed to load analytics</p>
        </div>
      )}

      {data && (
        <>
          {/* Total Clicks Card */}
          <Card>
            <CardHeader>
              <CardTitle>Total Clicks</CardTitle>
              <CardDescription>
                Total number of clicks in the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{data.totalClicks}</p>
            </CardContent>
          </Card>

          {/* Clicks Over Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
              <CardDescription>
                Daily click activity for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.clicksOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), "MMM dd")}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Clicks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Regions */}
            <Card>
              <CardHeader>
                <CardTitle>Top Regions</CardTitle>
                <CardDescription>Clicks by country</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.topRegions.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="Clicks" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Browsers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Browsers</CardTitle>
                <CardDescription>Clicks by browser</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.topBrowsers.slice(0, 5).map((b) => ({
                        name: b.browser,
                        value: b.count,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {data.topBrowsers.slice(0, 5).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Devices */}
          <Card>
            <CardHeader>
              <CardTitle>Top Devices</CardTitle>
              <CardDescription>Clicks by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.topDevices} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="device" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Data Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Links Table */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Links</CardTitle>
                <CardDescription>Your most clicked links</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Link</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.popularLinks.length > 0 ? (
                      data.popularLinks.map((link) => (
                        <TableRow key={link.key}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {link.title || link.key}
                              </span>
                              <a
                                href={`${baseUrl}/${link.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:underline"
                              >
                                {`${baseUrl}/${link.key}`}
                              </a>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {link.clicks}
                          </TableCell>
                          <TableCell className="text-right">
                            {link.percentage.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center h-24 text-muted-foreground"
                        >
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top Referers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Referers</CardTitle>
                <CardDescription>Top traffic sources</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referer</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.topReferers.length > 0 ? (
                      data.topReferers.map((referer, index) => (
                        <TableRow key={index}>
                          <TableCell className="max-w-[200px] truncate">
                            {referer.referer}
                          </TableCell>
                          <TableCell className="text-right">
                            {referer.count}
                          </TableCell>
                          <TableCell className="text-right">
                            {referer.percentage.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center h-24 text-muted-foreground"
                        >
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top Regions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Regions</CardTitle>
                <CardDescription>Top countries by clicks</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Country</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.topRegions.length > 0 ? (
                      data.topRegions.map((region, index) => (
                        <TableRow key={index}>
                          <TableCell>{region.country}</TableCell>
                          <TableCell className="text-right">
                            {region.count}
                          </TableCell>
                          <TableCell className="text-right">
                            {region.percentage.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center h-24 text-muted-foreground"
                        >
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top Browsers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Browsers</CardTitle>
                <CardDescription>Top browsers by clicks</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Browser</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.topBrowsers.length > 0 ? (
                      data.topBrowsers.map((browser, index) => (
                        <TableRow key={index}>
                          <TableCell>{browser.browser}</TableCell>
                          <TableCell className="text-right">
                            {browser.count}
                          </TableCell>
                          <TableCell className="text-right">
                            {browser.percentage.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center h-24 text-muted-foreground"
                        >
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Top Devices Table (Full Width) */}
          <Card>
            <CardHeader>
              <CardTitle>Top Devices</CardTitle>
              <CardDescription>Top devices by clicks</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topDevices.length > 0 ? (
                    data.topDevices.map((device, index) => (
                      <TableRow key={index}>
                        <TableCell className="capitalize">{device.device}</TableCell>
                        <TableCell className="text-right">
                          {device.count}
                        </TableCell>
                        <TableCell className="text-right">
                          {device.percentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center h-24 text-muted-foreground"
                      >
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

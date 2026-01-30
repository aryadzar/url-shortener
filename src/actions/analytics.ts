"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export interface ClicksOverTime {
  date: string;
  clicks: number;
}

export interface TopReferer {
  referer: string;
  count: number;
  percentage: number;
}

export interface TopRegion {
  country: string;
  count: number;
  percentage: number;
}

export interface TopBrowser {
  browser: string;
  count: number;
  percentage: number;
}

export interface TopDevice {
  device: string;
  count: number;
  percentage: number;
}

export interface PopularLink {
  key: string;
  url: string;
  title: string | null;
  clicks: number;
  percentage: number;
}

export interface AnalyticsData {
  clicksOverTime: ClicksOverTime[];
  totalClicks: number;
  popularLinks: PopularLink[];
  topReferers: TopReferer[];
  topRegions: TopRegion[];
  topBrowsers: TopBrowser[];
  topDevices: TopDevice[];
}

export async function getAnalyticsData({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}): Promise<{ data: AnalyticsData } | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  // Set endDate to end of day
  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Get all clicks for user's links within date range
  const clicks = await db.clickEvent.findMany({
    where: {
      link: {
        userId: session.user.id,
      },
      createdAt: {
        gte: startDate,
        lte: endOfDay,
      },
    },
    include: {
      link: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const totalClicks = clicks.length;

  // Clicks over time (by day)
  const clicksByDate = clicks.reduce((acc, click) => {
    const date = new Date(click.createdAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Fill in missing dates with 0 clicks
  const currentDate = new Date(startDate);
  const clicksOverTime: ClicksOverTime[] = [];

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    clicksOverTime.push({
      date: dateStr,
      clicks: clicksByDate[dateStr] || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Popular links
  const linksClicks = clicks.reduce((acc, click) => {
    const linkId = click.linkId;
    if (!acc[linkId]) {
      acc[linkId] = {
        key: click.link.key,
        url: click.link.url,
        title: click.link.title,
        count: 0,
      };
    }
    acc[linkId].count++;
    return acc;
  }, {} as Record<string, { key: string; url: string; title: string | null; count: number }>);

  const popularLinks: PopularLink[] = Object.values(linksClicks)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((link) => ({
      key: link.key,
      url: link.url,
      title: link.title,
      clicks: link.count,
      percentage: totalClicks > 0 ? (link.count / totalClicks) * 100 : 0,
    }));

  // Top referers
  const refererCounts = clicks.reduce((acc, click) => {
    const referer = click.referer || "Direct";
    acc[referer] = (acc[referer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topReferers: TopReferer[] = Object.entries(refererCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([referer, count]) => ({
      referer,
      count,
      percentage: totalClicks > 0 ? (count / totalClicks) * 100 : 0,
    }));

  // Top regions
  const countryCounts = clicks.reduce((acc, click) => {
    const country = click.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topRegions: TopRegion[] = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({
      country,
      count,
      percentage: totalClicks > 0 ? (count / totalClicks) * 100 : 0,
    }));

  // Top browsers
  const browserCounts = clicks.reduce((acc, click) => {
    const browser = click.browser || "Unknown";
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topBrowsers: TopBrowser[] = Object.entries(browserCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: totalClicks > 0 ? (count / totalClicks) * 100 : 0,
    }));

  // Top devices
  const deviceCounts = clicks.reduce((acc, click) => {
    const device = click.device || "Unknown";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topDevices: TopDevice[] = Object.entries(deviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([device, count]) => ({
      device,
      count,
      percentage: totalClicks > 0 ? (count / totalClicks) * 100 : 0,
    }));

  return {
    data: {
      clicksOverTime,
      totalClicks,
      popularLinks,
      topReferers,
      topRegions,
      topBrowsers,
      topDevices,
    },
  };
}

export async function getLinkAnalyticsData({
  linkKey,
  startDate,
  endDate,
}: {
  linkKey: string;
  startDate: Date;
  endDate: Date;
}): Promise<{ data: Omit<AnalyticsData, "popularLinks"> } | { error: string }> {
  // Find the link first
  const link = await db.link.findUnique({
    where: { key: linkKey },
  });

  if (!link) {
    return {
      error: "Link not found",
    };
  }

  // Set endDate to end of day
  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Get all clicks for this link within date range
  const clicks = await db.clickEvent.findMany({
    where: {
      linkId: link.id,
      createdAt: {
        gte: startDate,
        lte: endOfDay,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const totalClicks = clicks.length;

  // Clicks over time (by day)
  const clicksByDate = clicks.reduce((acc, click) => {
    const date = new Date(click.createdAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Fill in missing dates with 0 clicks
  const currentDate = new Date(startDate);
  const clicksOverTime: ClicksOverTime[] = [];

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    clicksOverTime.push({
      date: dateStr,
      clicks: clicksByDate[dateStr] || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Top referers
  const refererCounts = clicks.reduce((acc, click) => {
    const referer = click.referer || "Direct";
    acc[referer] = (acc[referer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topReferers: TopReferer[] = Object.entries(refererCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([referer, count]) => ({
      referer,
      count,
      percentage: totalClicks > 0 ? (count / totalClicks) * 100 : 0,
    }));

  // Top regions
  const countryCounts = clicks.reduce((acc, click) => {
    const country = click.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topRegions: TopRegion[] = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({
      country,
      count,
      percentage: totalClicks > 0 ? (count / totalClicks) * 100 : 0,
    }));

  // Top browsers
  const browserCounts = clicks.reduce((acc, click) => {
    const browser = click.browser || "Unknown";
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topBrowsers: TopBrowser[] = Object.entries(browserCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: totalClicks > 0 ? (count / totalClicks) * 100 : 0,
    }));

  // Top devices
  const deviceCounts = clicks.reduce((acc, click) => {
    const device = click.device || "Unknown";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topDevices: TopDevice[] = Object.entries(deviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([device, count]) => ({
      device,
      count,
      percentage: totalClicks > 0 ? (count / totalClicks) * 100 : 0,
    }));

  return {
    data: {
      clicksOverTime,
      totalClicks,
      topReferers,
      topRegions,
      topBrowsers,
      topDevices,
    },
  };
}

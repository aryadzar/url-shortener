import { getLinkDetails } from "@/actions/links";
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
import { notFound } from "next/navigation";
import { CopyButton, QrCodeClient } from "./client";
import { Metadata } from "next";
import { getBaseUrl } from "@/lib/getBaseUrl";
import Link from "next/link";

type Props = {
  params: {
    key: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const link = await getLinkDetails(key);

  if (!link) {
    return {
      title: "Link Details",
      description: "Detailed analytics for your short link.",
    };
  }

  return {
    title: `Details for ${link.key}`,
    description: `Detailed analytics for your short link: ${link.url}`,
  };
}

export default async function LinkDetailPage({ params }: Props) {
  const { key } = await params;
  const link = await getLinkDetails(key);

  if (!link) {
    return notFound();
  }

  const shortUrl = `${getBaseUrl()}/${link.key}`;

  // Aggregate click data
  const clicksByCountry = link.clicks.reduce((acc, click) => {
    const country = click.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const clicksByBrowser = link.clicks.reduce((acc, click) => {
    const browser = click.browser || "Unknown";
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const clicksByOS = link.clicks.reduce((acc, click) => {
    const os = click.os || "Unknown";
    acc[os] = (acc[os] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentClicks = link.clicks.slice(0, 10);

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Link Details</h1>
        <p className="text-muted-foreground">
          Detailed information for your short link.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <QrCodeClient value={shortUrl} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Short Link</span>
                  <CopyButton textToCopy={shortUrl} />
                </div>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline block truncate"
                >
                  {shortUrl.replace(/^https?:\/\//, "")}
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Original URL</span>
                  <CopyButton textToCopy={link.url} />
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:underline block truncate"
                >
                  {link.url}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Clicks</CardTitle>
              <CardDescription>All time clicks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{link.clicks.length}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Clicks by Country</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(clicksByCountry).length > 0 ? (
                  Object.entries(clicksByCountry).map(([country, count]) => (
                    <div key={country} className="flex justify-between">
                      <span>{country}</span>
                      <strong>{count}</strong>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No data yet</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Clicks by Browser</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(clicksByBrowser).length > 0 ? (
                  Object.entries(clicksByBrowser).map(([browser, count]) => (
                    <div key={browser} className="flex justify-between">
                      <span>{browser}</span>
                      <strong>{count}</strong>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No data yet</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Clicks by OS</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(clicksByOS).length > 0 ? (
                  Object.entries(clicksByOS).map(([os, count]) => (
                    <div key={os} className="flex justify-between">
                      <span>{os}</span>
                      <strong>{count}</strong>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No data yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Clicks</CardTitle>
          <CardDescription>
            Here are the 10 most recent clicks on your link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead>OS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentClicks.length > 0 ? (
                recentClicks.map((click) => (
                  <TableRow key={click.id}>
                    <TableCell>
                      {new Date(click.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{click.ip || "N/A"}</TableCell>
                    <TableCell>{click.country || "N/A"}</TableCell>
                    <TableCell>{click.browser || "N/A"}</TableCell>
                    <TableCell>{click.os || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No clicks yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>View Detailed Analytics</CardTitle>
          <CardDescription>
            See charts and detailed analytics for this link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href={`/analytics/${link.key}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            View Analytics
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

import { Metadata } from "next";
import { getLinkDetails } from "@/actions/links";
import { notFound } from "next/navigation";
import { LinkAnalyticsClient } from "./analytics-client";
import { getBaseUrl } from "@/lib/getBaseUrl";

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
      title: "Link Analytics",
      description: "Detailed analytics for your short link.",
    };
  }

  return {
    title: `Analytics for ${link.key}`,
    description: `Detailed analytics for your short link: ${link.url}`,
  };
}

export default async function LinkAnalyticsPage({ params }: Props) {
  const { key } = await params;
  const link = await getLinkDetails(key);

  if (!link) {
    return notFound();
  }

  const shortUrl = `${getBaseUrl()}/${link.key}`;

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Link Analytics</h1>
        <p className="text-muted-foreground">
          Analytics for{" "}
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {shortUrl}
          </a>
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Original:{" "}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {link.url}
          </a>
        </p>
      </div>

      <LinkAnalyticsClient linkKey={link.key} />
    </div>
  );
}

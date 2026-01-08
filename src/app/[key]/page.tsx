import { getLinkAndLogClick } from "@/actions/links";
import { notFound } from "next/navigation";
import RedirectPage from "./redirect-page";

type Props = {
  params: {
    key: string;
  };
};

export default async function KeyPage({ params }: Props) {
  const { key } = await params;

  if (!key) {
    return notFound();
  }

  const link = await getLinkAndLogClick(key);

  if (!link) {
    return notFound();
  }

  return <RedirectPage url={link.url} />;
}

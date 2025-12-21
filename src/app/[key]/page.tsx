import { getLinkAndLogClick } from "@/actions/links";
import { notFound, redirect } from "next/navigation";

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

  return redirect(link.url);
}

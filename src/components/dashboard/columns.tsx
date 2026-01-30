"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { TLink } from "@/types/auth";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";

import { deleteLink } from "@/actions/links";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormEditLink } from "../auth/form-edit-link";
import { getBaseUrl } from "@/lib/getBaseUrl";

function copyToClipboard(text: string, message: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(message);
  });
}

// Reusable QRCode component with proportional logo
const QRCodeWithLogo = ({ value, size }: { value: string; size: number }) => {
  const logoSize = Math.floor(size * 0.2); // 20% of QR code size for better scannability

  return (
    <QRCodeSVG
      value={value}
      size={size}
      imageSettings={{
        src: "/scara.png",
        x: undefined,
        y: undefined,
        height: logoSize,
        width: logoSize,
        opacity: 1,
        excavate: true,
      }}
    />
  );
};

const BarcodeCell = ({ link }: { link: TLink }) => {
  const [isOpen, setIsOpen] = useState(false);
  const baseUrl = getBaseUrl();
  const shortUrl = `${baseUrl}/${link.key}`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer hover:opacity-80 transition-opacity"
      >
        <QRCodeWithLogo value={shortUrl} size={50} />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code Preview</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="p-4 bg-white rounded-md">
              <QRCodeWithLogo value={shortUrl} size={300} />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {shortUrl}
            </p>
            <Button
              onClick={() => copyToClipboard(shortUrl, "Short link copied!")}
              variant="outline"
            >
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ActionsCell = ({ link }: { link: TLink }) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const baseUrl = getBaseUrl();
  const shortUrl = `${baseUrl}/${link.key}`;

  const handleDelete = () => {
    startTransition(() => {
      deleteLink(link.id).then((res) => {
        if (res.success) {
          toast.success(res.success);
          queryClient.invalidateQueries({
            queryKey: ["links"],
          });
        } else if (res.error) {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => copyToClipboard(shortUrl, "Short link copied!")}
          >
            Copy short link
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => copyToClipboard(link.url, "Original URL copied!")}
          >
            Copy original URL
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <FormEditLink link={link}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit
            </DropdownMenuItem>
          </FormEditLink>
          <Link href={`/${link.key}/detail`}>
            <DropdownMenuItem>View details</DropdownMenuItem>
          </Link>
          <Link href={`/analytics/${link.key}`}>
            <DropdownMenuItem>View analytics</DropdownMenuItem>
          </Link>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-500"
              onSelect={(e) => e.preventDefault()}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your link
            and all its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const columns: ColumnDef<TLink>[] = [
  {
    accessorKey: "key",
    header: "Short Link",
    cell: ({ row }) => {
      const link = row.original;
      const baseUrl = getBaseUrl();
      const shortUrl = `${baseUrl}/${link.key}`;
      return (
        <Button
          variant="link"
          onClick={() => copyToClipboard(shortUrl, "Short link copied!")}
        >
          {shortUrl.replace(/^https?:\/\//, "")}
        </Button>
      );
    },
  },
  {
    id: "barcode",
    header: "QR Code",
    cell: ({ row }) => <BarcodeCell link={row.original} />,
  },
  {
    accessorKey: "url",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Original URL
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fullUrl = row.original.url;
      return (
        <div className="max-w-[300px] truncate" title={fullUrl}>
          {fullUrl}
        </div>
      );
    },
  },
  {
    accessorKey: "clicks",
    header: "Clicks",
    cell: ({ row }) => {
      return row.original._count.clicks;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell link={row.original} />,
  },
];

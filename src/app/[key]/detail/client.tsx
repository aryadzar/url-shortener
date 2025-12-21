"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export function QrCodeClient({ value }: { value: string }) {
  return (
    <div className="p-4 bg-white rounded-md">
      <QRCodeSVG value={value} size={200} />
    </div>
  );
}

export function CopyButton({ textToCopy }: { textToCopy: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy}>
      <Copy className="h-4 w-4" />
    </Button>
  );
}

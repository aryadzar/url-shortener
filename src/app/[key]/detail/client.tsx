"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

// Reusable QRCode component with proportional logo
function QRCodeWithLogo({ value, size }: { value: string; size: number }) {
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
}

export function QrCodeClient({ value }: { value: string }) {
  return (
    <div className="p-4 bg-white rounded-md inline-block">
      <div className="relative inline-block">
        <QRCodeWithLogo value={value} size={300} />
      </div>
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

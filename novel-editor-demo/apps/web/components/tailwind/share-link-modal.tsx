/**
 * Share Link Modal Component
 * Displays shareable link information for SOW documents
 */

"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";
import { Copy, ExternalLink, Link2, Calendar, Eye } from "lucide-react";

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareLink: string;
  documentTitle: string;
  shareCount?: number;
  firstShared?: string;
  lastShared?: string;
}

export function ShareLinkModal({
  isOpen,
  onClose,
  shareLink,
  documentTitle,
  shareCount = 0,
  firstShared,
  lastShared,
}: ShareLinkModalProps) {
  const handleCopyLink = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareLink);
      toast.success("Share link copied to clipboard!");
    } else {
      // Fallback
      toast.info("Share Link", {
        description: shareLink,
      });
    }
  };

  const handleOpenLink = () => {
    window.open(shareLink, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-[#0e2e33]" />
            Share Document
          </DialogTitle>
          <DialogDescription>
            Anyone with this link can view this document
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Document Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Document</Label>
            <p className="text-sm text-foreground/90 font-medium bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
              {documentTitle}
            </p>
          </div>

          {/* Share Link */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Shareable Link</Label>
            <div className="rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 p-4">
              <Input
                value={shareLink}
                readOnly
                className="font-mono text-sm bg-white dark:bg-slate-900 mb-3"
              />
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1 bg-[#0e2e33] hover:bg-[#0e2e33]/90"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#0e2e33] text-[#0e2e33] hover:bg-slate-50 dark:hover:bg-slate-900"
                  onClick={handleOpenLink}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </Button>
              </div>
            </div>
          </div>

          {/* Share Statistics */}
          {(shareCount > 0 || firstShared || lastShared) && (
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Share Statistics
              </p>
              <div className="space-y-1.5 text-sm text-foreground/80 font-medium">
                {shareCount > 0 && (
                  <p>
                    <strong>Total Shares:</strong> {shareCount}
                  </p>
                )}
                {firstShared && (
                  <p className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <strong>First Shared:</strong>{" "}
                    {new Date(firstShared).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
                {lastShared && (
                  <p className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <strong>Last Shared:</strong>{" "}
                    {new Date(lastShared).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Info Message */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
            <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">
              💡 <strong>Tip:</strong> This link allows read-only access to your document. Anyone with the link can view it, but cannot edit.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="w-full bg-[#0e2e33] hover:bg-[#0e2e33]/90"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

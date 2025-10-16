/**
 * Floating Document Actions (FAB - Floating Action Button)
 * Material Design-style expandable menu for document actions
 */

"use client";

import { useState } from "react";
import { 
  MoreVertical, 
  X, 
  Share2, 
  FileDown, 
  FileSpreadsheet, 
  CloudUpload 
} from "lucide-react";

interface FloatingDocumentActionsProps {
  onShare?: () => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onEmbedToAI?: () => void;
}

export function FloatingDocumentActions({
  onShare,
  onExportPDF,
  onExportExcel,
  onEmbedToAI,
}: FloatingDocumentActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: CloudUpload,
      label: "Embed to AI",
      color: "text-blue-400",
      onClick: onEmbedToAI,
    },
    {
      icon: Share2,
      label: "Share",
      color: "text-emerald-400",
      onClick: onShare,
    },
    {
      icon: FileDown,
      label: "Export PDF",
      color: "text-purple-400",
      onClick: onExportPDF,
    },
    {
      icon: FileSpreadsheet,
      label: "Export Excel",
      color: "text-green-400",
      onClick: onExportExcel,
    },
  ];

  const handleActionClick = (action: typeof actions[0]) => {
    if (action.onClick) {
      action.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Expandable Action Buttons */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex flex-col-reverse gap-3 mb-2">
          {actions.map((action, index) => (
            <div
              key={action.label}
              className="group relative animate-in fade-in slide-in-from-bottom-2 duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Label (appears on hover) */}
              <span className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap bg-[#1b1b1e] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg border border-[#0e2e33]">
                {action.label}
              </span>

              {/* Action Button */}
              <button
                onClick={() => handleActionClick(action)}
                className={`w-12 h-12 rounded-full bg-[#1b1b1e] border border-[#0e2e33] ${action.color} hover:bg-[#0e2e33] hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center`}
                title={action.label}
              >
                <action.icon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center ${
          isOpen ? "rotate-90" : ""
        }`}
        title={isOpen ? "Close menu" : "Open actions"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MoreVertical className="h-6 w-6" />}
      </button>
    </div>
  );
}

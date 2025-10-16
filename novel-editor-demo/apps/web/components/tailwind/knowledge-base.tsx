/**
 * Knowledge Base Component
 * Full iframe view of AnythingLLM for document management and AI chat
 */

"use client";

export function KnowledgeBase() {
  return (
    <div className="h-full w-full bg-[#0e0f0f]">
      <iframe
        src="https://ahmad-anything-llm.840tjq.easypanel.host/"
        className="w-full h-full border-0"
        title="AnythingLLM Knowledge Base"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}

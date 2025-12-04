"use client";

import DOMPurify from "dompurify";
import { useMemo } from "react";

export default function BlogDescription({ html }: { html: string }) {
  const safeHtml = useMemo(() => {
    if (typeof window === "undefined") return "";
    return DOMPurify.sanitize(html || "");
  }, [html]);

  if (!safeHtml) return null;

  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import { ScrollArea } from "@/components/ui/scroll-area";

export const CodePreview = ({ code }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <ScrollArea className="h-full w-full">
      <pre className="p-4 rounded-lg text-sm">
        <code ref={codeRef} className="language-solidity">
          {code}
        </code>
      </pre>
    </ScrollArea>
  );
};
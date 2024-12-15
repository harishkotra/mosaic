import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the props interface for our component
interface CodePreviewProps {
  code: string;
  language?: string;  // Optional prop for syntax highlighting language
}

export const CodePreview: React.FC<CodePreviewProps> = ({ 
  code, 
  language = 'solidity'  // Default to Solidity syntax highlighting
}) => {
  // Define the type for our ref
  const codeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Only highlight if we have a valid code element
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]); // Re-run when code changes

  return (
    <ScrollArea className="h-full w-full">
      <pre className="p-4 rounded-lg text-sm">
        <code 
          ref={codeRef} 
          className={`language-${language}`}
        >
          {code}
        </code>
      </pre>
    </ScrollArea>
  );
};
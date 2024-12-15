"use client";

import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-solidity';
import 'prismjs/themes/prism-tomorrow.css';

interface CodePreviewProps {
  code: string;
}

export function CodePreview({ code }: CodePreviewProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <pre className="text-sm font-mono overflow-auto">
      <code ref={codeRef} className="language-solidity">
        {code}
      </code>
    </pre>
  );
}
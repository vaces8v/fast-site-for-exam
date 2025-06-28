"use client";

import { useState } from "react";
import { FiCopy, FiCheck, FiTerminal, FiFileText } from "react-icons/fi";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", tsx);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("json", json);

interface CodeBlockProps {
  code: string;
  language?: string;
}

const languageIcon: { [key: string]: React.ElementType } = {
  bash: FiTerminal,
  sh: FiTerminal,
  javascript: FiFileText,
  typescript: FiFileText,
  html: FiFileText,
  css: FiFileText,
};

export default function CodeBlock({ code, language = "bash" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const Icon = languageIcon[language] || FiFileText;

  const handleCopy = async () => {
    const textToCopy = code.trimEnd();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback: create a hidden textarea, select its content, copy
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed"; // prevent scrolling to bottom
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-gray-700/50 bg-[#282c34]">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800/80">
        <div className="flex items-center space-x-2 text-xs text-gray-300">
          <Icon className="w-4 h-4" />
          <span className="font-medium">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 text-xs font-medium rounded-md bg-gray-700/80 p-1.5 text-gray-200 transition hover:bg-gray-600"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <FiCheck className="h-4 w-4 text-green-400" />
              <span className="pr-1">Скопировано!</span>
            </>
          ) : (
            <>
              <FiCopy className="h-4 w-4" />
              <span>Копировать</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "bash"}
        style={theme}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          backgroundColor: "transparent",
        }}
        wrapLongLines
        codeTagProps={{
          style: {
            fontSize: "1.125rem",
            lineHeight: "1.6",
          },
        }}
      >
        {code.trimEnd()}
      </SyntaxHighlighter>
    </div>
  );
} 
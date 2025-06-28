"use client";

import React from "react";
import { FiMenu, FiX } from "react-icons/fi";

interface ContentLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function ContentLayout({ sidebar, children }: ContentLayoutProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="max-w-screen-xl mx-auto flex items-start">
      {/* Mobile burger */}
      <button
        className="fixed top-4 left-4 z-40 rounded-md p-2 bg-white/80 dark:bg-black/60 backdrop-blur-md shadow lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Открыть меню"
      >
        <FiMenu className="h-6 w-6" />
      </button>

      {/* Desktop sidebar */}
      <aside className="w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto bg-gray-50/80 dark:bg-black/80 backdrop-blur-sm p-6 hidden lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-gray-50 dark:bg-black overflow-y-auto p-6">
            <button
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
              onClick={() => setOpen(false)}
              aria-label="Закрыть меню"
            >
              <FiX className="h-5 w-5" />
            </button>
            {sidebar}
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      <main className="flex-1 flex justify-center px-4 py-12 sm:px-6 lg:px-8 border-x border-dashed border-gray-200 dark:border-gray-800 min-h-[calc(100vh-4rem)]">
        <div className="prose dark:prose-invert max-w-2xl lg:max-w-3xl w-full">
          {children}
        </div>
      </main>
    </div>
  );
} 
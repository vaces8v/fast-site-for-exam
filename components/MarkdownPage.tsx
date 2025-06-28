"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import GithubSlugger from "github-slugger";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import { motion } from "framer-motion";

import CodeBlock from "./CodeBlock";
import ContentLayout from "./ContentLayout";

interface NavItem {
  id: string;
  label: string;
}

interface MarkdownPageProps {
  filePath: string;
  pageTitle: string;
}

export default function MarkdownPage({ filePath, pageTitle }: MarkdownPageProps) {
  const [markdown, setMarkdown] = useState("");
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [activeNavId, setActiveNavId] = useState("");

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const res = await fetch(filePath);
        if (!res.ok) {
          setMarkdown(`# Ошибка\n\nНе удалось загрузить файл: \`${filePath}\``);
          setNavItems([]);
          return;
        }
        let text = await res.text();
        text = text.replace("{{year}}", new Date().getFullYear().toString());
        setMarkdown(text);

        const sluggerNav = new GithubSlugger();
        const headings: NavItem[] = [];
        let inFence = false;
        for (const line of text.split("\n")) {
          const trimmed = line.trim();
          if (trimmed.startsWith("```")) {
            inFence = !inFence;
            continue;
          }
          if (!inFence && trimmed.startsWith("#")) {
            const label = trimmed.replace(/^#+\s+/, "").trim();
            const id = sluggerNav.slug(label);
            headings.push({ id, label });
          }
        }
        setNavItems(headings);
      } catch (error) {
        console.error("Fetching markdown failed:", error);
        setMarkdown(`# Ошибка\n\nПроизошла сетевая ошибка.`);
        setNavItems([]);
      }
    };

    fetchMarkdown();
  }, [filePath]);

  useEffect(() => {
    if (navItems.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140; // offset for header and padding
      let currentId = navItems[0].id;
      for (const { id } of navItems) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          currentId = id;
        }
      }
      setActiveNavId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  // Ensure active menu item is visible in sidebar
  useEffect(() => {
    if (!activeNavId) return;
    const linkEl = document.querySelector<HTMLAnchorElement>(`a[href='#${activeNavId}']`);
    if (linkEl) {
      linkEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeNavId]);

  const navListVariants = {
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.05 },
    },
    hidden: { opacity: 0 },
  };

  const navItemVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -10 },
  };

  const sidebarContent = (
    <>
      <h1 className="mb-8 text-xl font-bold">{pageTitle}</h1>
      {navItems.length > 0 ? (
        <motion.nav
          className="relative flex flex-col space-y-1 overflow-hidden  mt-10"
          initial="hidden"
          animate="visible"
          variants={navListVariants}
        >
          {navItems.map(({ id, label }) => (
            <motion.div key={id} variants={navItemVariants}>
              <Link
                href={`#${id}`}
                scroll={false}
                className={`relative flex items-center rounded-md px-3 py-2 text-sm transition-colors duration-200 ${
                  activeNavId === id
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
                onClick={(e)=>{
                  e.preventDefault();
                  const el=document.getElementById(id);
                  if(el){
                    el.scrollIntoView({behavior:'smooth',block:'start'});
                    history.replaceState(null, '', `#${id}`);
                    setActiveNavId(id);
                  }
                }}
              >
                {activeNavId === id && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 bg-gray-200/70 dark:bg-gray-800/70 rounded-md"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.nav>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          В этом документе нет разделов для навигации.
        </p>
      )}
    </>
  );

  return (
    <ContentLayout sidebar={sidebarContent}>
      <div className="animate-fade-in">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkSlug]}
          components={{
            h1({ children, ...props }) {
              return <h1 {...props} className="scroll-mt-24">{children}</h1>;
            },
            h2({ children, ...props }) {
              return <h2 {...props} className="scroll-mt-24">{children}</h2>;
            },
            h3({ children, ...props }) {
              return <h3 {...props} className="scroll-mt-24">{children}</h3>;
            },
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className ?? "");
              const language = match ? match[1] : "";
              return !inline ? (
                <CodeBlock
                  code={String(children).replace(/\\n$/, "")}
                  language={language}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </ContentLayout>
  );
} 
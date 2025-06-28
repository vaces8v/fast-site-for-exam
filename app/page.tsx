
import MarkdownPage from "@/components/MarkdownPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ubuntu Cheat Sheet",
};

export default function UbuntuDoc() {
  return <MarkdownPage filePath="/ubuntu.md" pageTitle="Компьютерные сети" />;
}

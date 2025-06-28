import MarkdownPage from "@/components/MarkdownPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PyQt"
}

export default function PyQtPage() {
  return <MarkdownPage filePath="/pyqt.md" pageTitle="PyQt" />;
} 
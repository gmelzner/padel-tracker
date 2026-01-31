import type { Metadata } from "next";
import { ComingSoon } from "@/components/platform/coming-soon";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Padel strategy, tips, news, and guides. Learn how to improve your game with data-driven insights.",
  alternates: {
    canonical: "https://padeltracker.pro/blog",
  },
};

export default function BlogPage() {
  return (
    <ComingSoon
      icon="blog"
      descKey="blogDesc"
    />
  );
}

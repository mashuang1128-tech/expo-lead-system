import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  tone?: "neutral" | "accent" | "country" | "customer";
};

const toneClassMap = {
  neutral: "tag tag-neutral",
  accent: "tag tag-accent",
  country: "tag tag-country",
  customer: "tag tag-customer"
} as const;

export default function Tag({ children, tone = "neutral" }: TagProps) {
  return <span className={toneClassMap[tone]}>{children}</span>;
}

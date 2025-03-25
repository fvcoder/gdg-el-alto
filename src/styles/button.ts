import { tv } from "tailwind-variants";

export const button = tv({
  base: "font-display text-sm font-medium tracking-[0.1px] leading-[20px] inline-flex items-center gap-2 py-[9px] px-[24px] border rounded-[100px]",
  variants: {
    style: {
      text: "text-[var(--md-sys-color-primary)] bg-transparent border-transparent",
      filled:
        "bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-[var(--md-sys-color-primary)] ",
      outlined: "bg-transparent text-[var(--md-sys-color-primary)] border-[var(--md-sys-color-outline)]",
      tonal:
        "bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] border-[var(--md-sys-color-primary-container)]",
    },
  },
  defaultVariants: {
    style: "text",
  },
});

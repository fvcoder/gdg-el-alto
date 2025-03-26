import { tv } from "tailwind-variants";

export const text = tv({
  variants: {
    style: {
      displayMedium:
        "font-display text-balance leading-[52px] text-[45px] font-normal text-[var(--md-sys-color-on-surface)]",
      displaySmall:
        "font-display text-balance leading-[44px] text-[36px] font-normal text-[var(--md-sys-color-on-surface)]",
      headlineMedium:
        "font-display text-balance leading-[36px] text-[28px] font-normal text-[var(--md-sys-color-on-surface)]",
      titleLarge:
        "font-display text-balance leading-[28px] text-[22px] tracking-[0px] font-normal text-[var(--md-sys-color-on-surface)]",
      titleMedium:
        "font-display text-balance leading-[24px] text-[16px] tracking-[0.15px] font-normal text-[var(--md-sys-color-on-surface)]",
      bodyMedium:
        "font-text text-pretty leading-[20px] text-[14px] tracking-[0.25px] font-normal text-[var(--md-sys-color-on-surface-variant)]",
      bodySmall:
        "font-text text-pretty leading-[16px] text-[12px] tracking-[0.4px] font-normal text-[var(--md-sys-color-on-surface-variant)] opacity-80",
    },
  },
  defaultVariants: {
    style: "bodyMedium",
  },
});

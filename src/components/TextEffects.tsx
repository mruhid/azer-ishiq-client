"use client";
import { textContainer, textVariant2 } from "@/lib/motion";
import { motion } from "framer-motion";

export const TypingText = ({
  title,
  textStyle,
}: {
  title: string;
  textStyle?: string;
}) => (
  <motion.p
    variants={textContainer}
    className={`text-foreground/80 text-[14px] font-normal ${textStyle} `}
  >
    {Array.from(title).map((l, i) => (
      <motion.span variants={textVariant2} key={i}>
        {l === " " ? "\u00A0" : l}
      </motion.span>
    ))}
  </motion.p>
);

export const TitleText = ({
  title,
  textStyle,
}: {
  title: string | React.ReactNode;
  textStyle?: string;
}) => (
  <motion.h2
    variants={textVariant2}
    initial="hidden"
    whileInView="show"
    className={`mt-[8px] text-[40px] font-bold text-foreground/80 md:text-[64px] ${textStyle}`}
  >
    {title}
  </motion.h2>
);

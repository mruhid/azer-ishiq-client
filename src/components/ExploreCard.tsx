"use client";

import { fadeIn } from "@/lib/motion";
import styles from "@/lib/styles";
import { motion } from "framer-motion";
const ExploreCard = ({
  id,
  imgUrl,
  title,
  index,
  description,
  active,
  handleClick,
}: {
  id: string;
  imgUrl: string;
  title: string;
  description: string;
  index: number;
  active: string;
  handleClick: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <motion.div
    variants={fadeIn("rihht", "spring", index * 0.5, 0.75)}
    className={`relative ${active === id ? "flex-[10] lg:flex-[3.5]" : "flex-[2] lg:flex-[0.5]"} duration-[0.7s] ease-out-flex flex h-[700px] min-w-[170px] cursor-pointer items-center justify-center rounded-[24px] border-[3px] border-primary/30 transition-[flex]`}
    onClick={() => handleClick(id)}
  >
    <img
      src={imgUrl}
      alt={title}
      className="absolute h-full w-full rounded-[24px] object-cover"
    />
    {active !== id ? (
      <h3 className="absolute z-0 rounded-lg bg-[rgba(0,0,0,0.5)] p-2 text-[18px] font-semibold text-white sm:text-[26px] lg:bottom-24 lg:origin-[0,0] lg:rotate-[-90deg]">
        {title}
      </h3>
    ) : (
      <div className="absolute bottom-0 w-full flex-col justify-start rounded-b-[24px] bg-[rgba(0,0,0,0.5)] p-2 sm:p-8">
        <div
          className={`${styles.flexCenter} hidden sm:flex glassmorphism mb-[16px] h-[60px] w-[60px] rounded-[24px]`}
        >
          <img
            src="assets/headset.svg"
            alt="headset"
            className="h-1/2 w-1/2 object-contain"
          />
        </div>

        <h2 className="mt-[24px] text-[20px] font-semibold text-white sm:text-[25px]">
          {title}
        </h2>
        <p className="mt-[24px] text-[15px] font-normal text-white sm:text-[20px]">
          {description}
        </p>
      </div>
    )}
  </motion.div>
);

export default ExploreCard;

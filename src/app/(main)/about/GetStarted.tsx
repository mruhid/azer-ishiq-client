"use client";
import StartSteps from "@/components/StartSteps";
import { TitleText, TypingText } from "@/components/TextEffects";
import { startingFeatures } from "@/lib/constant";
import { fadeIn, planetVariants, staggerContainer } from "@/lib/motion";
import styles from "@/lib/styles";
import { motion } from "framer-motion";

const GetStarted = () => (
  <section className={`${styles.paddings} relative z-0`}>
    <motion.div
      variants={staggerContainer}
      initial={"hidden"}
      whileInView={"show"}
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex flex-col gap-8 lg:flex-row`}
    >
      <motion.div
        variants={planetVariants("left")}
        className={`flex-1 ${styles.flexCenter}`}
      >
        <img
          src="assets/get-started.png"
          alt="get-started"
          className="h-[90%] w-[90%] object-contain"
        />
      </motion.div>
      <motion.div
        variants={fadeIn("left", "tween", 0.2, 1)}
        className={`flex flex-[0.75] flex-col justify-center`}
      >
        <TypingText title={"| Our Responsibilities"} />
        <TitleText title={<>Our focus is on energy efficiency</>} />
        <div className="mt-[31px] flex max-w-[370px] flex-col gap-[24px]">
          {startingFeatures.map((item, i) => (
            <StartSteps key={item} number={i + 1} text={item} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  </section>
);

export default GetStarted;

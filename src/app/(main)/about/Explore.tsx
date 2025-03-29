"use client";
import ExploreCard from "@/components/ExploreCard";
import { TitleText, TypingText } from "@/components/TextEffects";
import { exploreWorlds } from "@/lib/constant";
import { staggerContainer } from "@/lib/motion";
import styles from "@/lib/styles";
import { motion } from "framer-motion";
import { useState } from "react";

const Explore = () => {
  const [active, setActive] = useState("world-1");

  return (
    <section className={`${styles.paddings}`} id="explore">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex flex-col`}
      >
        <TypingText title={"| Power Station"} textStyle="text-center" />
        <TitleText
          title={
            <>
              See our other branch you want <br className="hidden md:block" />{" "}
              to get information{" "}
            </>
          }
          textStyle={"text-center"}
        />
        <div className="mt-[50px] flex min-h-[70vh] flex-col gap-5 lg:flex-row">
          {exploreWorlds.map((world, index) => (
            <ExploreCard
              key={world.id}
              {...world}
              index={index}
              title={world.title}
              description={world.description}
              imgUrl={world.imgUrl}
              active={active}
              handleClick={setActive}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Explore;

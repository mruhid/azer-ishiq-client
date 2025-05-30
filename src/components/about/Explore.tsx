"use client";
import ExploreCard from "@/components/ExploreCard";
import { TitleText, TypingText } from "@/components/TextEffects";
import { exploreWorlds } from "@/lib/constant";
import { staggerContainer } from "@/lib/motion";
import styles from "@/lib/styles";
import { motion } from "framer-motion";
import { useState } from "react";

const Explore = ({ lang }: { lang?: string }) => {
  const [active, setActive] = useState("world-1");
  const isAzerbaijani = lang === "az";

  return (
    <section className={`${styles.paddings}`} id="explore">
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex flex-col`}
      >
        <TypingText
          title={isAzerbaijani ? "| Elektrik Stansiyası" : "| Power Station"}
          textStyle="text-center"
        />
        <TitleText
          title={
            isAzerbaijani ? (
              <>
                Məlumat almaq istədiyiniz digər{" "}
                <br className="hidden md:block" /> filiallarımıza baxın
              </>
            ) : (
              <>
                See our other branch you want <br className="hidden md:block" />{" "}
                to get information
              </>
            )
          }
          textStyle={"text-center"}
        />
        <div className="mt-[50px] flex min-h-[70vh] flex-col gap-5 lg:flex-row">
          {exploreWorlds[isAzerbaijani ? 1 : 0].map((world, index) => (
            <ExploreCard
              key={world.id}
              {...world}
              index={index}
              title={isAzerbaijani ? world.title : world.title}
              description={
                isAzerbaijani ? world.description : world.description
              }
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

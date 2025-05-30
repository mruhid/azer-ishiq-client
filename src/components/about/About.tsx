"use client";
import { TypingText } from "@/components/TextEffects";
import { fadeIn, staggerContainer } from "@/lib/motion";
import styles from "@/lib/styles";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const About = ({ lang }: { lang?: string }) => {
  const isAzerbaijani = lang === "az"; // You can pass "az" to show Azerbaijani text

  return (
    <motion.section className={`${styles.paddings} relative z-0`}>
      <div className="gradient-02 z-0" />
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
      >
        <TypingText
          title={isAzerbaijani ? "| Azərişıq Haqqında" : "| About Azerishiq"}
          textStyle="text-center"
        />
        <motion.p
          variants={fadeIn("up", "tween", 0.2, 1)}
          className={`text-secondary-white mt-[8px] text-center text-[20px] font-normal sm:text-[32px]`}
        >
          {isAzerbaijani ? (
            <>
              <span className="font-extrabold text-primary">
                {" "}
                Azərişıq ASC{" "}
              </span>
              — Azərbaycanda aparıcı elektrik enerjisi paylayıcısıdır və ölkə
              üzrə stabil və davamlı enerji təchizatına cavabdehdir. Bizim
              missiyamız — milyonlarla istifadəçiyə, istər ev təsərrüfatları,
              istərsə də iri sənaye müəssisələrinə dayanıqlı və yüksək
              keyfiyyətli elektrik xidməti təqdim etməkdir. Biz enerji
              itkilərinin azaldılması, bərpa olunan enerjinin inteqrasiyası və
              <span className="font-extrabold text-primary">
                {" "}
                ətraf mühitə uyğun{" "}
              </span>
              həllərin təşviqi ilə Azərbaycanın davamlı inkişaf hədəflərini
              dəstəkləyirik.
            </>
          ) : (
            <>
              <span className="font-extrabold text-primary">
                {" "}
                Azərishıq ASC{" "}
              </span>
              is the leading electricity distribution company in
              <span className="font-extrabold text-primary"> Azerbaijan </span>,
              responsible for ensuring a stable and sustainable power supply
              <span className="font-extrabold text-primary">
                {" "}
                across the country{" "}
              </span>
              . Our mission is to provide reliable, high-quality, and
              uninterrupted electricity services to millions of consumers, from
              households to large industries. We are working towards reducing
              energy losses, increasing renewable energy integration, and
              promoting
              <span className="font-extrabold text-primary">
                {" "}
                environmentally friendly{" "}
              </span>
              power solutions to support Azerbaijan’s sustainable development
              goals.
            </>
          )}
        </motion.p>

        <motion.div
          variants={fadeIn("up", "tween", 0.3, 1)}
          className="mt-[28px] h-[28px] w-[18px]"
        >
          <ArrowDown size={40} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default About;

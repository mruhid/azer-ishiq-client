"use client";
import { slideIn, staggerContainer, textVariant } from "@/lib/motion";
import styles from "@/lib/styles";
import { motion } from "framer-motion";
const Hero = () => {
  return (
    <section className={`${styles.yPaddings} sm:pl-16`}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex flex-col`}
      >
        <div
          className={`relative z-0 flex flex-col items-center justify-center`}
        >
          <motion.h1
            variants={textVariant(1.1)}
            className={`${styles.heroHeading}`}
          >
            Azerishiq
          </motion.h1>
          <motion.div
            variants={textVariant(1.2)}
            className="mb-[60px] flex flex-row items-center justify-center"
          >
            <h1 className={`${styles.heroHeading}`}>ASC</h1>
            {/* <div className={`${styles.heroDText}`} />
            <h1 className={`${styles.heroHeading}`}>Ness</h1> */}
          </motion.div>
        </div>
        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className="relative -mt-[12px] w-full md:-mt-[20px]"
        >
          <div className="absolute -top-[30px] z-[0] h-[300px] w-full rounded-tl-[140px] bg-gradient-to-r from-primary to-indigo-900" />
          <img
            src="/assets/authLogo.jpg"
            alt="cover"
            className="relative z-0 h-[300px] w-full rounded-tl-[140px] object-cover sm:h-[500px]"
          />
          <a href="#explore">
            <div className="relative z-0 -mt-[50px] flex w-full justify-end  pr-[40px] sm:-mt-[70px]">
              <img
                src="/assets/stock.png"
                alt="stamp"
                className="sm-w-[155px] h-[100px] w-[100px] rounded-full object-contain sm:h-[155px]"
              />
            </div>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

"use client";

import { exploreWorlds } from "@/lib/constant";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Button } from "./ui/button";
import { useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % exploreWorlds.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[380px] mx-auto bg-[#e0e4ec] px-4 sm:max-w-7xl md:px-10 lg:px-20">
      <Carousel
        className="mx-auto w-full max-w-[400px] md:max-w-[600px] lg:max-w-[1000px]"
        opts={{ align: "start" }}
      >
        <CarouselContent
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.8s ease-in-out",
          }}
        >
          {exploreWorlds[1].map((item, index) => (
            <CarouselItem key={index} className="mx-auto w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto flex flex-col-reverse items-center justify-center gap-6 p-6 lg:flex-row lg:justify-between"
                >
                  {/* Text Section */}
                  <div className="flex flex-col items-start justify-start gap-y-6 md:w-full lg:w-1/2">
                    <h2 className="text-2xl font-semibold text-gray-800 md:text-3xl">
                      {item.title}
                    </h2>
                    <p className="text-md leading-relaxed text-gray-600 md:text-base">
                      {item.description.length > 250
                        ? item.description.slice(0, 250) + "..."
                        : item.description}
                    </p>
                    <Button className="mt-2 h-12 w-28 rounded-lg border border-primary bg-primary text-xl transition-all duration-300 hover:border-black/50 hover:bg-white hover:text-primary">
                      Ətraflı
                    </Button>
                  </div>

                  {/* Image Section */}
                  <div className="hidden w-full justify-center p-4 xl:flex">
                    <img
                      src={item.imgUrl}
                      alt={item.title}
                      className="h-[300px] w-[300px] rounded-xl object-cover md:h-[350px] md:w-[350px]"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

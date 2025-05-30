import About from "./About";
import Explore from "./Explore";
import GetStarted from "./GetStarted";
import Hero from "./Hero";

export default function AboutLayout({ lang }: { lang?: string }) {
  return (
    <div className="bg-primary-black overflow-hidden">
      <Hero />
      <div className="relative">
        <About lang={lang} />
        <div className="gradient-03 z-0" />
        <Explore lang={lang} />
      </div>
      <div className="relative">
        <GetStarted lang={lang} />
        <div className="gradient-04 z-0" />
      </div>
    </div>
  );
}

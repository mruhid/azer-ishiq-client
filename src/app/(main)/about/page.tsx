import About from "./About";
import Explore from "./Explore";
import GetStarted from "./GetStarted";
import Hero from "./Hero";

export default function Page() {
  return (
    <div className="bg-primary-black overflow-hidden">
      <Hero />
      <div className="relative">
        <About />
        <div className="gradient-03 z-0" />
        <Explore />
      </div>
      <div className="relative">
        <GetStarted />
        <div className="gradient-04 z-0" />
      </div>
      {/* <World />
      <div className="relative">
        <Insights />
        <div className="gradient-04 z-0" />
        <Feedback />
      </div>
      <Footer /> */}
    </div>
  );
}

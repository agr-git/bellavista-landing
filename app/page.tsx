import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Farm from "@/components/sections/Farm";
import Coffee from "@/components/sections/Coffee";
import Stay from "@/components/sections/Stay";
import Journal from "@/components/sections/Journal";
import Footer from "@/components/Footer";
import MotionWrapper from "@/components/MotionWrapper";

export default function Home() {
  return (
    <main>
      <Hero />
      <MotionWrapper>
        <Story />
      </MotionWrapper>
      <MotionWrapper>
        <Farm />
      </MotionWrapper>
      <MotionWrapper>
        <Coffee />
      </MotionWrapper>
      <MotionWrapper>
        <Stay />
      </MotionWrapper>
      <MotionWrapper>
        <Journal />
      </MotionWrapper>
      <Footer />
    </main>
  );
}

import Comparison from "@/components/Home/Comparison";
import Faq from "@/components/Home/Faq";
import FeatureCards from "@/components/Home/FeatureCards";
import Hero from "@/components/Home/Hero";
import WhyVocabbo from "@/components/Home/WhyVocabbo";

const Home = () => {
  return (
    <section className="w-full h-full">
      <Hero />
      <WhyVocabbo />
      <FeatureCards />
      <Comparison />
      <Faq />
    </section>
  );
};

export default Home;

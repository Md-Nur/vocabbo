import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <>
      
      <div className="h-[65] fixed top-0 w-full bg-base-200"> </div>
      <div className="hero w-full bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse max-w-6xl mx-auto">
          <Image
            alt="hero"
            width={1000}
            height={1000}
            src="/hero.png"
            className="max-w-sm"
          />
          <div>
            <h1 className="text-5xl font-bold">Vocabbo</h1>
            <p className="py-6">
              Vocabbo is a vocabulary learning app that helps you learn and
              memorize new words quickly and effectively. With its user-friendly
              interface and personalized learning plans, Vocabbo makes it easy
              to expand your vocabulary and improve your language skills.
            </p>
            <Link href="/auth/signup" className="btn btn-primary mr-3">
              Join
            </Link>
            <Link href="/auth/login" className="btn btn-primary ml-3">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

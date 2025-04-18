import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import Link from "next/link";
import HeroImg from "../../../public/hero.png";

const Hero = () => {
  const { user } = useAppSelector((state) => state.user);
  return (
    <>
      <div className="h-[65] fixed top-0 w-full bg-gradient-to-r from-base-200 to-base-300"></div>
      <div className="hero w-full bg-gradient-to-r from-base-200 to-base-300 md:py-20 py-5">
        <div className="hero-content flex-col lg:flex-row-reverse max-w-6xl mx-auto">
          <Image
            alt="hero"
            src={HeroImg}
            placeholder="blur"
            className="max-w-sm w-full"
          />
          <div className="">
            <h1 className="text-5xl font-bold leading-16">
              Learn{" "}
              <span className="from-primary to-secondary text-transparent bg-clip-text bg-gradient-to-r">
                words,{" "}
              </span>
              play{" "}
              <span className="from-secondary to-accent text-transparent bg-clip-text bg-gradient-to-r">
                quizzes,{" "}
              </span>
              and grow your{" "}
              <span className="from-primary to-secondary text-transparent bg-clip-text bg-gradient-to-r">
                skills!
              </span>
              📚
            </h1>
            <p className="py-6">
              Explore new words, test yourself with quizzes, and see how you
              rank against others. Learning has never been this fun!
            </p>
            {!user ? (
              <>
                <Link href="/auth/signup/1" className="btn btn-primary mr-3">
                  Join
                </Link>
                <Link href="/auth/login" className="btn btn-primary ml-3">
                  Login
                </Link>
              </>
            ) : (
              <Link href="/new-words" className="btn btn-primary">
                Start Learning
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

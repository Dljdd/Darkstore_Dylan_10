"use client"
import Navbar from "@/components/global/navbar";
import { ContainerScroll } from "@/components/global/container-scroll-animation";
import { Button } from "@/components/ui/button";
import { clients, products } from "@/lib/constant";
import { InfiniteMovingCards } from "@/components/global/infinite-moving-cards";
import { HeroParallax } from "@/components/global/connect-parallax";
import { LampComponent } from "@/components/global/lamp";
import { CardBody, CardContainer, CardItem } from "@/components/global/3d-card";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Home() {
  const router = useRouter(); // Initialize router

  return (
    <main>
      <Navbar />
      <section className="h-screen w-full bg-neutral-950 rounded-md !overflow-visible relative flex flex-col items-center antialiased">
        <div className="absolute inset-0 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"></div>
        <div className="flex flex-col mt-[-100px] md:mt-[-50px]">
          <ContainerScroll
            titleComponent={
              <div className="flex items-center flex-col">
                <h1 className="text-6xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 font-sans font-bold">
                  Introducing ZoneScore
                </h1>
                <p className="text-xl md:text-2xl mt-4 text-center text-neutral-400 max-w-3xl">
                  ZoneScore uses cutting-edge AI-driven algorithms to assess the demand and profitability of potential dark store locations. 
                  Know exactly where to open your next store and maximize your returns.
                </p>
                <Button
                  size={"lg"}
                  className="p-8 mt-8 md:mb-0 text-2xl w-full sm:w-fit border-t-2 rounded-full border-[#4D4D4D] bg-[#1F1F1F] hover:bg-white group transition-all flex items-center justify-center gap-4 hover:shadow-xl hover:shadow-neutral-500 duration-500"
                  onClick={() => router.push('/dashboard')} // Redirect to /dashboard
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-500 to-neutral-600 md:text-center font-sans group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-black">
                    Start Optimizing with ZoneScore Today
                  </span>
                </Button>
              </div>
            }
          />
        </div>
      </section>

      <InfiniteMovingCards
        className="md:mt-[39rem] mt-[200px]"
        items={clients}
        direction="right"
        speed="slow"
      />

      <section className="mt-[100px]">
        <HeroParallax products={products}></HeroParallax>
      </section>

      <section className="mt-[-500px] mb-14">
        <LampComponent />
        <div className="flex flex-wrap items-center justify-center flex-col md:flex-row gap-8 -mt-72">
          <CardContainer className="inter-var ">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                Starter Plan
                <h2 className="text-6xl">$1.99</h2>
              </CardItem>
              <CardItem
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Get access to ZoneScore basics. Ideal for individuals and small businesses to identify potential growth zones.
                <ul className="my-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Basic ZoneScore Insights
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Warehouse Registration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Connect to Delivery Networks
                  </li>
                </ul>
              </CardItem>
              <div className="flex justify-between items-center mt-8">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  Try now →
                </CardItem>
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Get Started Now
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>

          <CardContainer className="inter-var ">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-[#E2CBFF] border-black/[0.1] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                Pro Plan
                <h2 className="text-6xl">$4.99</h2>
              </CardItem>
              <CardItem
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Unlock advanced ZoneScore features to make more informed decisions. Perfect for growing businesses.
                <ul className="my-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Advanced Demand Score
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Dynamic Mapping Tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Priority Support
                  </li>
                </ul>
              </CardItem>
              <div className="flex justify-between items-center mt-8">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  Try now →
                </CardItem>
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Get Started Now
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>

          <CardContainer className="inter-var ">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                Enterprise Plan
                <h2 className="text-6xl">$9.99</h2>
              </CardItem>
              <CardItem
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Tailored ZoneScore solutions for enterprises managing large-scale warehousing operations.
                <ul className="my-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Unlimited ZoneScore Access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Custom Automation & Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Dedicated Account Manager
                  </li>
                </ul>
              </CardItem>
              <div className="flex justify-between items-center mt-8">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  Try now →
                </CardItem>
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Get Started Now
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </div>
      </section>
    </main>
  );
}
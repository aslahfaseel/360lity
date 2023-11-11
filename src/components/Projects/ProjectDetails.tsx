"use client";
import { LeftArrow, LogoView, RightArrow, ShareIcon } from "@/assets";
import { Project } from "@/types/project";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Triangle from "../../common/Triangle";
import { AnimatePresence, motion } from "framer-motion";
const ProjectDetails: React.FC<{
  currentSlide: number;
  direction: string;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
  setDirection: React.Dispatch<React.SetStateAction<string>>;
  length?: number;
  projectIndex?: number;
  val: Project;
}> = ({
  currentSlide,
  setCurrentSlide,
  val,
  length,
  setDirection,
  direction,
  projectIndex,
}) => {
  const router = useRouter();
  const [isReadMore, setIsReadMore] = useState(true);

  console.log(Number(currentSlide) + 1, "test");

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      key={projectIndex}
      variants={slideVariants}
      initial={direction === "right" ? "hiddenRight" : "hiddenLeft"}
      animate="visible"
      exit="exit"
      className="mt-5 grid lg:grid-cols-2 gap-x-6 grid-cols-1 gap-y-8"
    >
      <div className="relative rounded-x w-full h-[375px] group overflow-hidden inline-block">
        <Triangle />
        {val?.image?.length ? (
          <Image
            src={val?.image}
            fill
            className="rounded-[10px] object-cover transition group-hover:bg-black/30 duration-1000 scale-110 group-hover:scale-100"
            alt={val?.name}
          />
        ) : (
          val?.name
        )}
        <div className="absolute bg-black/50 w-full h-full opacity-0 flex justify-center items-center group-hover:opacity-100 z-10">
          <button onClick={() => router.push(`/view-project`)}>
            <Image src={LogoView} alt="360 View Logo" className="" />
          </button>
        </div>
      </div>
      <div className=" py-10 px-8 rounded-[10px] flex flex-col bg-white justify-between">
        <div className=" space-y-4 block">
          <h2>{val?.name}</h2>
          <p className="text-base font-medium">
            {isReadMore ? val?.description?.slice(0, 400) : val?.description}
            {val?.description?.length > 400 && (
              <span onClick={toggleReadMore} className="text-[#0060E4]">
                {isReadMore ? "...Read more" : "...Show less"}
              </span>
            )}
          </p>
        </div>
        <div className="flex mt-auto items-center justify-between">
          {currentSlide != 0 && (
            <button
              onClick={(e: any) => {
                setDirection("left");
                setCurrentSlide((prev) => prev - 1);
              }}
              disabled={currentSlide === 0}
            >
              <Image src={LeftArrow} alt="right arrow icon" />
            </button>
          )}
          <div className="self-end flex items-center gap-5 ml-auto">
            <Image src={ShareIcon} alt="share icon" />
            {length !== Number(currentSlide) + 1 && (
              <button
                onClick={(e: any) => {
                  setDirection("right");
                  setCurrentSlide((prev) => prev + 1);
                }}
                disabled={length === Number(currentSlide) + 1}
              >
                <Image src={RightArrow} alt="right arrow icon" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetails;

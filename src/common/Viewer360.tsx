"use client";

import { useProjects } from "@/api/project";
import { useProjectStore } from "@/store/use-projects";
import { Project } from "@/types/project";
import { Showcase } from "@/types/showcase";
import Image from "next/image";
import React, { Fragment, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  FullScreenIcon,
  InfoIcon,
  ReduceIcon,
  ViewBackIcon,
  ViewNextIcon,
} from "../assets/360-view";
import cn from "classnames";
import { CloseIcon } from "../assets";

const Viewer360: React.FC<{ data?: Showcase[] | Project[] }> = ({ data }) => {
  const searchParams = useSearchParams();
  const index = searchParams.get("index");
  console.log(index, "search");
  const { projectIndex } = useProjectStore();

  const [currentSlide, setCurrentSlide] = React.useState(Number(index));
  const [fullScreen, setFullScreen] = React.useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (index && index?.length)
    return (
      <div className={cn({ "": fullScreen, "p-10": !fullScreen })}>
        {data?.slice(currentSlide, currentSlide + 1).map((el) => {
          return (
            <div key={el?.id} className="relative">
              <iframe
                src={el?.link}
                name="360lity"
                width="100%"
                height="100%"
                allowFullScreen
                className={cn("h-screen", {
                  "rounded-x": !fullScreen,
                })}
              ></iframe>
              {showInfo && (
                <div
                  className={cn(
                    "transition-all duration-300 absolute break-words flex flex-col space-y-4 bg-black/50 px-10 py-7 rounded-x",
                    {
                      "w-0": !showInfo,
                      "scale-1 w-[20rem] right-16 bottom-14 z-30  transition-all duration-300 ":
                        showInfo,
                    }
                  )}
                >
                  <h3 className="text-white text-[25px] font-medium">
                    {el?.name}
                  </h3>
                  <p className="text-white text-base overflow-hidden clear-both block font-medium">
                    {/* @ts-ignore */}
                    {el?.description}
                  </p>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <button
                  className="outline-none group bg-black/50 rounded-full w-[45px] h-[45px] flex items-center justify-center"
                  onClick={() => router.back()}
                >
                  <Image
                    width={23}
                    height={23}
                    src={CloseIcon}
                    alt="Close icon"
                    className="group-hover:scale-105 transition-all duration-300"
                  />
                </button>
              </div>
              <div className="absolute bottom-4 right-4 flex flex-col gap-6">
                {pathname === "/view-showcase" && (
                  <Fragment>
                    <button
                      className="outline-none bg-black/50 rounded-full w-[50px] h-[50px] flex items-center justify-center"
                      disabled={data?.length === Number(currentSlide) + 1}
                      onClick={() => setCurrentSlide((prev) => prev + 1)}
                    >
                      <Image
                        width={10}
                        height={10}
                        src={ViewNextIcon}
                        alt="information icon"
                      />
                    </button>
                    <button
                      className="outline-none bg-black/50 rounded-full w-[50px] h-[50px] flex items-center justify-center"
                      disabled={currentSlide === 0}
                      onClick={() => setCurrentSlide((prev) => prev - 1)}
                    >
                      <Image
                        width={10}
                        height={10}
                        src={ViewBackIcon}
                        alt="information icon"
                      />
                    </button>
                    <button
                      className="outline-none bg-black/50 rounded-full w-[50px] h-[50px] flex items-center justify-center"
                      onClick={() => setShowInfo(!showInfo)}
                    >
                      <Image
                        width={23}
                        height={23}
                        src={InfoIcon}
                        alt="information icon"
                      />
                    </button>
                  </Fragment>
                )}

                <button
                  className="outline-none bg-black/50 rounded-full w-[50px] h-[50px] flex items-center justify-center"
                  onClick={() => setFullScreen((prev) => !prev)}
                >
                  <Image
                    width={23}
                    height={23}
                    src={!fullScreen ? FullScreenIcon : ReduceIcon}
                    alt="Reduce size icon"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
};

export default Viewer360;

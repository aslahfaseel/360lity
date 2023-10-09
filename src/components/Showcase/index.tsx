import Image from "next/image";
import React from "react";
import ShowcaseBox from "./ShowcaseBox";
import { Logo } from "@/assets";
import Header from "@/common/Header";

const Showcase = () => {
  return (
    <div className="py-10">
      <Header heading="Showcase" />
      <div className="mt-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 grid-rows-2 h-[350px]">
          <ShowcaseBox className="bg-green-500 col-span-2 row-span-2" />
          <ShowcaseBox className=" bg-blue-300" />
          <ShowcaseBox className=" bg-blue-300" />
          <ShowcaseBox className=" bg-blue-300 col-span-2" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <ShowcaseBox className="" />
          <ShowcaseBox className="" />
          <ShowcaseBox className="" />
        </div>
      </div>
    </div>
  );
};

export default Showcase;

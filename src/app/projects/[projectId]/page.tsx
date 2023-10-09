import { Logo, RightArrowIcon, ShareIcon } from "@/assets";
import Header from "@/common/Header";
import ProjectDetails from "@/components/Projects/ProjectDetails";
import { projectData } from "@/data/projects";
import Image from "next/image";
import React from "react";

const ProjectPage: React.FC<{ params: { projectId: number } }> = ({
  params,
}) => {
  const project = projectData?.find(
    (el) => el?.id === Number(params?.projectId)
  );

  return (
    <div className="py-10">
      <Header heading="Projects" />
      <div className="mt-5 grid lg:grid-cols-2 gap-x-6 grid-cols-1 gap-y-8">
        <div className="bg-red-500 rounded-[10px] w-full h-[375px] lg:h-auto"></div>
        <ProjectDetails projectId={params?.projectId} data={project} />
      </div>
    </div>
  );
};

export default ProjectPage;

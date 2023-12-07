import React from "react";
import Image from 'next/image';

export interface DashboardHeaderProps {
  imagePath: string;
  heading: string;
  paragraph: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ imagePath, heading, paragraph }) => {
  return (
    <header className="mt-20">
      <Image src={imagePath} alt={heading} width={64} height={70} className="aspect-auto mb-4" />
      <h4 className="font-epilogue text-xl font-bold leading-tight text-secondary-500 md:text-3xl pb-1">{heading}</h4>
      <p className="font-work_sans max-w-2xl">{paragraph}</p>
    </header>
  );
};

export default DashboardHeader;


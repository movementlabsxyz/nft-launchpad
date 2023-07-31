
import React, { FC } from "react";
import Avatar from "./shared/Avatar/Avatar";
import NcImage from "./shared/NcImage/NcImage";
import VerifyIcon from "./shared/VerifyIcon";
import { CollectionData } from "../api";

export interface CollectionCardProps {
  data: CollectionData;
  className?: string;
  imgs?: string[];
  onClick: () => void
}

const CollectionCard: FC<CollectionCardProps> = ({
  data,
  className,
  imgs = [],
  onClick
}) => {
  return (
    <div
      className={`CollectionCard cursor-pointer relative p-4 rounded-2xl overflow-hidden h-[410px] flex flex-col group ${className}`}
    >
      <NcImage containerClassName="absolute inset-0" src={""} />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 group-hover:h-full to-transparent "></div>

      <div className="relative mt-auto">
        {/* AUTHOR */}
        <div className="flex items-center">
          <Avatar sizeClass="h-6 w-6" containerClassName="ring-2 ring-white" imgUrl={data.creator_image} />
          <div className="ml-2 text-xs text-white">
            <span className="font-normal">by</span>
            {` `}
            <span className="font-medium">{data.creator_name}</span>
          </div>
          <VerifyIcon iconClass="w-4 h-4" />
        </div>
        {/* TITLE */}
        <h2 className="font-semibold text-3xl mt-1.5 text-white">
          {data.name}
        </h2>
        {/* LISTS */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          <NcImage
            containerClassName="w-full h-20 rounded-xl overflow-hidden"
            src={imgs[1]}
          />
          <NcImage
            containerClassName="w-full h-20 rounded-xl overflow-hidden"
            src={imgs[2]}
          />
          <NcImage
            containerClassName="w-full h-20 rounded-xl overflow-hidden"
            src={imgs[3]}
          />
        </div>
      </div>

    </div>
  );
};

export default CollectionCard;

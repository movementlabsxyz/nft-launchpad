
import React, { FC } from "react";
import Avatar from "./shared/Avatar/Avatar";
import NcImage from "./shared/NcImage/NcImage";
import VerifyIcon from "./shared/VerifyIcon";
import { CollectionData } from "../api";
import { AptosDecimalToNoDecimal } from "../utils/web3";

export interface CollectionCardProps {
  data: CollectionData;
  className?: string;
  imgs?: string[];
  onClick: () => void
}

const CollectionCard: FC<CollectionCardProps> = ({
  data,
  className,
  onClick
}) => {
  
  let imgs = [
    data?.logo_uri ?? (data?.images_uri + "/1.png"),
    (data?.images_uri + "/1.png"),
    (data?.images_uri + "/2.png"),
    (data?.images_uri + "/3.png")
  ];

  return (
    <div
      className={`CollectionCard cursor-pointer relative p-4 rounded-2xl overflow-hidden h-[410px] flex flex-col group ${className}`}
      onClick={() => onClick()}
    >
      <NcImage containerClassName="absolute inset-0" src={imgs[0]} />
      <div className="text-white absolute top-0 right-0 p-5 bg-gray-700 bg-opacity-60">
        <p className="text-white"><b>Mint Price: {AptosDecimalToNoDecimal(data?.mint_price)} APT</b></p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 group-hover:h-full to-transparent "></div>

      <div className="relative mt-auto">
        {/* AUTHOR */}
        <div className="flex justify-between">
          <div className="flex items-center ">
            <Avatar sizeClass="h-6 w-6" containerClassName="ring-2 ring-white" imgUrl={data?.creator_image ?? ""} />
            <div className="ml-2 text-xs text-white">
              <span className="font-normal">by</span>
              {` `}
              <span className="font-medium">{data?.creator_name ?? ""}</span>
            </div>
            <VerifyIcon iconClass="w-4 h-4" />
          </div>
        </div>
        {/* TITLE */}
        <div className=" mt-1.5 flex justify-between">
          <h2 className="font-bold text-3xl text-white">
            {data?.name ?? ""}
          </h2>
        </div>
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

const Ratings = () => (
  <div className="flex items-center mt-2.5">
    <svg className="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
    <svg className="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
    <svg className="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
    <svg className="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
    <svg className="w-4 h-4 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
    <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
  </div>
)

export default CollectionCard;

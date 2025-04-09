"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Business {
  _id: string;
  name: string;
  category: string;
  description: string;
  logo?: { url: string };
}

const BusinessCard: React.FC<{ business: Business }> = ({ business }) => {
  return (
    <Link href={`/business/${business._id}`} className="transition-transform duration-200 hover:scale-105 cursor-pointer">
      <div className="h-full flex flex-col border rounded-lg shadow-md bg-white overflow-hidden">
        <Image
          src="/default-banner-img.png"
          alt={`${business.name} banner`}
          width={600}
          height={200}
          className="w-full h-40 object-cover"
          priority
        />
        <div className="p-4 flex items-start gap-4 flex-grow">
          <Image
            src={business.logo?.url || "/default-logo.png"}
            alt={`${business.name} logo`}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border border-black aspect-square"
          />
          <div>
            <h2 className="text-xl text-zinc-800 font-semibold">{business.name}</h2>
            <p className="text-sm text-gray-500">{business.category}</p>
            <p className="text-gray-700 mt-1">{business.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;

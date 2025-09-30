"use client";
import { useState } from "react";

export default function SearchSection() {
  const [selected, setSelected] = useState({
    sale: true,
    rent: false,
    commercial: false,
  });

  return (
    <section className="relative w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/search-bg.jpg" // replace with your background
          alt="Properties"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center text-white py-16 px-4">
        {/* Title */}
        <h2 className="text-3xl font-semibold mb-8">1,803 Properties</h2>

        {/* Line 1 - For Sale + To Rent */}
        <div className="flex gap-4 mb-4">
          {/* For Sale */}
          <button
            onClick={() =>
              setSelected((prev) => ({ ...prev, sale: !prev.sale }))
            }
            className={`flex items-center gap-2 px-6 py-2 font-semibold border ${
              selected.sale
                ? "bg-[rgb(206,32,39,255)] border-[rgb(206,32,39,255)] text-white"
                : "bg-white border-gray-300 text-black"
            }`}
          >
            For Sale
            <span
              className={`w-4 h-4 border flex items-center justify-center ${
                selected.sale
                  ? "bg-white text-[rgb(206,32,39,255)]"
                  : "border-gray-400 bg-white"
              }`}
            >
              {selected.sale && "✔"}
            </span>
          </button>

          {/* To Rent */}
          <button
            onClick={() =>
              setSelected((prev) => ({ ...prev, rent: !prev.rent }))
            }
            className={`flex items-center gap-2 px-6 py-2 font-semibold border ${
              selected.rent
                ? "bg-[rgb(206,32,39,255)] border-[rgb(206,32,39,255)] text-white"
                : "bg-white border-gray-300 text-black"
            }`}
          >
            To Rent
            <span
              className={`w-4 h-4 border flex items-center justify-center ${
                selected.rent
                  ? "bg-white text-[rgb(206,32,39,255)]"
                  : "border-gray-400 bg-white"
              }`}
            >
              {selected.rent && "✔"}
            </span>
          </button>
        </div>

        {/* Line 2 - Commercial */}
        <div className="mb-4">
          <button
            onClick={() =>
              setSelected((prev) => ({ ...prev, commercial: !prev.commercial }))
            }
            className={`flex items-center gap-2 px-6 py-2 font-semibold border ${
              selected.commercial
                ? "bg-[rgb(206,32,39,255)] border-[rgb(206,32,39,255)] text-white"
                : "bg-white border-gray-300 text-black"
            }`}
          >
            Commercial
            <span
              className={`w-4 h-4 border flex items-center justify-center ${
                selected.commercial
                  ? "bg-white text-[rgb(206,32,39,255)]"
                  : "border-gray-400 bg-white"
              }`}
            >
              {selected.commercial && "✔"}
            </span>
          </button>
        </div>

        {/* Line 3 - Residential Dropdown */}
        <div className="mb-6 w-full max-w-xs">
          <select className="w-full px-4 py-2 text-black border border-gray-300 outline-none">
            <option>Residential</option>
            <option>Commercial</option>
          </select>
        </div>

        {/* Location Input */}
        <div className="mb-6 w-full max-w-2xl">
          <input
            type="text"
            placeholder="Location"
            className="w-full px-4 py-2 text-black outline-none border border-gray-300"
          />
        </div>

        {/* More Filters */}
        <p className="mb-6 text-white font-medium cursor-pointer hover:underline">
          MORE FILTERS +
        </p>

        {/* Search Button */}
        <button className="bg-[rgb(206,32,39,255)] hover:bg-red-900 text-white px-10 py-3 font-semibold">
          Search
        </button>
      </div>
    </section>
  );
}

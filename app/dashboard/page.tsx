"use client";
import React from "react";
import FavoriteBrewerySection from "./components/FavoriteBrewerySection/FavoriteBrewerySection";
import Navbar from "../components/Navbar/Navbar";
import SearchBrewerySection from "./components/SearchBrewerySection/SearchBrewerySection";

const Dashboard = () => {
  return (
    <div className="bg-light-yellow min-h-screen">
      <Navbar />
      <div className="flex flex-col h-full w-full">
        <FavoriteBrewerySection />
        {/* Divider fixed between 2 sections */}
        <div className="h-[1px] bg-black w-11/12 m-auto" />

        <SearchBrewerySection />
      </div>
    </div>
  );
};

export default Dashboard;

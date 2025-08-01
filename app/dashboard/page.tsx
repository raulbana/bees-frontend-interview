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
        <div
          className="h-[1px] bg-black w-11/12 m-auto"
          role="separator"
          aria-hidden="true"
        />
        <SearchBrewerySection />
      </div>
    </div>
  );
};

export default Dashboard;

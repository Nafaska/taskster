import React from "react";
import AddNewCategory from "./AddNewCategory";
import AllCategories from "./AllCategories";
import Header from "./Header";

const StartPage = () => {
  return (
    <div className="h-screen w-full">
      <Header />
      <div className="flex flex-col w-full justify-between items-center">
        <AllCategories />
        <AddNewCategory />
      </div>
    </div>
  );
};

export default StartPage;

import { BiCategory } from "react-icons/bi";
import CategoryBox from "./CategoryBox";

export default function Category() {
  return (
    <>
      <div className="flex flex-row gap-1 py-2 p-4 items-center">
        <BiCategory className="text-xl text-white" />
        <h1> RetroPGF3 Categories </h1>
      </div>
      <hr className="border-t border-gray-700 my-[1px]" />
      <CategoryBox />
    </>
  );
}

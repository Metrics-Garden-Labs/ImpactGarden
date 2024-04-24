import Image from "next/image";
import Attestbox from "../components/attestbox";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Sidebar from "./sidebar";

export default function Projects() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <div className="w-72 bg-white">
          <Sidebar />
        </div>
        <main className="flex-grow p-6 bg-backgroundgray">
          <h1 >I assume this will be a search page for the project you want to view</h1>
        </main>
      </div>
      <Footer />
    </div>
  );
}


//TODO: make the footer just at the bottom once you have scrolled to the botto
        //its taking too much space at the bottom of the page
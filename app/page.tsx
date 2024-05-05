import Image from "next/image";
import Attestbox from "./components/attestbox";
import Navbar from "./components/navbar1";
import Footer from "./components/footer";

//the plan for this is to recreate the mockup that Mari sent in
//add the connect wallet button to the top right of the screen. 

export default function Home() {
  return (
    <>
    <main className="bg-white text-black">
      <Navbar />
      <h1>This will be the landing page</h1>
    </main>
    </>
  );
}

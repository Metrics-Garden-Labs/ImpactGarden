import Image from "next/image";
import Attestbox from "./components/attestbox";
import Header from "./components/header";
import Footer from "./components/footer";

//the plan for this is to recreate the mockup that Mari sent in
//add the connect wallet button to the top right of the screen. 

export default function Home() {
  return (
    <>
    <main>
      <Header />
      <Attestbox />
      <Footer />
    </main>
    </>
  );
}

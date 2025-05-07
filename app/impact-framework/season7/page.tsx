import Head from "./Head";
import Definition from "./Definition";
import TheoryOfChange from "./TheoryOfChange";
import MainBoxes from "./MainBoxes";
import OneSize from "./OneSize";
import MainImages from "./MainImages";
import Mision from "./Mision";

export default function LandingTwo() {
  return (
    <>
      <div className=" sm:p-16 bg-notion ">
        <Head />
        <Definition />
        <TheoryOfChange />
        <MainBoxes />
        <OneSize />
		<MainImages />
		<Mision />
      </div>
    </>
  );
}

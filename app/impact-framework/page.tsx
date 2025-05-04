import Categories from "./Categories";
import Definition from "./Definition";
import Diving from "./Diving";
import Head from "./Head";
import Intro from "./Intro";
import Category from "./Category";
import NotionLinks from "./Links";

export default function Landing() {
  return (
    <>
      <div className=" sm:p-16 bg-notion ">
        <Head />
        <Intro />
        <Definition />
        <Category />
        <Categories />
        <Diving />
        <Category />
        <NotionLinks />
      </div>
    </>
  );
}

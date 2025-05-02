import Categories from "./Categories";
import Definition from "./Definition";
import Diving from "./Diving";
import Head from "./Head";
import Intro from "./Intro";

export default function Landing() {
  return (
    <>
      <div className="px-16 bg-notion">
        <Head />
        <Intro />
        <Definition />
        <Categories />
		<Diving	/>
      </div>
    </>
  );
}

import SecondTable from "./SecondTable";

export default function ForFunders() {
  return (
    <>
      <div>
        <h1 className="text-xl font-black py-4">📊 Impact Vectors for Funders</h1>
        <p>
          To evaluate whether funding is driving meaningful progress toward
          Season 7’s Interoperability Intent, we use three multi-dimensional
          impact vectors. These vectors balance technical, adoption, and
          economic indicators, making them harder to game and more aligned with
          ecosystem health. They serve as key signals for funders assessing
          project effectiveness, capital efficiency, and long-term alignment.
        </p>
		<SecondTable />
		<div className="w-full my-8 border-t border-gray-400" />
      </div>
    </>
  );
}

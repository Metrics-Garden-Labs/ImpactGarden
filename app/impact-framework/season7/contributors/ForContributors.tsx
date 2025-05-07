import SecondTable from "./SecondTable";

export default function ForContributors() {
  return (
    <>
      <div className="">
        <h1 className="text-xl font-black py-4">
          🛠️ Impact Vectors for Contributors
        </h1>
        <p className="mb-2">
          To ensure your work meaningfully contributes to Season 7’s
          Interoperability Intent, the Collective uses{" "}
          <strong>three multi-dimensional impact vectors.</strong>These guide
          what’s measured, rewarded, and reused — helping you build in ways that
          matter.
          <br />
          <p className="py-4">These vectors help you:</p>
          <li className="py-1 px-4 mx-4 pt-2">
            Understand where to focus your contributions
          </li>
          <li className="py-1 px-4  mx-4">
            Frame your work clearly for RetroRounds, Missions, and public
            dashboards
          </li>
          <li className="py-1 px-4 mx-4">Track and communicate your impact</li>
        </p>
        <SecondTable />
        <div className="w-full my-8 border-t border-gray-400" />
      </div>
    </>
  );
}

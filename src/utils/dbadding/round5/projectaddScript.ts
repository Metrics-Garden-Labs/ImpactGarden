// import { getOpStackProjects } from "./opStackProjects";
// import { addProjectsToDB } from "./addEASProjects";
// import { addContributionsToDB } from "./addEASContributions";
// import { updateProjectsInDB } from "./addverifiedaddress";

// // const POSTGRES_URL = process.env.POSTGRES_URL;

// // const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

// // if (!POSTGRES_URL) {
// //   console.error("POSTGRES_URL environment variable is not set.");
// //   process.exit(1); // Exit with failure
// // }

// // if (!NEYNAR_API_KEY) {
// //   console.error("NEYNAR_API_KEY environment variable is not set.");
// //   process.exit(1); // Exit with failure
// // }
// //last queried 2nd sept 11:45
// //date to query is 2024-09-02T00:00:00Z
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// export const projectaddScript = async () => {
//   const date = "2024-09-02T11:45:00Z";

//   await getOpStackProjects(date);
//   await delay(1000);
//   await addProjectsToDB();
//   await delay(1000);
//   await addContributionsToDB();
//   await delay(1000);
//   await updateProjectsInDB();
// };

// projectaddScript();

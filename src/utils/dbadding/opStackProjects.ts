import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

// Resolve the current directory similar to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Attestation {
  id: string;
  attester: string;
  recipient: string;
  refUID: string;
  revocable: boolean;
  data: string;
  timeCreated: string; // Assuming timeCreated is returned as a string
}

// Custom BigInt serializer
function stringifyWithBigInt(obj: any) {
  return JSON.stringify(
    obj,
    (key, value) => (typeof value === "bigint" ? value.toString() : value),
    2
  );
}
// const date = "2024-09-02T00:00:00Z";

const getOpStackProjects = async (): Promise<void> => {
  const opAddressS4 = "0xF6872D315CC2E1AfF6abae5dd814fd54755fE97C"; // Attester's address
  const endpoint = "https://optimism.easscan.org/graphql";

  // Specify the date filter (projects created on or after August 22, 2024)
  // const dateFilte1r = Math.floor(
  //   new Date("2024-08-22T00:00:00Z").getTime() / 1000
  // );
  // //for date after 26th august 21:32
  // const dateFilter = Math.floor(
  //   new Date("2024-08-26T21:32:00Z").getTime() / 1000
  // );

  //for 2nd sept 11:45
  // const dateFilter = Math.floor(
  //   new Date("2024-09-02T11:45:00Z").getTime() / 1000
  // );

  //for 4th sept 22:30
  // const dateFilter = Math.floor(
  //   new Date("2024-09-04T22:30:00Z").getTime() / 1000
  // );

  //for 5th sept 12:30
  const dateFilter = Math.floor(
    new Date("2024-09-05T12:30:00Z").getTime() / 1000
  );

  // Save the file in the same folder as `opStackProjects.ts`
  const outputFile = path.join(__dirname, "EASprojectsOpstack.json");

  let allMetadata = [];

  try {
    console.log("Attester Address:", opAddressS4);
    console.log("Endpoint:", endpoint);

    // Step 1: Fetch the initial attestations
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query Attestations($opAddressS4: String!, $dateFilter: Int!) {
            attestations(
              where: {
                schemaId: { equals: "0x88b62595c76fbcd261710d0930b5f1cc2e56758e155dea537f82bf0baadd9a32" },
                attester: { equals: $opAddressS4 },
                timeCreated: { gte: $dateFilter }
              }
            ) {
              id
              attester
              recipient
              refUID
              revocable
              data
              timeCreated
            }
          }
        `,
        variables: {
          opAddressS4,
          dateFilter,
        },
      }),
    });

    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Response Text:", errorText);
      throw new Error("Failed to fetch attestations");
    }

    const result = await response.json();

    if (!result.data) {
      console.error("No data returned from the GraphQL endpoint:", result);
      if (result.errors) {
        console.error("GraphQL Errors:", stringifyWithBigInt(result.errors));
      }
      throw new Error("No data returned from the GraphQL endpoint");
    }

    const { data } = result;

    // Initialize SchemaEncoder with the first schema definition
    const firstSchemaEncoder = new SchemaEncoder(
      "uint32 round, bytes32 projectRefUID, uint256 farcasterID, bytes32 metadataSnapshotRefUID"
    );

    const metadataSnapshotRefUIDs: { refUID: string; projectUID: string }[] =
      [];

    // Iterate through initial attestations and decode
    for (const [index, attestation] of data.attestations.entries()) {
      console.log(
        `Processing Attestation ${index + 1}: ID = ${attestation.id}`
      );

      let decodedData;
      let primaryProjectUid = "";

      try {
        decodedData = firstSchemaEncoder.decodeData(attestation.data);
        console.log(`Decoded data:`, stringifyWithBigInt(decodedData));

        const roundField = decodedData.find(
          (field: any) => field.name === "round"
        );

        // Check if round is 5
        const roundValue = Number(roundField?.value?.value);
        if (roundField && roundValue === 5) {
          const metadataSnapshotRefUIDField = decodedData.find(
            (field: any) => field.name === "metadataSnapshotRefUID"
          );
          const metadataSnapshotRefUID =
            metadataSnapshotRefUIDField?.value?.value;

          const projectRefUIDField = decodedData.find(
            (field: any) => field.name === "projectRefUID"
          );
          primaryProjectUid = String(projectRefUIDField?.value?.value || "");

          if (metadataSnapshotRefUID) {
            metadataSnapshotRefUIDs.push({
              refUID: String(metadataSnapshotRefUID),
              projectUID: primaryProjectUid,
            });
            console.log(
              `metadataSnapshotRefUID found: ${metadataSnapshotRefUID}`
            );
            console.log(`Primary Project UID: ${primaryProjectUid}`);
          }
        } else {
          console.log(
            `Round field is not 5 for Attestation ID ${attestation.id}`
          );
        }
      } catch (error) {
        console.error(
          `Failed to decode data for Attestation ID ${attestation.id}:`,
          error
        );
      }

      console.log("-------------------------");
    }

    console.log(
      `Total metadataSnapshotRefUIDs found: ${metadataSnapshotRefUIDs.length}`
    );

    // Step 2: Fetch new attestations using metadataSnapshotRefUIDs
    for (const {
      refUID: metadataSnapshotRefUID,
      projectUID: primaryProjectUid,
    } of metadataSnapshotRefUIDs) {
      console.log(
        `Fetching attestation for metadataSnapshotRefUID: ${metadataSnapshotRefUID}`
      );

      const secondQueryBody = {
        query: `
          query Attestations($metadataSnapshotRefUID: String!) {
            attestations(
              where: {
                id: { equals: $metadataSnapshotRefUID }
              }
            ) {
              id
              attester
              recipient
              refUID
              revocable
              data
              timeCreated
            }
          }
        `,
        variables: {
          metadataSnapshotRefUID,
        },
      };

      const metadataResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(secondQueryBody),
      });

      if (!metadataResponse.ok) {
        console.error(
          `HTTP Error on second query: ${metadataResponse.status} ${metadataResponse.statusText}`
        );
        continue;
      }

      const metadataResult = await metadataResponse.json();
      console.log(
        `Raw response from second query for metadataSnapshotRefUID ${metadataSnapshotRefUID}:`,
        stringifyWithBigInt(metadataResult)
      );

      if (
        !metadataResult.data ||
        metadataResult.data.attestations.length === 0
      ) {
        console.error(
          `No attestation found with the metadataSnapshotRefUID: ${metadataSnapshotRefUID}`
        );
        continue;
      }

      const metadataAttestation = metadataResult.data.attestations[0];

      // Initialize SchemaEncoder with the second schema definition
      const secondSchemaEncoder = new SchemaEncoder(
        "bytes32 projectRefUID, uint256 farcasterID, string name, string category, bytes32 parentProjectRefUID, uint8 metadataType, string metadataURL"
      );

      // Decode the fetched attestation's data
      let decodedMetadataData;
      try {
        decodedMetadataData = secondSchemaEncoder.decodeData(
          metadataAttestation.data
        );
        console.log(
          `Decoded data for fetched attestation ID ${metadataAttestation.id}:`,
          stringifyWithBigInt(decodedMetadataData)
        );

        // Extract metadataURL from the decoded data
        const metadataURLField = decodedMetadataData.find(
          (field: any) => field.name === "metadataURL"
        );
        const metadataURL = metadataURLField?.value?.value;

        let metadataContent = {};

        if (metadataURL && typeof metadataURL === "string") {
          let fetchUrl = metadataURL;
          // Only prepend IPFS gateway if the URL is an IPFS hash
          if (
            !metadataURL.startsWith("http://") &&
            !metadataURL.startsWith("https://")
          ) {
            fetchUrl = `https://ipfs.io/ipfs/${metadataURL}`;
          }
          console.log(`Fetching Content from URL: ${fetchUrl}`);

          try {
            // Fetch the content from the provided URL
            const metadataContentResponse = await fetch(fetchUrl);
            if (metadataContentResponse.ok) {
              metadataContent = await metadataContentResponse.json(); // Assuming JSON content
              console.log("Metadata Content:", metadataContent);

              // Add the fetched metadata to the allMetadata array
              allMetadata.push({
                projectUid: metadataAttestation.id,
                primaryprojectuid: primaryProjectUid, // Save the primaryProjectUid
                timeCreated: metadataAttestation.timeCreated,
                ...metadataContent,
              });
            } else {
              console.error(
                `Failed to fetch metadata content, status: ${metadataContentResponse.status}`
              );
            }
          } catch (fetchError) {
            console.error("Failed to fetch metadata content:", fetchError);
          }
        } else {
          console.error("metadataURL is not a valid string:", metadataURL);
        }
      } catch (error) {
        console.error(
          `Failed to decode fetched attestation data for ID ${metadataAttestation.id}:`,
          error
        );
      }

      console.log("-------------------------");
    }

    // Write the allMetadata array to the JSON file
    if (allMetadata.length > 0) {
      console.log(`Writing ${allMetadata.length} items to ${outputFile}`);
      await fs.writeFile(
        outputFile,
        JSON.stringify(allMetadata, null, 2),
        "utf8"
      );
      console.log(`Metadata saved to ${outputFile}`);
    } else {
      console.log("No metadata to write.");
    }
  } catch (error) {
    console.error("Error fetching attestations:", error);
    throw error;
  }
};

// // Usage example
getOpStackProjects()
  .then(() => console.log("Attestations fetched successfully"))
  .catch((error) => console.error("Caught error:", error));

//last queried 26th august 21:32
//last queried 2nd sept 11:45
//last queried 4th sept 22:30
//last queried 5th sept 12:30
//last queried 6th sept 11:30

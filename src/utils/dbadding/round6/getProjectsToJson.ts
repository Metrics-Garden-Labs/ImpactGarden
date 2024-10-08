import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

// Resolve the current directory similar to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom BigInt serializer
function stringifyWithBigInt(obj: any) {
  return JSON.stringify(
    obj,
    (key, value) => (typeof value === "bigint" ? value.toString() : value),
    2
  );
}

interface Attestation {
  id: string;
  attester: string;
  recipient: string;
  refUID: string;
  revocable: boolean;
  data: string;
  timeCreated: string;
}

const getOpStackProjects = async (): Promise<void> => {
  const attesterAddress = "0xF6872D315CC2E1AfF6abae5dd814fd54755fE97C";
  const endpoint = "https://optimism.easscan.org/graphql";
  const round6SchemaId =
    "0x2169b74bfcb5d10a6616bbc8931dc1c56f8d1c305319a9eeca77623a991d4b80";

  const dateFilter = Math.floor(
    new Date("2024-10-04T00:00:00Z").getTime() / 1000
  );
  // Date filter: projects created on or after 1st October 2024
  // const dateFilter = Math.floor(
  //   new Date("2024-10-01T00:00:00Z").getTime() / 1000
  // );

  // Output file path
  const outputFile = path.join(__dirname, "Round6Projects2.json");

  const allMetadata = [];

  try {
    console.log("Attester Address:", attesterAddress);
    console.log("Endpoint:", endpoint);

    // Step 1: Fetch the initial attestations
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query Attestations($attesterAddress: String!, $dateFilter: Int!) {
            attestations(
              where: {
                schemaId: { equals: "${round6SchemaId}" },
                attester: { equals: $attesterAddress },
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
          attesterAddress,
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

    // Initialize SchemaEncoder with the Round 6 schema definition
    const round6SchemaEncoder = new SchemaEncoder(
      "string round, uint256 farcasterID, bytes32 metadataSnapshotRefUID, uint8 metadataType, string metadataUrl"
    );

    // Initialize SchemaEncoder for the metadata attestation
    const secondSchemaEncoder = new SchemaEncoder(
      "bytes32 projectRefUID, uint256 farcasterID, string name, string category, bytes32 parentProjectRefUID, uint8 metadataType, string metadataUrl"
    );

    // Iterate through initial attestations and decode
    for (const [index, attestation] of data.attestations.entries()) {
      console.log(
        `Processing Attestation ${index + 1}: ID = ${attestation.id}`
      );

      try {
        const decodedData = round6SchemaEncoder.decodeData(attestation.data);
        console.log(`Decoded data:`, stringifyWithBigInt(decodedData));

        // Extract fields from decoded data
        const roundField = decodedData.find(
          (field: any) => field.name === "round"
        );
        const roundValue = roundField?.value?.value;

        // Check if attestation is for round "6"
        if (roundValue === "6") {
          const userFID = Number(
            decodedData.find((field: any) => field.name === "farcasterID")
              ?.value?.value
          );
          console.log(`User FID: ${userFID}`);

          const primaryProjectUid = attestation.refUID;
          console.log(`Primary Project UID: ${primaryProjectUid}`);

          const metadataSnapshotRefUIDField = decodedData.find(
            (field: any) => field.name === "metadataSnapshotRefUID"
          );
          const metadataSnapshotRefUID =
            metadataSnapshotRefUIDField?.value?.value;
          console.log(`Metadata Snapshot Ref UID: ${metadataSnapshotRefUID}`);

          const metadataUrlField = decodedData.find(
            (field: any) => field.name === "metadataUrl"
          );
          const metadataUrl = metadataUrlField?.value?.value;
          console.log(`Metadata URL: ${metadataUrl}`);

          // Ensure metadataUrl is a string before using it
          let metadataContent = {};
          if (metadataUrl && typeof metadataUrl === "string") {
            let fetchUrl = metadataUrl;

            // Only prepend IPFS gateway if the URL is an IPFS hash
            if (
              !metadataUrl.startsWith("http://") &&
              !metadataUrl.startsWith("https://")
            ) {
              fetchUrl = `https://ipfs.io/ipfs/${metadataUrl}`;
            }
            console.log(`Fetching Content from URL: ${fetchUrl}`);

            try {
              // Fetch the content from the provided URL
              const metadataContentResponse = await fetch(fetchUrl);
              if (metadataContentResponse.ok) {
                metadataContent = await metadataContentResponse.json(); // Assuming JSON content
                console.log("Metadata Content:", metadataContent);
              } else {
                console.error(
                  `Failed to fetch metadata content, status: ${metadataContentResponse.status}`
                );
              }
            } catch (fetchError) {
              console.error("Failed to fetch metadata content:", fetchError);
            }
          } else {
            console.error("metadataUrl is not a valid string:", metadataUrl);
          }

          // Fetch the metadata attestation using metadataSnapshotRefUID
          let projectName = "";
          let projectCategory = "";
          let projectMetadataUrl = "";
          let metadataSnapshotUID = "";
          let metadataContentProject = {};
          if (metadataSnapshotRefUID) {
            metadataSnapshotUID = metadataSnapshotRefUID.toString();
            const metadataResponse = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
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
              }),
            });

            if (!metadataResponse.ok) {
              console.error(
                "HTTP Error:",
                metadataResponse.status,
                metadataResponse.statusText
              );
              const errorText = await metadataResponse.text();
              console.error("Response Text:", errorText);
              throw new Error("Failed to fetch metadata attestation");
            }

            // After fetching the metadata attestation
            const metadataResult = await metadataResponse.json();

            // Check if the data and attestations array are present
            if (
              !metadataResult.data ||
              !metadataResult.data.attestations ||
              metadataResult.data.attestations.length === 0
            ) {
              console.error("No metadata attestation found:", metadataResult);
              if (metadataResult.errors) {
                console.error(
                  "GraphQL Errors:",
                  stringifyWithBigInt(metadataResult.errors)
                );
              }
              continue;
            }

            // Get the first (and only) attestation
            const metadataAttestation = metadataResult.data.attestations[0];

            try {
              const decodedMetadataData = secondSchemaEncoder.decodeData(
                metadataAttestation.data
              );
              console.log(
                `Decoded metadata data:`,
                stringifyWithBigInt(decodedMetadataData)
              );

              const projectNameField = decodedMetadataData.find(
                (field: any) => field.name === "name"
              );
              projectName = projectNameField?.value?.value as string;

              const categoryField = decodedMetadataData.find(
                (field: any) => field.name === "category"
              );
              projectCategory = categoryField?.value?.value as string;

              const projectMetadataUrlField = decodedMetadataData.find(
                (field: any) => field.name === "metadataUrl"
              );
              projectMetadataUrl = projectMetadataUrlField?.value
                ?.value as string;

              if (
                projectMetadataUrl &&
                typeof projectMetadataUrl === "string"
              ) {
                let fetchUrl = projectMetadataUrl;

                // Only prepend IPFS gateway if the URL is an IPFS hash
                if (
                  !projectMetadataUrl.startsWith("http://") &&
                  !projectMetadataUrl.startsWith("https://")
                ) {
                  fetchUrl = `https://ipfs.io/ipfs/${projectMetadataUrl}`;
                }
                console.log(`Fetching Content from URL: ${fetchUrl}`);

                try {
                  // Fetch the content from the provided URL
                  const metadataContentResponse = await fetch(fetchUrl);
                  if (metadataContentResponse.ok) {
                    metadataContentProject =
                      await metadataContentResponse.json(); // Assuming JSON content
                    console.log("Metadata Content:", metadataContentProject);
                  } else {
                    console.error(
                      `Failed to fetch metadata content, status: ${metadataContentResponse.status}`
                    );
                  }
                } catch (fetchError) {
                  console.error(
                    "Failed to fetch metadata content:",
                    fetchError
                  );
                }
              } else {
                console.error(
                  "metadataUrl is not a valid string:",
                  metadataUrl
                );
              }

              if (projectName) {
                // Do something with projectName if needed
                console.log(`Project Name: ${projectName}`);
              } else {
                1;
                console.error(
                  "Project Name is not a valid string:",
                  projectName
                );
              }
            } catch (error) {
              console.error(
                `Failed to decode metadata attestation data for ID ${metadataAttestation.id}:`,
                error
              );
            }
          } else {
            console.error("metadataSnapshotRefUID is not available");
          }

          // Add the fetched metadata to the allMetadata array, including projectName
          allMetadata.push({
            projectUid: attestation.id,
            primaryProjectUid: primaryProjectUid,
            metadataSnapshotUID: metadataSnapshotUID,
            timeCreated: attestation.timeCreated,
            projectName: projectName,
            projectCategory: projectCategory,
            userFid: userFID,
            ...metadataContentProject,
            ...metadataContent,
          });
        } else {
          console.log(`Attestation ID ${attestation.id} is not for round 6`);
        }
      } catch (error) {
        console.error(
          `Failed to decode data for Attestation ID ${attestation.id}:`,
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

// Usage example
getOpStackProjects()
  .then(() => console.log("Attestations fetched successfully"))
  .catch((error) => console.error("Caught error:", error));

//last time ran 4/10/2024 11:00am
//new run 08/10/2024 08:00am

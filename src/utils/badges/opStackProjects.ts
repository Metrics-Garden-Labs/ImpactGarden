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

export const getOpStackProjects = async (): Promise<void> => {
  const opAddressS4 = "0xF6872D315CC2E1AfF6abae5dd814fd54755fE97C"; // Attester's address
  const endpoint = "https://optimism.easscan.org/graphql";

  // Specify the date filter (projects created on or after August 22, 2024)
  const dateFilter = Math.floor(
    new Date("2024-08-22T00:00:00Z").getTime() / 1000
  );

  // Save the file in the same folder as `opStackProjects.ts`
  const outputFile = path.join(__dirname, "graphQLProjects2.json");

  let allMetadata = [];

  try {
    console.log("Attester Address:", opAddressS4);
    console.log("Endpoint:", endpoint);

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
                schemaId: { equals: "0xe035e3fe27a64c8d7291ae54c6e85676addcbc2d179224fe7fc1f7f05a8c6eac" },
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
        console.error(
          "GraphQL Errors:",
          JSON.stringify(result.errors, null, 2)
        );
      }
      throw new Error("No data returned from the GraphQL endpoint");
    }

    const { data } = result;

    // Initialize SchemaEncoder with your schema definition
    const schemaEncoder = new SchemaEncoder(
      "bytes32 projectRefUID, uint256 farcasterID, string name, string category, bytes32 parentProjectRefUID, uint8 metadataType, string metadataURL"
    );

    for (const [index, attestation] of data.attestations.entries()) {
      let decodedData;
      let primaryProjectUid = "";
      try {
        // Decode the data using the schema
        decodedData = schemaEncoder.decodeData(attestation.data);

        // Extract primaryprojectuid from the decoded data and convert it to a string
        const projectRefUIDField = decodedData.find(
          (field: any) => field.name === "projectRefUID"
        );
        primaryProjectUid = String(projectRefUIDField?.value?.value || "");
      } catch (error) {
        console.error("Failed to decode data:", error);
        decodedData = attestation.data; // Fall back to raw data if decoding fails
      }

      console.log(`Project ${index + 1}:`);
      console.log(`  ID: ${attestation.id}`);
      console.log(`  Attester: ${attestation.attester}`);
      console.log(`  Recipient: ${attestation.recipient}`);
      console.log(`  RefUID: ${attestation.refUID}`);
      console.log(`  Revocable: ${attestation.revocable}`);
      console.log(`  Time Created: ${attestation.timeCreated}`);
      console.log(`  Data (Decoded):`, decodedData);

      // Check for metadataURL in the decoded data
      const metadataURLField = decodedData.find(
        (field: any) => field.name === "metadataURL"
      );
      const metadataURL = metadataURLField?.value?.value;

      let metadataContent = {};

      if (metadataURL) {
        let fetchUrl = metadataURL;
        // Only prepend IPFS gateway if the URL is an IPFS hash
        if (
          !metadataURL.startsWith("http://") &&
          !metadataURL.startsWith("https://")
        ) {
          fetchUrl = `https://ipfs.io/ipfs/${metadataURL}`;
        }
        console.log(`  Fetching Content from URL: ${fetchUrl}`);

        try {
          // Fetch the content from the provided URL
          const metadataResponse = await fetch(fetchUrl);
          if (metadataResponse.ok) {
            metadataContent = await metadataResponse.json(); // Assuming JSON content
            console.log("  Metadata Content:", metadataContent);

            // Add the fetched metadata to the allMetadata array, including `projectUid`, `primaryprojectuid`, and `timeCreated`
            allMetadata.push({
              projectUid: attestation.id, // Use the attestation id as projectUid
              primaryprojectuid: primaryProjectUid,
              timeCreated: attestation.timeCreated, // Include the timeCreated field
              ...metadataContent,
            });
          } else {
            console.error(
              `Failed to fetch metadata content, status: ${metadataResponse.status}`
            );
          }
        } catch (fetchError) {
          console.error("Failed to fetch metadata content:", fetchError);
        }
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

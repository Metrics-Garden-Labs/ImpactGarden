//this is currently set up to only return the attestations that have an
//mgl  value in the schemas
//can change the specific values that we are searching for depending on the usecase.

export const getAttestationsByAttester = async (
  attesterAddress: string,
  endpoint: string
) => {
  console.log("Attester Address", attesterAddress);
  console.log("Endpoint yup", endpoint);

  if (!endpoint) {
    console.error("Invalid endpoint");
    return []; // Return an empty array or handle the error as needed
  }

  try {
    const query = `
          query Attestations($attester: String!) {
            attestations(where: { attester: { equals: $attester } 
            }) {
              id
              attester
              recipient
              decodedDataJson
            }
          }
        `;

    const variables = { attester: attesterAddress };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      // query: `
      //     query Attestations($attester: String!) {
      //       attestations(where: { attester: { equals: $attester } }) {
      //         id
      //         attester
      //         recipient
      //         refUID
      //         revocable
      //         data
      //       }
      //     }
      //   `,
      // variables: {
      //   attester: attesterAddress,
      // },
      // query: `
      //   query Attestations($attester: String!){
      //     attestations(where: {
      //       attester: { equals: $attester }
      //       decodedDataJson: {
      //          contains: "\"name\":\"MGL\",\"type\":\"bool\",\"value\":true"
      //        }
      //     }) {
      //       id
      //       attester
      //       recipient
      //       decodedDataJson
      //     }
      //   }
      // `,
      // variables: {
      //   attester: attesterAddress,
      // },
      // }),
    });

    if (!response.ok) {
      console.error(`Network response was not ok: ${response.status}`);
      return []; // Return an empty array if the response is not ok
    }

    const responseData = await response.json();
    console.log("Response Data", responseData);

    if (responseData.data && responseData.data.attestations) {
      const filteredAttestations = responseData.data.attestations.filter(
        (attestation: any) => {
          try {
            const decodedData = JSON.parse(attestation.decodedDataJson);
            return decodedData.some((item: any) => item.name === "MGL");
          } catch (error) {
            console.error("Error parsing decodedDataJson:", error);
            return false;
          }
        }
      );
      console.log("Filtered Attestations", filteredAttestations);
      return filteredAttestations;
    } else {
      console.error("Invalid response data", responseData);
      return []; // Return an empty array or handle the error as needed
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

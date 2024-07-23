export const getOptimismSeason4Participant = async (
  opAddressS4: string,
  address: string,
  endpoint: string
) => {
  try {
    console.log("opAddressS4", opAddressS4);
    console.log("address", address);
    console.log("endpoint", endpoint);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
                  query Attestations($opAddressS4: String!, $address: String!) {
                    attestations(where: {
                          schemaId: {equals: "0x401a80196f3805c57b00482ae2b575a9f270562b6b6de7711af9837f08fa0faf" },
                         attester: { equals: $opAddresss$ },
                        recipient: { equals: $address } 
                    }) {
                      id
                      attester
                      recipient
                      refUID
                      revocable
                      data
                    }
                  }
                `,
        variables: {
          opAddressS4,
          address,
        },
      }),
    });
    const { data } = await response.json();
    if (!response.ok) {
      console.error("GraphQL Error:");
      throw new Error("Failed to fetch attestations");
    }
    return data.attestations;
  } catch (error) {
    console.error("Error fetching attestations: ", error);
    throw error;
  }
};

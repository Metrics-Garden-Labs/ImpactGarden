export const getAttestationsByCoinbaseVerified = async (
  coinbaseAddress: string,
  address: string,
  endpoint: string
) => {
  try {
    console.log("coinbaseAddress", coinbaseAddress);
    console.log("address", address);
    console.log("endpoint", endpoint);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
              query Attestations($coinbaseAddress: String!, $address: String!) {
                attestations(where: {
                     attester: { equals: $coinbaseAddress },
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
          coinbaseAddress,
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

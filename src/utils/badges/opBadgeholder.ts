export const checkOpBadgeholder = async (
  OpAddress: string,
  address: string,
  endpoint1: string
) => {
  try {
    console.log("OpAddress", OpAddress);
    console.log("address", address);
    console.log("endpoint", endpoint1);
    const response = await fetch(endpoint1, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
            query Attestations($OpAddress: String!, $address: String!) {
              attestations(where: {
                attester: { equals: $OpAddress },
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
          OpAddress,
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

export const checkOpBadgeholder = async (
  badgeholderSchema: string,
  OpAddress: string,
  address: string,
  endpoint1: string
) => {
  try {
    console.log("OpAddress", OpAddress);
    console.log("address", address);
    console.log("endpoint", endpoint1);
    console.log("badgeholderSchema", badgeholderSchema);

    const response = await fetch(endpoint1, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
            query Attestations($badgeholderSchema: String!, $OpAddress: String!, $address: String!) {
              attestations(where: {
                schemaId: { equals: $badgeholderSchema}
                attester: { equals: $OpAddress },
                recipient: { equals: $address },
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
          badgeholderSchema,
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

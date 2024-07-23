export const getOptimismDelegateBadge = async (
  opAddress: string,
  address: string,
  endpoint: string
) => {
  try {
    console.log("coinbaseAddress", opAddress);
    console.log("address", address);
    console.log("endpoint", endpoint);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
                query Attestations($opAddress: String!, $address: String!) {
                  attestations(where: {
                        schemaId: { equals: "0xef874554718a2afc254b064e5ce9c58c9082fb9f770250499bf406fc112bd315"},
                       attester: { equals: $opAddress },
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
          opAddress,
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

//opaddress is
//0x621477dBA416E12df7FF0d48E14c4D20DC85D7D9

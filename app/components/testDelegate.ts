import { db } from "../../src/lib/db"; // Ensure this path is correct
import { op_delegates, user_addresses } from "../../src/lib/schema"; // Ensure this path is correct
import { eq } from "drizzle-orm";
import { getAddress } from "viem";

async function testOpDelegate(address: string) {
  const checkAddress = getAddress(address); // Normalize the address

  const isOpDelegate = await (async () => {
    const result = await db
      .select()
      .from(op_delegates)
      .where(eq(op_delegates.address, checkAddress))
      .limit(1);
    console.log("isOpDelegate", result.length > 0);
    return result.length > 0;
  })();
  console.log("isOpDelegate", isOpDelegate);

  if (isOpDelegate) {
    // Data to insert into user_addresses
    const newAddressData = {
      userfid: "11596", // Replace with actual fid
      ethaddress: checkAddress,
      addressorder: "first", // Update order logic if needed
      coinbaseverified: false, // Update with actual verification result
      opbadgeholder: true, // Update with actual badgeholder result
      powerbadgeholder: false, // Update with actual badgeholder result
      delegate: isOpDelegate,
      s4participant: false, // Update with actual participant result
    };

    await db.insert(user_addresses).values(newAddressData); // Insert data
    console.log("Inserted new address data:", newAddressData);
  }
}

// Test the specific address
const testAddress = "0xa565ea02caef7d1b6b5b919f3fcf829647ed50dd";
testOpDelegate(testAddress).catch(console.error); // Run the test function

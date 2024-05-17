This is the Impact Garden (Attestation module) lofi for Metrics Garden Labs!

## A Little Bit About the Project

1. **Login in with Farcaster:** The creation and authorisation of users is done using Sign in with Neynar. This is a very useful tool that allows us to verify Farcaster account of the user, make tailored search queries using their farcaster social graph and obtain their piblic farcaster information.

2. **Attestations:** Whenever a user submits a attestation, a contribution or attest to another users contribution this creates an attestation using the Ethereum Attestation Service (EAS) Standard.
   - Each attestation is delegated so the user does not pay for gas, we do using the Ethereum Attestation service function 'attestByDelegation'.
   - The schema for the Project Creatation is as follows: 0x6b4a2e50104d9b69e49c6a19a2054b78c7e87c9c924cba237ebbd5bb0a50a5c4
   - The schema for a projects contributions is as follows: 0xd13f3b9aa3f4e9ec3b70a76cd767fa64f4f7eb7a6a59e4b1e330d7dac6ec2ae9
   - The schema for users to attest to these contributions is as follows: 0x5f5afd9626d9d0cd46c7de120032c2470da00c4be9bcef1dd75fa8c074f17e70
  
Attestations are extremely powerful as they are made on chain. Using the EAS GraphQL API, anyone can query and get the information of an attestation and the other attestations that it references. It is not just available in this website. A link to the playground where you can visit to query these contributions for yourself is this: https://docs.attest.org/docs/developer-tools/api
  
3. **EigenTrust**
- To be completed. Implement an eigentrust ranking algorithm to rank projects and attestors based on thier trust rank within the ecosystem.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Nifty League Web

## Deployments

- main: [niftyleague.com](https://niftyleague.com)
- staging: [staging.niftyleague.com](https://staging.niftyleague.com)

## Info

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Set up environment variables

Copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
vercel env pull .env.local   # preferred: pulls from Vercel (source of truth)
# fallback: cp .env.example .env.local
```

### Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/pages/**/*`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn/foundations/about-nextjs) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_source=github.com&utm_medium=referral&utm_campaign=turborepo-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Environment Variables

Environment variables are managed in **Vercel** (source of truth). Sync them locally:

```bash
# Link this project to its Vercel project (one-time)
vercel link --scope niftyleague

# Pull all env vars into .env.local (gitignored)
vercel env pull .env.local
```

To push local changes back to Vercel:

```bash
vercel env push .env.local
# or set them per-environment (Production / Preview) in the Vercel dashboard
```

> Never commit `.env.local` — it is gitignored. For team projects use `vercel --scope niftyleague`.

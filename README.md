This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Setup .env

Copy `.enx.example` to `.env`, and follow the instructions in the file to fill up the variables.
```bash
cp .env.example .env
```

### Prepare your wallet
[Most of the wallets](https://explorer.walletconnect.com/?type=wallet) supported by WalletConnect should be available.

If you'd like a recommendation, then try [Metamask](https://metamask.io/) as your first step.

### Dev mode - Start dev server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Prod mode - Build the project

Run following command to build the project and start a local service:

```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
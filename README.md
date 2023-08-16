
# Account Abstraction Wallet App

An experimental multi-platform account abstracted wallet built using Expo.

## Run Locally

Clone the project

```bash
git clone https://github.com/redsteep/wallet-app
```

Go to the project directory

```bash
cd wallet-app
```

Make sure you've met following requirements:

- JDK 11
- Node 18.13.0
- npm 8.19

Install dependencies

```bash
npm install
```

Build and run the app

```bash
npm run -w app android # Run developments builds for Android, iOS and web
npm run -w app ios
npm run -w app web
npm run -w app chrome  # Build an unpacked Chrome extension, production bundle
```

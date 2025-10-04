# RELINK

A modern social web application built with Next.js and TypeScript.

---

## Table of Contents

* [About](#about)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Environment](#environment)
  * [Development](#development)
  * [Build & Production](#build--production)
  * [Linting & Formatting](#linting--formatting)
* [Project Structure](#project-structure)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## About

RELINK is a social application built with Next.js and TypeScript. It uses Tailwind CSS for styling and MongoDB (via Mongoose) for data persistence.

---

## Features

* Server-side rendering and static generation with Next.js
* TypeScript for type safety
* Tailwind CSS for utility-first styling
* MongoDB database using Mongoose
* Modular, scalable folder structure

---

## Tech Stack

* Next.js
* TypeScript
* React
* Tailwind CSS
* MongoDB with Mongoose
* ESLint & Prettier

---

## Getting Started

### Prerequisites

* Node.js v16 or newer
* npm, yarn, or pnpm
* MongoDB instance (local or hosted)

### Installation

```bash
git clone https://github.com/am-goku/RELINK-NEXTJS.git
cd RELINK-NEXTJS
npm install
```

### Environment

Create a `.env.local` file in the project root and add environment variables required by the project. Example:

```env
# Authentication
NEXTAUTH_SECRET=sample_secret_key
NEXTAUTH_URL=http://localhost:3000

# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=ws://localhost:3001

# MongoDB
MONGODB_URI=mongodb+srv://sample_user:sample_password@cluster0.mongodb.net/relink

# Cloudinary
CLOUDINARY_CLOUD_NAME=sample_cloud_name
CLOUDINARY_API_SECRET=sample_api_secret
CLOUDINARY_API_KEY=sample_api_key

# SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=sample_user@example.com
SMTP_PASS=sample_password
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build & Production

```bash
npm run build
npm start
```

### Linting & Formatting

```bash
npm run lint
npm run format
```

---

## Project Structure

```
.
├── .github/
├── public/
├── src/
│   ├── app/ or pages/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── models/         # Mongoose models
│   ├── styles/
│   └── utils/
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── .env.local (gitignored)
```

---

## Deployment

Recommended platforms:

* Vercel (recommended for Next.js)
* Netlify (when using static exports)
* Any Node.js host (Docker, DigitalOcean, AWS, etc.)

Before deploying, ensure environment variables (MONGODB_URI, NEXTAUTH_SECRET, etc.) are configured in the host.

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add feature"
4. Push: `git push origin feature/your-feature`
5. Open a pull request

---

## License

This project is shared publicly for demonstration purposes only. All rights reserved © Gokul Krishna.

---

## Contact

Gokul Krishna — [https://github.com/am-goku](https://github.com/am-goku)

Repository: [https://github.com/am-goku/RELINK-NEXTJS](https://github.com/am-goku/RELINK-NEXTJS)

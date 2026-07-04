# POS Frontend

This is the React web client for the Web POS demo project. It connects to the POS backend API and provides the main restaurant POS experience for staff/admin users.

## Purpose

- Main web POS interface
- Demo application for portfolio and job application presentation
- Works with the shared Node/Express backend API
- Has a companion Flutter mobile demo app in `pos-mobile`

## Tech Stack

- React
- Vite
- Redux Toolkit
- React Query
- React Router
- Axios
- Tailwind CSS
- Recharts

## Main Features

- Employee login and registration
- Protected POS pages
- Table overview and table management
- Menu and item management
- Order creation
- Order status updates
- Dashboard and sales overview

## Default API

For local development, create a local `.env` file:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Do not commit `.env` or real secrets.

In production builds, the app uses same-origin API paths. The Vercel rewrite config forwards `/api/*` requests to the deployed backend.

## Run

Install dependencies:

```powershell
npm install
```

Run in development mode:

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
```

Preview the production build:

```powershell
npm run preview
```

Run lint:

```powershell
npm run lint
```

## Local URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Note

This repository is the main web client for the Web POS demo project. The Flutter mobile app is only a demo client that reuses the same backend API.

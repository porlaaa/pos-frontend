# POS Frontend

This is the React web client for the Web POS demo project. It provides the main restaurant POS interface for staff and admin users.

## What It Is

The frontend is the primary web experience of the POS system. It connects to the backend API to manage restaurant tables, menus, items, orders, and dashboard data.

## How It Works

1. A staff member signs in from the web app.
2. The app keeps the authenticated session with the backend.
3. API calls are kept in `src/https`.
4. Pages use the API layer to load and update POS data.
5. Updated table and order states are shown in the interface.

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

## Note

This repository is the main web client for the Web POS demo project. Sensitive configuration and deployment values should be managed locally or through the hosting provider, not documented or committed to Git.

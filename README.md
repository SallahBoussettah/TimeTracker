# TimeTracker

A modern time tracking application built with React, TypeScript, and Shadcn/UI.

## Project Structure

```
TimerTracker/
├── frontend/         # React frontend application
│   ├── src/         # Source code
│   ├── public/      # Public assets
│   └── ...         # Configuration files
└── ...             # Future backend and other services
```

## Getting Started

### Frontend Development

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:8080`

## Features

- Modern UI with Shadcn/UI components
- Time tracking functionality
- Project management
- User profiles
- Detailed statistics and reports
- Responsive design

## Technologies

- React
- TypeScript
- Vite
- Shadcn/UI
- TailwindCSS
- React Router
- React Query

## Deployment to Netlify

This project is set up to be deployed directly to Netlify from GitHub. The frontend is located in the `frontend/` directory.

### Automatic Deployment via GitHub

1. Push your code to GitHub
2. Sign in to Netlify (https://app.netlify.com/)
3. Click "Add new site" > "Import an existing project"
4. Select your GitHub repository
5. Netlify will automatically detect the build settings from the `netlify.toml` file
6. Click "Deploy site"

### Environment Variables

Make sure to set up the following environment variables in Netlify's dashboard:

1. Go to Site settings > Build & deploy > Environment
2. Add the following variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Manual Deployment

If you prefer to deploy manually:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Netlify using Netlify CLI
npx netlify deploy --prod
```

## Local Development

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
``` 
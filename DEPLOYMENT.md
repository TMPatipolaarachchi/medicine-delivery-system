# Deployment Guide

## Backend

1. Push the repository to GitHub.
2. Create a MongoDB Atlas database and copy the connection string.
3. Create a Render Web Service from the repo.
4. Set the root directory to backend.
5. Use build command: npm install.
6. Use start command: npm start.
7. Add environment variables:
   - NODE_ENV=production
   - MONGO_URI=<your MongoDB URI>
   - JWT_SECRET=<strong secret>
   - CLIENT_URL=<your Vercel frontend URL>
8. Deploy and copy the Render service URL.

## Frontend

1. Create a Vercel project from the same GitHub repo.
2. Set the root directory to mobile.
3. Add environment variable:
   - EXPO_PUBLIC_API_BASE_URL=<your backend URL>/api
4. Vercel will use mobile/vercel.json.
5. Deploy.

## Notes

- This mobile app is deployed to Vercel as an Expo web build.
- If you want Android or iOS app store deployment, that is a different flow.
- If images are uploaded to backend disk storage, free hosting may not persist them reliably.

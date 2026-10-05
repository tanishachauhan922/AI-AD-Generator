# AI Advertisement Creative Studio

A MERN-based AI Advertisement Creative Studio for creating, managing, and analyzing marketing creatives.

## Features

- AI-powered advertisement generation
- Image ad generation
- Video ad generation
- Creative templates
- Project management
- AI Creative Critic
- User authentication
- Brand Kit management

## Tech Stack

- React
- Node.js
- Express.js
- MongoDB
- Tailwind CSS
- Cloudinary
- Cloudflare AI APIs
- Magic Hour

## Project Structure

```text
AI-AD Generator/
├── BACKEND/
└── src/
```

## Deploy the backend to Render

This repository includes a Render Blueprint in [`render.yaml`](./render.yaml).

1. Push the repository to GitHub and create a Render Blueprint from that repository.
2. In Render, provide the `URI` MongoDB connection string and a strong, unique `JWT_SECRET` when prompted. The API will not start without `URI`.
3. In MongoDB Atlas, allow connections from Render in **Network Access**. Render's outbound IP addresses can vary; for a small deployment, Atlas may require `0.0.0.0/0`. Use a database user with a strong password and least-privilege access.
4. After the service deploys, open its `https://...onrender.com/` URL. It should return `working`.
5. Set `VITE_API_URL` in the frontend host to the backend's public URL (for example, `https://ai-ad-generator-api.onrender.com`, with no trailing slash), then rebuild/redeploy the frontend. Without this, the frontend falls back to `http://localhost:5000`.

Add these backend environment variables in Render if you use their associated features:

| Variable | Feature |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` | AI ad generation and creative critique |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image uploads |
| `GEMINI_API_KEY` | Gemini-backed features |
| `MAGIC_HOUR_API_KEY` | Video generation |
| `RESEND_API_KEY` | Verification email delivery |
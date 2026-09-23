/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The UI and the API live in this same project, so all requests are
  // same-origin. There is no CORS configuration and no API URL to set.
  // Vercel detects Next.js automatically - no vercel.json is required.
};

module.exports = nextConfig;

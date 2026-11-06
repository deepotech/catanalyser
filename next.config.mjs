/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/compare/norwegian-forest-cat-vs-maine-coon",
        destination: "/compare/maine-coon-vs-norwegian-forest-cat",
        statusCode: 301,
      },
      {
        source: "/compare/ragdoll-vs-maine-coon",
        destination: "/compare/maine-coon-vs-ragdoll",
        statusCode: 301,
      },
      {
        source: "/compare/ragdoll-vs-siamese",
        destination: "/compare/siamese-vs-ragdoll",
        statusCode: 301,
      },
      {
        source: "/compare/persian-vs-british-shorthair",
        destination: "/compare/british-shorthair-vs-persian",
        statusCode: 301,
      },
      {
        source: "/compare/abyssinian-vs-bengal",
        destination: "/compare/bengal-vs-abyssinian",
        statusCode: 301,
      },
      {
        source: "/compare/birman-vs-ragdoll",
        destination: "/compare/ragdoll-vs-birman",
        statusCode: 301,
      },
      {
        source: "/compare/devon-rex-vs-sphynx",
        destination: "/compare/sphynx-vs-devon-rex",
        statusCode: 301,
      },
      {
        source: "/compare/british-shorthair-vs-russian-blue",
        destination: "/compare/russian-blue-vs-british-shorthair",
        statusCode: 301,
      },
      {
        source: "/compare/exotic-shorthair-vs-persian",
        destination: "/compare/persian-vs-exotic-shorthair",
        statusCode: 301,
      },
      {
        source: "/compare/british-shorthair-vs-scottish-fold",
        destination: "/compare/scottish-fold-vs-british-shorthair",
        statusCode: 301,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https://images.unsplash.com https://upload.wikimedia.org",
              "media-src 'self' blob: data:",
              "connect-src 'self' https://generativelanguage.googleapis.com https://openrouter.ai",
              "font-src 'self' data:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

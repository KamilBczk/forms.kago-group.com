import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Appliquer ces headers à toutes les routes
        source: '/:path*',
        headers: [
          {
            // Empêche le clickjacking
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Empêche le MIME sniffing
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Protection XSS pour les navigateurs anciens
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            // Politique de referrer
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // Content Security Policy
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://umami.kago-group.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://umami.kago-group.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            // Permissions Policy (anciennement Feature-Policy)
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

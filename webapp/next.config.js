/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true },
  output: 'export',
  distDir: process.env.NODE_ENV === 'development' ? undefined : '../web-build',
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.(mp4|mp3)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next',
          name: 'static/media/[name].[hash].[ext]',
        },
      },
    })
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [path.resolve(__dirname, '../common')],
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    })
    return config
  },
}

const intercept = require('intercept-stdout')

// safely ignore recoil warning messages in dev (triggered by HMR)
function interceptStdout(text) {
  if (text.includes('Duplicate atom key')) {
    return ''
  }
  return text
}

if (process.env.NODE_ENV === 'development') {
  intercept(interceptStdout)
}

const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV !== 'production',
  dest: 'public',
})

module.exports = withPWA({ ...nextConfig })

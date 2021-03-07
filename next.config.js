const ghPages = process.env.DEPLOY_TARGET === 'gh-pages';

// next.config.js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})
module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'mdx'],
})

module.exports.assetPrefix = ghPages ? '/cselig.github.io/' : ''

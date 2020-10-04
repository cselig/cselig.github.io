module.exports = {
  siteMetadata: {
    title: `Christian Selig`,
    description: ``,
    author: `@cselig`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content/blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `./content/projects`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `./src/images`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-music',
            options: {
              // Add any abcjs options from https://github.com/paulrosen/abcjs here
              // plus a custom "color" option that allows you to set the color of the music sheet.
              // e.g. to use CSS variables:
              // color: 'var(--text-color)',
            },
          },
        ],
      },
    },
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1035,
              sizeByPixelDensity: true,
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-165266147-1"
      },
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'material icons'
        ],
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
  ],
}

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
        name: `images`,
        path: `./src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `./src`
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
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
          'material icons',
          'material icons outlined'
        ],
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
  ],
}

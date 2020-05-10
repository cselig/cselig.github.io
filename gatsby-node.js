const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const fs = require("fs")

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const fileNode = getNode(node.parent)
    const slug = fileNode.dir.split("/").pop().replace(/_/g, "-")
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  } else if (node.internal.type === `Mdx`) {
    const fileNode = getNode(node.parent)
    const slug = fileNode.dir.split("/").pop().replace(/_/g, "-")
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  } else if (node.internal.type === `File`) {
    fs.readFile(node.absolutePath, undefined, (_err, buf) => {
      createNodeField({ node, name: `contents`, value: buf.toString()})
    });
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const mdx_posts = await graphql(`
    query {
      allMdx {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  mdx_posts.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/blog_post.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
      },
    })
  })
}

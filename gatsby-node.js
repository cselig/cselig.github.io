const path = require(`path`)
const fs = require("fs")

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
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

// packages shouldn't use fs, which only exists server-side.
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: 'empty'
    }
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const posts = await graphql(`
    query {
      allMdx {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              draft
            }
          }
        }
      }
    }
  `)

  posts.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: `${node.frontmatter.draft ? "draft" : "blog"}/${node.fields.slug}`,
      component: path.resolve(`./src/templates/post.js`),
      context: {
        slug: node.fields.slug,
      },
    })
  })
}

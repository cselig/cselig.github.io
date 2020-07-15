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
      allMarkdownRemark {
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

  const post_types = [
    {
      posts: posts.data.allMdx.edges,
      template: 'mdx_post.js',
    },
    {
      posts: posts.data.allMarkdownRemark.edges,
      template: 'md_post.js',
    },
  ]

  for (const { posts, template } of post_types) {
    posts.forEach(({ node }) => {
      createPage({
        path: `${node.frontmatter.draft ? "draft" : "blog"}/${node.fields.slug}`,
        component: path.resolve(`./src/templates/${template}`),
        context: {
          slug: node.fields.slug,
        },
      })
    })
  }
}

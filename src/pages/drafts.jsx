import React from "react";
import { Link, graphql } from "gatsby"

import BaseLayout from "../components/base_layout"

function Drafts({ data }) {
  const drafts = data.allMdx.edges.filter(({ node }) => node.frontmatter.draft)
  return (
    <BaseLayout>
      <div style={{textAlign: 'center'}}>
      <h1>Drafts</h1>
      {
        drafts.map(({ node }) => (
          <Link to={`/drafts/${node.fields.slug}`} key={node.id}>
            <p>{`${node.frontmatter.title} (${node.frontmatter.date})`}</p>
          </Link>
        ))
      }
      </div>
    </BaseLayout>
  )
}

export default Drafts

export const query = graphql`
  query {
    allMdx {
      edges {
        node {
          fields {
            slug
          }
          id
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
            draft
          }
        }
      }
    }
  }
`
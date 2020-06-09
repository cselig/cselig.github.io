import React from "react"
import { Link, graphql } from "gatsby"

import BaseLayout from "../components/base_layout"
import SocialLinks from "../components/social_links"

import "../css/main.scss"

const BlogSection = ({ data }) => {
  return (
      <div className="section" id="blog">
        <h2 className="section-header">Blog</h2>
        <hr/>
        <div className="posts-container">
          {data.edges.map(({ node }) => (
            <div className="post" key={node.id}>
              <div className="title-container">
                <Link to={`/${node.fields.slug}`} className="title-link">
                  <h3>{node.frontmatter.title}</h3>
                </Link>
                <p className="date">{node.frontmatter.date}</p>
              </div>
              <p className="excerpt">{node.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
  )
}

const ProjectsSection = ({ data }) => {
  return (
    <div className="section" id="projects">
      <h2 className="section-header">Projects</h2>
      <hr/>
      <div className="posts-container">
        {data.nodes.map(node => (
          <div className="post" key={node.id}>
            <div className="title-container">
              <a href={node.github_link} className="title-link" target="_blank" rel="noopener noreferrer">
                <h3>{node.title}</h3>
              </a>
              <div className="tech-badges">
                {node.technologies.map(tech => <p className="tech-badge" key={tech}>{tech}</p>)}
              </div>
            </div>
            <p className="excerpt">{node.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const IndexPage = ({ data }) => {
  return (
    <BaseLayout>
      <div id="index">
        <div className="greeting">
          <h1 className="title">Christian Selig</h1>
          <p className="about">Hi! I'm a software engineer based in the Bay Area.</p>
        </div>
        <BlogSection data={data.allMdx}/>
        <ProjectsSection data={data.allProjectsYaml}/>
        <SocialLinks size="64"/>
      </div>
    </BaseLayout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    allMdx(sort: {fields: frontmatter___date, order: DESC}) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          id
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
          }
          excerpt
        }
      }
    }
    allProjectsYaml {
      nodes {
        id
        title
        github_link
        technologies
        description
      }
    }
  }
`
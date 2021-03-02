import Layout from '../components/layout'

import styles from '../styles/about.module.scss'

export default function About() {
  return (
    <Layout>
      <h1 className={styles.title}>About</h1>
      <p>
        My name is Christian Selig and I'm a software engineer based in the Bay Area.
      </p>
      <p>
        I currently work for Cisco on <a href="https://www.cisco.com/c/dam/en/us/solutions/collaboration/people-insights-whitepaper.pdf">People Insights</a>
        {' '}using technologies such as Rails, Postgres, Redis, C++, React, and ClojureScript.
      </p>
      <p>
        Previously I worked for a data science consultancy called Cascade Data Labs doing data analysis, engineering, and modeling using technologies such as
        Python, SQL, Spark, Tableau, and Airflow.
      </p>
      <p>
        I've done a little bit of open source development for a Python data quality library
        called Great Expectations - you can read about my contributions <a href="https://greatexpectations.io/blog/great-expectations-now-supports-executions-in-spark-a-blog-with-much-clapping/">here</a>.
      </p>
      <p>
        I'm also a very active cellist and I enjoy playing orchestral and chamber music (and attending summer music festivals
        when I get the chance).
      </p>
    </Layout>
  )
}

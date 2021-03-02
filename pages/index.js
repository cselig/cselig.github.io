import Link from 'next/link'
import Layout from '../components/layout'
import { getAllSketchData } from '../lib/sketches'

import styles from '../styles/index.module.scss'

export default function Home({ allSketchData }) {
  return (
    <Layout home>
      <main>
        <h1 className={styles.title}>
          Code Sketches
        </h1>

        <div className={styles.description}>
          <p>
            Hi, my name is Christian.
            You can learn more about me <Link href="/about">here</Link>.
          </p>
          <p>
            This is my collection of code sketches: bite-sized visualizations,{' '}
            puzzles, prototypes, explorations, and generally anything I find interesting.
          </p>
          <p>
            I hope you enjoy!
          </p>
        </div>

        <div className={styles.sketches}>
          {allSketchData.map(s => (
            <Link href={`/sketches/${s.id}`} key={s.id}>
              <a className={styles.sketch} >
                <p className={styles.sketch_date}>{s.date}</p>
                <h2 className={styles.sketch_title}>{s.title}</h2>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps() {
  const allSketchData = await getAllSketchData()
  return {
    props: {
      allSketchData
    }
  }
}

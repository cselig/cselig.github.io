import Head from 'next/head'
import Link from 'next/link'

import { getAllSketchIds } from '../lib/sketches'

export default function Home({ allSketchIds }) {
  return (
    <div className="container">
      <Head>
        <title>Christian's Code Sketches</title>
        {/* TODO: favicon */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main>
        <h1 className="title">
          Christian's Code Sketches
        </h1>

        <p className="description">
          description here
        </p>

        <div>
          <h2>Sketches</h2>
          <div>
            {allSketchIds.map(({ params: { id } }) => (
              <div key={id}>
                <Link href={`/sketches/${id}`}>
                  <a>{id}</a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const allSketchIds = getAllSketchIds()
  return {
    props: {
      allSketchIds
    }
  }
}
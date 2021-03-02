import { ArrowBack } from '@material-ui/icons'
import Link from 'next/link'
import Head from 'next/head'

import styles from '../styles/layout.module.scss'

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>cselig</title>
        <link rel="icon" href="favicon.ico" />
      </Head>
      {!home &&
        <Link href="/" >
          <ArrowBack className={styles.back_button} />
        </Link>
      }
      <>{children}</>
    </div>
  )
}

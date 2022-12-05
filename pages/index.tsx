import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Resumes from '../components/Resumes';

import { PlusIcon} from '@heroicons/react/24/solid'

import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  const addResume = () => {
    router.push('/resume/create')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>CV Creator</title>
        <meta name="description" content="CV Creator" />
      </Head>

      <main className={styles.main}>
        <div className="d-flex">
          <h1 className={styles.header}>
            Welcome to the CV Creator
          </h1>
          <div className={styles.addButtonMain} onClick={addResume}>
            <PlusIcon />
          </div>
        </div>
        
        <Resumes />
      </main>
    </div>
  )
}

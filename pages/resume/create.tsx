import Head from 'next/head'
import styles from '../../styles/Home.module.css'

import { useRouter } from 'next/router'

import { useMutation } from '@apollo/client';

import { CREATE_RESUME } from '../../graphql';

import ResumeForm from '../../components/ResumeForm';

import { Resume } from '../../interfaces';

export default function id () {
  const router = useRouter()

  const [createResume] = useMutation(CREATE_RESUME);

  const onUpdateResume = (r: Resume) => {
    createResume({
      variables: {
        payload: r
      },
    })
      .then(async ({ data }) => {
        router.back();
      })
      .catch((e) => {});
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>CV Creator</title>
        <meta name="description" content="CV Creator" />
      </Head>
      <main className={styles.resume}>
        <h1 className={styles.resumeHeader}>
          Create Resume
        </h1>
        <ResumeForm onSubmit={onUpdateResume}/>    
      </main>
    </div>
  )
}


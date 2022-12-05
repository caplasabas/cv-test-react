import Head from 'next/head'
import styles from '../../styles/Home.module.css'

import { useState } from "react";

import { useRouter } from 'next/router'

import { useQuery, useMutation } from '@apollo/client';

import { GET_RESUME, UPDATE_RESUME } from '../../graphql';

import ResumeForm from '../../components/ResumeForm';

import { Resume } from '../../interfaces';

import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import { CheckIcon } from '@heroicons/react/24/solid'

export default function id () {
  const router = useRouter()

  const { id } = router.query;

  const [resume, setResume] = useState(null);

  const [showToast, setShowToast] = useState(false);

  const [updateResume] = useMutation(UPDATE_RESUME);

  const onUpdateResume = (r: Resume) => {
    const payload = {
      id: id,
      payload: r
    }

    updateResume({
      variables: payload,
    })
      .then(async ({ data }) => {
        setResume(data.updateResume);
        setShowToast(true);
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
          Update Resume
        </h1>
        <ResumeForm onSubmit={onUpdateResume}/>    
        <ToastContainer className='my-5 mx-5' position={'top-end'}>
          <Toast show={showToast} delay={2000} autohide onClose={() => setShowToast(false)}>
            <Toast.Body> <CheckIcon className={styles.checkIcon}/> Resume has been updated</Toast.Body>
          </Toast>
        </ToastContainer>
      </main>
    </div>
  )
}


import styles from "../styles/Home.module.css";

import { useQuery } from '@apollo/client';

import { GET_RESUMES } from '../graphql';

import { useState, useEffect } from "react";

import { Resume } from '../interfaces'

import { CldImage } from 'next-cloudinary';

import { XMarkIcon} from '@heroicons/react/24/solid'

import { useRouter } from 'next/router'

const _ = require('lodash');

import { useMutation } from '@apollo/client';

import { DELETE_RESUME } from '../graphql';

import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import { CheckIcon } from '@heroicons/react/24/solid'

export default function Countries() {
  const router = useRouter()

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resumes, setResumes] = useState([]);

  const [showToast, setShowToast] = useState(false);

  const [deleteResume] = useMutation(DELETE_RESUME);

  const {refetch: refetchResumes } = useQuery(GET_RESUMES, {
    onCompleted: ({ resumes }) => {
      if (typeof resumes !== 'undefined') {
        setResumes(resumes);
      }
      setError('')
      setLoading(false);
    },
    onError: ({ graphQLErrors, networkError }) => {
      console.log(graphQLErrors);
      console.log(networkError);
      setError('Error')
      setLoading(false);
    },
  });

  useEffect(() => {
    refetchResumes();
  }, [])
  

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error != '') {
    console.error(error);
    return null;
  }

  const onDeleteResume = ( e: React.MouseEvent<HTMLElement>, id: number | undefined) => {
    e.stopPropagation(); 

    deleteResume({
      variables: {
        deleteResumeId: id
      },
    })
      .then(async ({ data }) => {
        const newResumes = _.cloneDeep(resumes);
        setResumes(newResumes.filter((r: Resume) => r.id != id))
        setShowToast(true);
      })
      .catch((e) => {});
  }

  const viewResume = (id: number | undefined) => {
    router.push(`/resume/${id}`);
  }
  return (
    <div className={styles.grid}>
      {resumes.map((resume: Resume, key: number) => (
        <div onClick={() => viewResume(resume.id)}>
          <div key={resume.id} className={styles.card}>
            <div className={styles.cardRemoveContainer} onClick={(e:  React.MouseEvent<HTMLElement>) => onDeleteResume(e, resume.id)}>
              <div className={styles.removeButtonMain}>
                <XMarkIcon className={styles.RemoveButtonIcon}/>
              </div>
            </div>
            {resume.profilePic &&
              <CldImage
                width="250"
                height="250"
                src={resume.profilePic}
                alt={resume.fullName}
              />
            }
            <h3 className={styles.title}>{resume.fullName}</h3>
            <p className={styles.description}>
              {resume.address}
            </p>
          </div>
        </div>
      ))}
      <ToastContainer className='my-5 mx-5' position={'top-end'}>
        <Toast show={showToast} delay={2000} autohide onClose={() => setShowToast(false)}>
          <Toast.Body> <CheckIcon className={styles.checkIcon}/> Resume has been deleted</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useState, useEffect } from "react";

import { useRouter } from 'next/router'

import { useQuery } from '@apollo/client';

import { GET_RESUME } from '../graphql';

import { Resume, Experience, Education } from '../interfaces'

const _ = require('lodash');

import { PlusIcon, XMarkIcon, UserIcon} from '@heroicons/react/24/solid'

type Props = {
  onSubmit: (e: Resume) => void
}

import { CldImage, CldUploadWidget } from 'next-cloudinary';

export default function ResumeForm (props: Props) {
  const router = useRouter()

  const { id } = router.query;
  const { onSubmit } = props;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [skip, setSkip] = useState(true);

  const [profilePic, setProfilePic] = useState('');
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [education, setEducation] = useState<Education[]>([]);

  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    if (typeof id !== 'undefined' && id) {
      setSkip(false);
    }
  }, [id])
  
  useQuery(GET_RESUME, {
    variables: { resumeId: id },
    onCompleted: ({ resume }) => {
      if (typeof resume !== 'undefined') {
        setProfilePic(resume.profilePic);
        setFullName(resume.fullName);
        setPosition(resume.position);
        setAddress(resume.address)
        setContact(resume.contact)
        setEducation(resume.education);
        setExperiences(resume.experiences);
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
    skip: skip,
  });

  const onUpdateResume = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const payload = {
      profilePic: profilePic,
      fullName: fullName,
      address: address,
      position: position,
      contact: contact,
      experience: experiences.map((e: Experience) => _.omit(e, '__typename')),
      education: education.map((e: Education) => _.omit(e, '__typename'))
    }

    onSubmit(payload);
  }

  const experienceChangeHandler = (index: number, e: React.FormEvent<HTMLInputElement>) => {
    let newExperiences = _.cloneDeep(experiences);
    newExperiences[index][e.currentTarget.name] = e.currentTarget.value;
    setExperiences(newExperiences);
  }

  const addExperience = () => {
    setExperiences([...experiences, {
      companyName: '',
      yearStart: '',
      yearEnd: '',
      position: ''
    }]);
  }

  const removeExperience  = (key: number) => {
    setExperiences(experiences.filter((e, e_key) => key != e_key));
  };

  const educationChangeHandler = (index: number, e: React.FormEvent<HTMLInputElement>) => {
    let newEducation = _.cloneDeep(education);
    newEducation[index][e.currentTarget.name] = e.currentTarget.value;
    setEducation(newEducation);
  }

  const removeEducation  = (key: number) => {
    setEducation(education.filter((e, e_key) => key != e_key));
  };

  const addEducation = () => {
    setEducation([...education, {
      schoolName: '',
      yearStart: '',
      yearEnd: '',
      course: ''
    }]);
  }

  const onImageUpload = (_: any, result: any) => {
    if (result.event === 'success') {
      setProfilePic(result.info.secure_url);
    }
  }
  
  return (
    <div className={styles.resumeFormContainer}>
      <form
        onSubmit={onUpdateResume}
      >
        <CldUploadWidget uploadPreset="z4ieehv1" onUpload={onImageUpload}>
          {({ open } : any) => {
            const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault();
              open();
            }
            return (
              <div className={styles.profileContainer}>
                <div className={styles.profileInner} onClick={handleOnClick} >
                  {profilePic && profilePic != '' ? (
                    <CldImage
                      width="230"
                      height="230"
                      src={profilePic}
                      alt={fullName}
                      className={styles.profilePic}
                    />
                  ) : (
                    <UserIcon />
                  )}
                </div>
              </div>
            );
          }}
        </CldUploadWidget>
    
        <div className="form-group my-3">
          <label>Full Name:</label>
          <input
            type="input"
            className="form-control"
            required
            value={fullName}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setFullName(e.currentTarget.value)}
          />
        </div>
        <div className="form-group my-3">
          <label>Position:</label>
          <input
            type="input"
            className="form-control"
            required
            value={position}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setPosition(e.currentTarget.value)}
          />
        </div>
        <div className="form-group my-3">
          <label>Address:</label>
          <input
            type="input"
            className="form-control" 
            required
            value={address}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setAddress(e.currentTarget.value)}
          />
        </div>
        <div className="form-group my-3">
          <label>Contact:</label>
          <input
            type="number"
            maxLength={11}
            minLength={11}
            className="form-control"
            value={contact}
            required
            onChange={(e: React.FormEvent<HTMLInputElement>) => setContact(e.currentTarget.value)}
          />
        </div>

        <div className="my-5 d-flex" onClick={addExperience}>
          <h2 className={styles.formHeader}>
            Experience 
          </h2>
          <div className={styles.addButton}>
            <PlusIcon className={styles.addButtonIcon}/>
          </div>
        </div>

        <div className='experience-container'>
          {experiences.map((experience, key) => {
            return (
              <div key={key} className="row my-3">
                <div className="row">
                  <div className='col-sm-7 col-xs-7'>
                    <input
                      type="input"
                      className="form-control"
                      placeholder='Company Name'
                      name='companyName'
                      value={experience.companyName}
                      required
                      onChange={(e: React.FormEvent<HTMLInputElement>) => experienceChangeHandler(key, e)}
                    />
                  </div>
                  <div className='col-sm-2 col-xs-2'>
                    <input
                      type="number"
                      maxLength={4}
                      minLength={4}
                      className="form-control"
                      placeholder='Year Start'
                      name='yearStart'
                      value={experience.yearStart}
                      required
                      onChange={(e: React.FormEvent<HTMLInputElement>) => experienceChangeHandler(key, e)}
                    />
                  </div>
                  <div className='col-sm-2 col-xs-2'>
                    <input
                      type="number"
                      maxLength={4}
                      minLength={4}
                      className="form-control"
                      placeholder='Year End'
                      name='yearEnd'
                      value={experience.yearEnd}
                      required
                      onChange={(e: React.FormEvent<HTMLInputElement>) => experienceChangeHandler(key, e)}
                    />
                  </div>
                  <div className='col-sm-1 col-xs-1' onClick={() => removeExperience(key)}>
                    <div className={styles.removeButton}>
                      <XMarkIcon className={styles.RemoveButtonIcon}/></div>
                  </div>
                </div>
                <div className="row my-3">
                  <div className='col-sm-6 col-xs-6'>
                    <input
                      type="input"
                      className="form-control"
                      name='position'
                      placeholder='Position'
                      value={experience.position}
                      required
                      onChange={(e: React.FormEvent<HTMLInputElement>) => experienceChangeHandler(key, e)}
                    />
                  </div>
                </div>
              </div>  
            );
          })}
          {experiences.length == 0 && (
            <div>
              <p>No Experience</p>
            </div>
          )}
        </div>

        <div className="my-5 d-flex" onClick={addEducation}>
          <h2 className={styles.formHeader}>
            Education 
          </h2>
          <div className={styles.addButton}>
            <PlusIcon className={styles.addButtonIcon}/>
          </div>
        </div>

        <div className='education-container'>
          {education.map((education, key) => {
            return (
              <div key={key} className="row my-3">
                <div className="row">
                  <div className='col-sm-7 col-xs-7'>
                    <input
                      type="input"
                      className="form-control"
                      placeholder='School Name'
                      name='schoolName'
                      defaultValue={education.schoolName}
                      required
                      onChange={(e: React.FormEvent<HTMLInputElement>) => educationChangeHandler(key, e)}
                    />
                  </div>
                  <div className='col-sm-2 col-xs-2'>
                    <input
                      type="number"
                      max={9999}
                      min={1900}
                      maxLength={4}
                      minLength={4}
                      className="form-control"
                      placeholder='Year Start'
                      name='yearStart'
                      defaultValue={education.yearStart}
                      required
                      onChange={(e: React.FormEvent<HTMLInputElement>) => educationChangeHandler(key, e)}
                    />
                  </div>
                  <div className='col-sm-2 col-xs-2'>
                    <input
                      type="number"
                      max={9999}
                      min={1900}
                      maxLength={4}
                      minLength={4}
                      className="form-control"
                      placeholder='Year End'
                      name='yearEnd'
                      defaultValue={education.yearEnd}
                      required
                      onChange={(e: React.FormEvent<HTMLInputElement>) => educationChangeHandler(key, e)}
                    />
                  </div>
                  <div className='col-sm-1 col-xs-1' onClick={() => removeEducation(key)}>
                    <div className={styles.removeButton}>
                      <XMarkIcon className={styles.RemoveButtonIcon}/></div>
                  </div>
                </div>
                <div className="row my-3">
                  <div className='col-sm-6 col-xs-6'>
                    <input
                      type="input"
                      className="form-control"
                      placeholder='Course'
                      name='course'
                      defaultValue={education.course}
                      required
                      onChange={(e: React.FormEvent<HTMLInputElement>) => educationChangeHandler(key, e)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {education.length == 0 && (
            <div>
              <p>No Education</p>
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary my-5">Submit</button>
      </form>     
    </div>        
  )
}


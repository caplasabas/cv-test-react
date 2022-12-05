import gql from 'graphql-tag';

export const GET_RESUMES = gql`
  query Resumes {
    resumes {
      id
      profilePic
      fullName
      createdAt
    }
  }

`;

export const GET_RESUME = gql`
  query Resume($resumeId: ID!) {
    resume(id: $resumeId) {
      address
      contact
      fullName
      position
      id
      education {
        schoolName
        course
        yearStart
        yearEnd
      }
      experiences {
        companyName
        position
        yearStart
        yearEnd
      }
    }
  }
`;

export const CREATE_RESUME = gql`
  mutation CreateResume($payload: CreateResumeInput!) {
    createResume(payload: $payload) {
      id
      fullName
      address
      contact
      education {
        schoolName
        course
        yearEnd
        yearStart
      }
      experiences {
        id
        resumeId
        companyName
        position
        yearStart
        yearEnd
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_RESUME = gql`
  mutation UpdateResume($id: ID!, $payload: UpdateResumeInput!) {
    updateResume(id: $id, payload: $payload) {
      address
      contact
      fullName
      id
      experiences {
        id
        resumeId
        companyName
        position
        yearStart
        yearEnd
        createdAt
        updatedAt
      }
      education {
        id
        resumeId
        schoolName
        course
        yearStart
        yearEnd
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_RESUME = gql`
  mutation DeleteResume($deleteResumeId: ID!) {
  deleteResume(id: $deleteResumeId){
    id
  }
}
`;
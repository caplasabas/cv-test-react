import { Education } from './education.interface'

import { Experience } from './experience.interface'

export interface Resume {
  id?: number
  profilePic: string
  fullName: string
  address: string
  contact: string
  education?: Education[]
  experience?: Experience[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date 
}
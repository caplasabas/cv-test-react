export interface EducationKey {
  [key: string]: string | number | Date | undefined;
}

export interface Education extends EducationKey {
  id?: number
  resumeId?: number
  schoolName: string
  course: string;
  yearStart: string
  yearEnd: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date 
}
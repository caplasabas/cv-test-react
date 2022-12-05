export interface ExperienceKey {
  [key: string]: string | number | Date | undefined;
}

export interface Experience extends ExperienceKey {
  id?: number,
  resumeId?: number
  companyName: string
  position: string
  yearStart: string
  yearEnd: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date 
}
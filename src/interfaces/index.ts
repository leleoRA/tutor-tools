export interface Iproject {
  name: string
  isFullStack: boolean
  initialColumnRequisit: string
  endColumnRequisit: string
  week: number
  expectationColumn: string
}
export interface ImoduleInfo {
  classeName: number
  module: {
    id: number
    link: string
    project: Iproject
  }
}

export interface IrequisitesProject {
  description: string
  note: string
}
export interface IprojectInfo {
  title: string
  requisites: IrequisitesProject[]
}
export interface IrequisitesReview {
  description: string
  evaluation: string
}
export interface Istudent {
  name: string
  tutor: string
  deliveryReview: {
    evaluation: string
  }
  requisitesReview: IrequisitesReview[]
}
export interface ItutorInfo {
  name: string
  students: Istudent[]
}
export interface IcolumnsReference {
  endColumn: number
  nameColumn: number
  tutorColumn: number
  initialColumnRequisit: number
  endColumnRequisit: number
  expectationColumn: number
  linksColumn: number
  linksColumn2: number
}
export interface IrowsReference {
  startRowSheet: number
  endRowSheet: number
  rowRequisit: number
}

export interface IprojetAndStudentsInfo {
  projectInfo: IprojectInfo
  studentsInfo: Istudent[]
  tutors: string[]
}

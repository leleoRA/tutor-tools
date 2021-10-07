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
interface IrequisitesReview {
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

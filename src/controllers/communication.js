import { getProjetAndStudentsInfo } from '../services/google/spreadsheet.js'
import { createTemplate } from '../services/notion/index.js'
import { formatedTutors } from '../utils/google/index.js'

export async function prepareCommunication(moduleInfo) {
  const urlSpreadsheet = moduleInfo.module.link
  const projectSelected = moduleInfo.module.project
  const { week } = moduleInfo.module.project
  const [projectInfo, studentsInfo, tutors] = await getProjetAndStudentsInfo(
    urlSpreadsheet,
    projectSelected
  )
  const tutorInfo = formatedTutors(tutors, studentsInfo)
  await createTemplate(tutorInfo, projectInfo, week)
}

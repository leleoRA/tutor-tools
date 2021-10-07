import { ImoduleInfo } from '../interfaces'
import { getProjetAndStudentsInfo } from '../services/google/spreadsheet'
import { createTemplate } from '../services/notion/index'
import { formatedTutors } from '../utils/google/index'

export async function prepareCommunication(
  moduleInfo: ImoduleInfo
): Promise<void> {
  const urlSpreadsheet = moduleInfo.module.link
  const projectSelected = moduleInfo.module.project
  const { week } = moduleInfo.module.project
  const [projectInfo, studentsInfo, tutors] = await getProjetAndStudentsInfo(
    urlSpreadsheet,
    projectSelected
  )
  const tutorInfo = formatedTutors(tutors, studentsInfo)
  await createTemplate(tutorInfo, projectInfo, String(week))
}

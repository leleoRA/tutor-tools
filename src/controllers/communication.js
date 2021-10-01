import { getProjetAndStudentsInfo } from "../services/google/spreadsheet.js";
import { createTemplate } from "../services/notion/index.js";
import { formatedTutors } from "../utils/google/index.js";

export async function prepareCommunication(spreadsheetId,sheetTitle,nSemana) {
  const [projectInfo, studentsInfo, tutors] = await getProjetAndStudentsInfo(spreadsheetId,sheetTitle);
  const tutorInfo = formatedTutors(tutors,studentsInfo);
  await createTemplate(tutorInfo,projectInfo,nSemana);

}


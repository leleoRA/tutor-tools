/* eslint-disable no-underscore-dangle */
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet'
import creds from '../../../client_secret_google.js'
import { convertRequisiteEvaluation } from '../../utils/google/index'
import {
  convertLetterInNumber,
  extractIdByUrlSpreadsheet,
} from '../../utils/tools/index'
import {
  columnsReferenceDefault,
  rowsReferenceDefault,
} from '../../data/infoSpreadsheetDefault'

import {
  Iproject,
  Istudent,
  IrequisitesProject,
  IprojectInfo,
} from '../../interfaces/index'

async function initSpreadsheet(spreadsheetId, sheetTitle) {
  const doc = new GoogleSpreadsheet(spreadsheetId)

  doc.useServiceAccountAuth(creds)

  await doc.loadInfo()

  const sheet = doc.sheetsByTitle[sheetTitle]

  return sheet
}

function formatedColumns(project) {
  const columnsReference = {
    ...columnsReferenceDefault,
    initialColumnRequisit: convertLetterInNumber(project.initialColumnRequisit),
    endColumnRequisit: convertLetterInNumber(project.endColumnRequisit),
    expectationColumn: convertLetterInNumber(project.expectationColumn),
  }

  return columnsReference
}

function getRequisitesProject(
  sheet: GoogleSpreadsheetWorksheet,
  columnsReference,
  rowsReference
): IrequisitesProject[] {
  const requisitesProject = []
  for (
    let col = columnsReference.initialColumnRequisit;
    col < columnsReference.endColumnRequisit;
    col += 1
  ) {
    const requisit = sheet.getCell(rowsReference.rowRequisit, col)
    requisitesProject.push({
      description: requisit.value,
      note: requisit.note,
    })
  }

  return requisitesProject
}

function getRequisitesEvaluationByRow(
  sheet,
  row,
  columnsReference,
  rowsReference
) {
  const requisiteEvaluation = []
  for (
    let col = columnsReference.initialColumnRequisit;
    col < columnsReference.endColumnRequisit;
    col += 1
  ) {
    const requisite = sheet.getCell(rowsReference.rowRequisit, col).value
    const evaluation = sheet.getCell(row, col).value
    requisiteEvaluation.push({
      description: requisite,
      evaluation: convertRequisiteEvaluation(evaluation),
    })
  }
  return requisiteEvaluation
}

function getStudentsResults(
  sheet: GoogleSpreadsheetWorksheet,
  columnsReference,
  rowsReference
) {
  const studentsInfo = []
  for (
    let row = rowsReference.startRowSheet;
    row < rowsReference.endRowSheet;
    row += 1
  ) {
    const student = {
      name: sheet.getCell(row, columnsReference.nameColumn).value,
      tutor: sheet.getCell(row, columnsReference.tutorColumn).value,
      deliveryReview: {
        evaluation: sheet.getCell(row, columnsReference.expectationColumn)
          .value,
      },
      requisitesReview: getRequisitesEvaluationByRow(
        sheet,
        row,
        columnsReference,
        rowsReference
      ),
    }
    studentsInfo.push(student)
  }
  return studentsInfo
}

function getTutors(sheet, columnsReference, rowsReference): Array<string> {
  const tutors = []
  for (
    let row = rowsReference.startRowSheet;
    row < rowsReference.endRowSheet;
    row += 1
  ) {
    const tutor = sheet.getCell(row, columnsReference.tutorColumn).value
    if (tutor !== null && !tutors.includes(tutor.toLowerCase())) {
      tutors.push(tutor.toLowerCase())
    }
  }
  return tutors
}

export async function getRepoLinks(
  urlSpreadsheetModule: string,
  project: Iproject
): Promise<Array<string>> {
  const tutor = process.env.TUTOR_NAME.toLowerCase()
  const links = []

  const spreadsheetId = extractIdByUrlSpreadsheet(urlSpreadsheetModule)
  const sheet = await initSpreadsheet(spreadsheetId, project.name)

  const columnsReference = formatedColumns(project)
  const rowsReference = rowsReferenceDefault

  await sheet.loadCells({
    startColumnIndex: 0,
    endColumnIndex: columnsReference.linksColumn + 2,
    startRowIndex: 0,
    endRowIndex: rowsReference.endRowSheet,
  })

  for (
    let row = rowsReference.startRowSheet;
    row < rowsReference.endRowSheet;
    row += 1
  ) {
    const tutorRow = String(
      sheet.getCell(row, columnsReference.tutorColumn).value
    )?.toLowerCase()
    if (tutorRow === tutor) {
      links.push(sheet.getCell(row, columnsReference.linksColumn).value)
      if (project.isFullStack) {
        links.push(sheet.getCell(row, columnsReference.linksColumn2).value)
      }
    }
  }
  return links
}

export async function getProjetAndStudentsInfo(
  urlSpreadsheetModule: string,
  project: Iproject
): Promise<Array<IprojectInfo | Istudent[] | string[]>> {
  const spreadsheetId = extractIdByUrlSpreadsheet(urlSpreadsheetModule)
  const sheet = await initSpreadsheet(spreadsheetId, project.name)

  const columnsReference = formatedColumns(project)
  const rowsReference = rowsReferenceDefault

  await sheet.loadCells({
    startColumnIndex: 0,
    endColumnIndex: columnsReference.endColumn,
    startRowIndex: 0,
    endRowIndex: rowsReference.endRowSheet,
  })

  const requisitesProject = getRequisitesProject(
    sheet,
    columnsReference,
    rowsReference
  )

  const projectInfo = {
    title: project.name,
    requisites: requisitesProject,
  }

  const studentsInfo = getStudentsResults(
    sheet,
    columnsReference,
    rowsReference
  )
  const tutors = getTutors(sheet, columnsReference, rowsReference)

  return [projectInfo, studentsInfo, tutors]
}

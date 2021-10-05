/* eslint-disable no-underscore-dangle */
import { GoogleSpreadsheet } from 'google-spreadsheet'
import creds from '../../../client_secret_google.js'

const columnsReference = {
  endColumn: 20,
  initialColumnRequisit: 4,
  endColumnRequisit: 10,
  nameColumn: 0,
  tutorColumn: 1,
  linksColumn: 2,
  expectationColumn: 11,
}
const rowsReference = {
  startRowSheet: 3,
  endRowSheet: 7,
  rowRequisit: 1,
}

function convertRequisiteEvaluation(evaluation) {
  if (evaluation === 0) return 'Requisitos entregues totalmente'
  if (evaluation === 1) return 'Requisitos entregues parcialmente'
  return 'Requisitos não entregues'
}

function getRequisitesProject(sheet) {
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

function getRequisitesEvaluationByRow(sheet, row) {
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

function getStudentsResults(sheet) {
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
      requisitesReview: getRequisitesEvaluationByRow(sheet, row),
    }
    studentsInfo.push(student)
  }
  return studentsInfo
}

function getTutors(sheet) {
  const tutors = []
  for (
    let row = rowsReference.startRowSheet;
    row < rowsReference.endRowSheet;
    row += 1
  ) {
    const tutor = sheet
      .getCell(row, columnsReference.tutorColumn)
      .value.toLowerCase()
    if (!tutors.includes(tutor)) {
      tutors.push(tutor)
    }
  }
  return tutors
}

export async function getRepoLinks(spreadsheetId, sheetTitle) {
  const tutor = process.env.TUTOR_NAME.toLowerCase()

  const links = []
  const doc = new GoogleSpreadsheet(spreadsheetId)
  doc.useServiceAccountAuth(creds)

  await doc.loadInfo()

  const sheet = doc.sheetsByTitle[sheetTitle]

  await sheet.loadCells({
    startColumnIndex: 0,
    endColumnIndex: columnsReference.linksColumn + 1,
    startRowIndex: 0,
    endRowIndex: rowsReference.endRowSheet,
  })

  for (
    let row = rowsReference.startRowSheet;
    row < rowsReference.endRowSheet;
    row += 1
  ) {
    const tutorRow = sheet
      .getCell(row, columnsReference.tutorColumn)
      .value.toLowerCase()
    if (tutorRow === tutor) {
      links.push(sheet.getCell(row, columnsReference.linksColumn).value)
    }
  }
  return links
}

export async function getProjetAndStudentsInfo(spreadsheetId, sheetTitle) {
  const doc = new GoogleSpreadsheet(spreadsheetId)

  doc.useServiceAccountAuth(creds)

  await doc.loadInfo()

  const sheet = doc.sheetsByTitle[sheetTitle]

  await sheet.loadCells({
    startColumnIndex: 0,
    endColumnIndex: columnsReference.endColumn,
    startRowIndex: 0,
    endRowIndex: rowsReference.endRowSheet,
  })

  const requisitesProject = getRequisitesProject(sheet)

  const projectInfo = {
    title: sheetTitle,
    requisites: requisitesProject,
  }

  const studentsInfo = getStudentsResults(sheet)
  const tutors = getTutors(sheet)

  return [projectInfo, studentsInfo, tutors]
}

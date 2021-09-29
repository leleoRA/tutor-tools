import { GoogleSpreadsheet } from "google-spreadsheet";
import creds from '../client_secret_google.js';

const spreadsheetId = '1CMrGiaLQ8c8P8HxQF0dzn8nGKN1uiy2Dj_645KX_IpY'
const sheetTitle = 'Sing me a song';

const initialColumnRequisit = 4;
const endColumnRequisit = 10;
const rowRequisit = 1;

const endRowSheet = 52

const nameColumn = 0
const tutorColumn = 1
const expectationColumn = 11

const studentsInfo = []

export async function getProjetAndStudentsInfo(){
  var doc = new GoogleSpreadsheet(spreadsheetId);

  doc.useServiceAccountAuth(creds);  

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle[sheetTitle]; 
  
  await sheet.loadCells({startColumnIndex:nameColumn, endColumnIndex:20});

  // ====================================================================================
  const requisitesProject = []

  for (let i = initialColumnRequisit; i < endColumnRequisit; i++) {
    const requisit = sheet.getCell(rowRequisit,i);
    requisitesProject.push({
      "description":requisit.value,
      "note":requisit.note
    });
  }

  const projectInfo = {
    title: sheetTitle,
    requisites: requisitesProject
  }
  // ====================================================================================

  for(let row = 3; row < endRowSheet; row ++){
    const tutor = sheet.getCell(row, tutorColumn).value
    const requisiteEvaluation = []
    for (let col = initialColumnRequisit; col < endColumnRequisit; col++) {
      const requisite   = sheet.getCell(rowRequisit,col).value;
      const evaluation = sheet.getCell(row,col).value;
      requisiteEvaluation.push({
        description:requisite,
        evaluation:convertRequisiteEvaluation(evaluation)
      })
    }
    const student = {
      name: sheet.getCell(row, nameColumn).value,
      tutor: tutor,
      deliveryReview: {
        evaluation: sheet.getCell(row, expectationColumn).value,
      },
      requisitesReview: requisiteEvaluation
    }
    
    studentsInfo.push(student);

  }
  // console.log("Dados selecionado! ")
  return [projectInfo,studentsInfo];
}

function convertRequisiteEvaluation(evaluation){
  if (evaluation === 0) return "Requisitos entregues totalmente";
  else if (evaluation === 1) return "Requisitos entregues parcialmente"
  return "Requisitos não entregues"
}
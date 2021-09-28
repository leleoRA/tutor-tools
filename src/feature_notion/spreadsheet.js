import { GoogleSpreadsheet } from "google-spreadsheet";
import creds from '../../client_secret.js';

const spreadsheetId = '1CMrGiaLQ8c8P8HxQF0dzn8nGKN1uiy2Dj_645KX_IpY'
const sheetTitle = 'Sing me a song';

const initialColumnRequisit = 4;
const endColumnRequisit = 10;
const rowRequisit = 1;

const endRowSheet = 52

const nameColumn = 0
const tutorColumn = 1
const expectationColumn = 11

const feedbacks = {}

export default async function main(){
  var doc = new GoogleSpreadsheet(spreadsheetId);

  doc.useServiceAccountAuth(creds);  

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle[sheetTitle]; 
  
  await sheet.loadCells({startColumnIndex:nameColumn, endColumnIndex:20});

  for(let row = 3; row < endRowSheet; row ++){
    const requisitsProject = []

    for (let i = initialColumnRequisit; i < endColumnRequisit; i++) {
      const requisit = sheet.getCell(rowRequisit,i);
      requisitsProject.push({
        "description":requisit.value,
        "note":requisit.note
      });
    }

    const finalObj = {
      student: sheet.getCell(row, nameColumn).value,
      title: sheetTitle,
      deliveryReview: {
        evaluation: sheet.getCell(3, expectationColumn).value,
        requisit : requisitsProject
      },
      codeReview: {
        evaluation: 'disponível no Pull Request no GitHub (Pode fechar o Pull Request depois de ler, clicando em Close Pull Request.)'
      }
    }
    
    const tutor = sheet.getCell(row, tutorColumn).value

    if(feedbacks[tutor]){
      feedbacks[tutor].push(finalObj)
    } else {
      feedbacks[tutor] = [finalObj]
    }
  }

  return feedbacks;
}
main()

import { GoogleSpreadsheet } from "google-spreadsheet";
import creds from '../../client_secret.js';

const spreadsheetId = '1CMrGiaLQ8c8P8HxQF0dzn8nGKN1uiy2Dj_645KX_IpY'
const sheetTitle = 'Sing me a song';

const initialColumnRequisit = 4;
const endColumnRequisit = 10;
const rowRequisit = 1;

const requisitsProject = []

export async function main(){
  var doc = new GoogleSpreadsheet(spreadsheetId);

  doc.useServiceAccountAuth(creds);  

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle[sheetTitle]; 
  
  await sheet.loadCells({startColumnIndex:initialColumnRequisit,endColumnIndex:endColumnRequisit});

  for (let i = initialColumnRequisit; i < endColumnRequisit; i++) {
    const requisit = sheet.getCell(rowRequisit,i);
    requisitsProject.push({
      "description":requisit.value,
      "note":requisit.note
    });
  }
  // console.log(requisitsProject)
  return requisitsProject;
}
main()

import { GoogleSpreadsheet } from "google-spreadsheet";
import creds from '../../client_secret.js';

const spreadsheetId = '1CMrGiaLQ8c8P8HxQF0dzn8nGKN1uiy2Dj_645KX_IpY'
const sheetTitle = 'Sing me a song';
const rangeRequisits = 'E2:J2';
const rangeBonus = 'M2:R2';

async function main(){
  var doc = new GoogleSpreadsheet(spreadsheetId);

  doc.useServiceAccountAuth(creds);  

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle[sheetTitle]; 
  await sheet.loadCells();

  const requisitsProject = sheet.getCellByA1(rangeRequisits);

  console.log(requisitsProject)

}
main()

import { GoogleSpreadsheet } from "google-spreadsheet";
import credentials from "../../client_secret_google.js";

const spreadsheetId = '1CMrGiaLQ8c8P8HxQF0dzn8nGKN1uiy2Dj_645KX_IpY'
const sheetTitle = 'Sing me a song';

const repositories = [];
const tutor = process.env.TUTOR_NAME;

export async function findLinks() {
    const doc = new GoogleSpreadsheet(spreadsheetId);
    doc.useServiceAccountAuth(credentials);

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[sheetTitle]; 
    
    const rows = await sheet.getRows({offset: 2, limit: 52});

    for(let i = 0; i <= rows.length; i++) {
        const row = rows[i];
        if(row !== undefined) {
            if(row._rawData[1].toLowerCase() === tutor.toLowerCase()) {
                const link = rows[i]._rawData[2];
                repositories.push(link);    
            }
        }
    }

    console.log(repositories);
    // console.log('info', info)
}
 
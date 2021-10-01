import "./setup.js";

import readlineSync from "readline-sync";
import shell from "shelljs";

import * as gitHubAuth from "./auth/gitHubTokenAuth.js";
import * as codeReviewController from "./controllers/codeReview.js";
import * as communicationController from "./controllers/communication.js";
import * as deliveryReviewController from "./controllers/deliveryReview.js";


global.root = shell.pwd().stdout;
const spreadsheetId = "1CMrGiaLQ8c8P8HxQF0dzn8nGKN1uiy2Dj_645KX_IpY";
const sheetTitle = "Sing me a song";
const nSemana = "17"
async function main() {
  const operations = [
    "Revisão de Entrega",
    "Revisão de Código",
    "Gerar Comunicação",
    "Finalizar Avaliação",
  ];

  const index = readlineSync.keyInSelect(
    operations,
    "Qual operação deseja realizar?"
  );

  switch (index + 1) {
    case 1:
      await deliveryReviewController.prepareReview();
      break;

    case 2:
      try {
        await gitHubAuth.authenticate();
        await codeReviewController.prepareReview();
      } catch (err) {
        console.log(err);
      }
      break;

    case 3:
      await communicationController.prepareCommunication(spreadsheetId,sheetTitle,nSemana);
      break;

    case 4:
      break;
  }
}

main();

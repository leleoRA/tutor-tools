import "./setup.js";

import chalk from "chalk";
import readlineSync from "readline-sync";
import shell from "shelljs";

import * as gitHubAuth from "./auth/gitHubTokenAuth.js";
import * as codeReviewController from "./controllers/codeReview.js";
import * as communicationController from "./controllers/communication.js";
import * as deliveryReviewController from "./controllers/deliveryReview.js";

import * as hooks from "./utils/hooks/index.js";
import classData from "./data/index.js";

global.root = shell.pwd().stdout;

async function main() {
  askInformation();
}

function askInformation() {
  const classNames = classData.map((classInfo) => "Turma " + classInfo.className);

  const index = readlineSync.keyInSelect(
    classNames,
    chalk.bold("Olá! Bem-vindo ao Tutor-Tools! Em qual turma você trabalha atualmente?")
  );

  const validIndex = (index + 1) > 0 && (index + 1) <= classNames.length;

  if(validIndex) {
    askModule(classData[index]);
  }
}

function askModule(classInfo) {
  const moduleNames = classInfo.modules.map((m) => "Modulo " + m.id + ": " + m.name);

  const index = readlineSync.keyInSelect(
    moduleNames,
    chalk.bold("O projeto que você deseja avaliar faz parte de qual módulo?")
  );

  const validIndex = (index + 1) > 0 && (index + 1) <= moduleNames.length;

  if(validIndex) {
    askProject(classInfo.modules[index]);
  }
}

function askProject(module) {
  const projectNames = module.projects.map((p) => p.name);

  const index = readlineSync.keyInSelect(
    projectNames,
    chalk.bold("E por fim, qual projeto você deseja avaliar?")
  );

  const validIndex = (index + 1) > 0 && (index + 1) <= projectNames.length;

  if(validIndex) {
    console.log(module.projects[index]);
    //chamar askOperation();
  }
}

async function askOperation() {
  const operations = [
    "Revisão de Entrega",
    "Revisão de Código",
    "Gerar Comunicação",
    "Finalizar Avaliação",
  ];

  const index = readlineSync.keyInSelect(
    operations,
    chalk.bold("Qual operação deseja realizar?")
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
      await communicationController.prepareCommunication(
        spreadsheetId,
        sheetTitle,
        nSemana
      );
      break;

    case 4:
      hooks.clear();
      break;
  }
}

main();

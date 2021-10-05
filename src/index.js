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
  const classes = classData.map((classInfo) => {
    return "Turma " + classInfo.turma;
  });
  console.log(classes);

  const index = readlineSync.keyInSelect(
    classes,
    chalk.bold("Olá! Bem-vindo ao Tutor-Tools! Em qual turma você trabalha atualmente?")
  );

  const validIndex = (index + 1) > 0 && (index + 1) <= classes.length;

  if(validIndex) {
    askModule(classData[index]);
  }
}

function askModule(turma) {
  const modules = turma.modulos.map((m) => {
    return "Modulo " + m.id + ": " + m.nome;
  });

  const index = readlineSync.keyInSelect(
    modules,
    chalk.bold("O projeto que você deseja avaliar faz parte de qual módulo?")
  );

  const validIndex = (index + 1) > 0 && (index + 1) <= modules.length;

  if(validIndex) {
    askProject(turma.modulos[index]);
  }
}

function askProject(modulo) {
  console.log(modulo);

  const projects = modulo.projetos.map((p) => {
    return p.nome;
  });

  const index = readlineSync.keyInSelect(
    projects,
    chalk.bold("E por fim, qual projeto você deseja avaliar?")
  );

  const validIndex = (index + 1) > 0 && (index + 1) <= projects.length;

  if(validIndex) {
    console.log(modulo.projetos[index]);
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

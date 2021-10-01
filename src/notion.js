import { Client } from "@notionhq/client";
import "./setup.js";
import { getProjetAndStudentsInfo } from "./services/google/spreadsheet.js";
import { addText, addToggle } from "./utils/notion/index.js";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const tutorInfo = [
  {
    name: "guga",
    students: [],
  },
  {
    name: "leo",
    students: [],
  },
  {
    name: "thiago",
    students: [],
  },
  {
    name: "gabriel",
    students: [],
  },
];
const databaseId = process.env.NOTION_DATABASE_ID;

async function main() {
  const projectName = "### Semana #17-Sing me a Song";
  const idProject = (await addToggle(databaseId, projectInfo.title)).results[0]
    .id;
  for (const tutor of tutorInfo) {
    console.log(`Criando templates do(a) ${tutor.name}`);

    const idTutor = (await addToggle(idProject, tutor.name)).results[0].id;

    for (const student of tutor.students) {
      const idInitialTemplate = (
        await initialTemplateStudent(idTutor, student, projectName)
      ).results[0].id;
      const idRequisiteProject = await findIdRequisiteProject(
        idInitialTemplate
      );
      await addRequisitesProject(idRequisiteProject);
      const idRequisiteEvaluationProject =
        await findIdEvaluationRequisitesProject(idInitialTemplate);
      await addRequisitesEvaluationProject(
        idRequisiteEvaluationProject,
        student
      );
    }
  }
}

async function initialTemplateStudent(blockId, student, projectName) {
  try {
    const response = await notion.blocks.children.append({
      block_id: blockId,
      children: [
        {
          type: "toggle",
          toggle: {
            text: addText(student.name),
            children: [
              {
                type: "heading_3",
                heading_3: {
                  text: addText(projectName),
                },
              },
              {
                type: "toggle",
                toggle: {
                  text: addText("Feedback de Entrega"),
                  children: [
                    {
                      type: "bulleted_list_item",
                      bulleted_list_item: {
                        text: addText(
                          "Avaliação Geral: " +
                            student.deliveryReview.evaluation
                        ),
                      },
                    },
                    {
                      type: "toggle",
                      toggle: {
                        text: addText(
                          "Quais foram os requisitos avaliados nesse projeto?"
                        ),
                      },
                    },
                    {
                      type: "toggle",
                      toggle: {
                        text: addText("Avaliação por requisito"),
                      },
                    },
                  ],
                },
              },
              {
                type: "toggle",
                toggle: {
                  text: addText("Feedback de Código"),
                  children: [
                    {
                      type: "bulleted_list_item",
                      bulleted_list_item: {
                        text: addText(getMessageFeedbackCode()),
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function addRequisitesProject(id) {
  try {
    await notion.blocks.children.append({
      block_id: id,
      children: createTemplateRequestProject(),
    });
  } catch (e) {}
}

async function addRequisitesEvaluationProject(id, student) {
  try {
    await notion.blocks.children.append({
      block_id: id,
      children: createTemplateRequisitesEvaluationProject(student),
    });
  } catch (e) {}
}

function createTemplateRequisitesEvaluationProject(student) {
  const requestProjectFormated = student.requisitesReview.map((requisite) => {
    return {
      type: "bulleted_list_item",
      bulleted_list_item: {
        text: addText(requisite.description + ": " + requisite.evaluation),
      },
    };
  });
  return requestProjectFormated;
}

function createTemplateRequestProject() {
  const requestProjectFormated = projectInfo.requisites.map((request) => {
    if (request.note === undefined) {
      return {
        type: "bulleted_list_item",
        bulleted_list_item: {
          text: [
            {
              type: "text",
              text: {
                content: request.description,
              },
            },
          ],
        },
      };
    }
    return {
      type: "toggle",
      toggle: {
        text: [
          {
            type: "text",
            text: {
              content: request.description,
            },
          },
        ],
        children: [
          {
            type: "bulleted_list_item",
            bulleted_list_item: {
              text: [
                {
                  type: "text",
                  text: {
                    content: request.note,
                  },
                },
              ],
            },
          },
        ],
      },
    };
  });
  return requestProjectFormated;
}

async function findIdRequisiteProject(id) {
  let lastid = id;
  try {
    // Como assim ele roda mais rápido gerando o erro do que parando o while? DIFERENÇA DE FUNCK 9 SEGUNDOS
    const response = await notion.blocks.children.list({ block_id: id });
    while (response.results.length >= 1) {
      const response = await notion.blocks.children.list({ block_id: lastid });
      if (response.results.length > 1) {
        lastid = response.results[1].id;
      } else {
        lastid = response.results[0].id;
      }
    }
  } catch (error) {}
  return lastid;
}

async function findIdEvaluationRequisitesProject(id) {
  let lastid = id;
  try {
    const response = await notion.blocks.children.list({ block_id: id });
    const path = [1, 2];
    let i = 0;
    while (response.results.length >= 1) {
      const response = await notion.blocks.children.list({ block_id: lastid });
      lastid = response.results[path[i]].id;
      i = i + 1;
    }
  } catch (error) {}
  return lastid;
}

function getMessageFeedbackCode() {
  return `Feedback Qualitativo: disponível no Pull Request no GitHub (Pode fechar o Pull Request depois de ler, clicando em Close Pull Request.) "`;
}

function formatedStudents() {
  tutorInfo.forEach((tutor) => {
    studentsInfo.forEach((student) => {
      if (tutor.name.toLowerCase() === student.tutor?.toLowerCase()) {
        tutor.students.push(student);
      }
    });
  });
}

const [projectInfo, studentsInfo] = await getProjetAndStudentsInfo();

export async function createTemplate() {
  formatedStudents();
  main();
}

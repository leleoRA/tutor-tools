import { Client } from "@notionhq/client";
import { addText, getMessageFeedbackCode, createTemplateRequestProject, createTemplateRequisitesEvaluationProject } from "../../utils/notion/index.js";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

export async function createTemplate(tutorInfo,projectInfo,nSemana='1') {
  const projectName = `Semana #${nSemana}-${projectInfo.title}`;
  const idProject = (await addToggle(databaseId, projectInfo.title)).results[0].id;

  for (const tutor of tutorInfo) {
    console.log(`Criando templates do(a) ${tutor.name}`);

    const idTutor = (await addToggle(idProject, tutor.name)).results[0].id;

    for (const student of tutor.students) {
      const idInitialTemplate = (
        await initialTemplateStudent(idTutor, student, projectName)
      ).results[0].id;

      const [idRequisiteProject,idRequisiteEvaluationProject] = await Promise.all([
        findIdRequisiteProject(idInitialTemplate) ,
        findIdEvaluationRequisitesProject(idInitialTemplate) 
      ])

      addRequisitesProject(idRequisiteProject,projectInfo);
      addRequisitesEvaluationProject(idRequisiteEvaluationProject,student);
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

async function addRequisitesProject(id,projectInfo) {
  try {
    await notion.blocks.children.append({
      block_id: id,
      children: createTemplateRequestProject(projectInfo),
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

async function findIdRequisiteProject(id) {
  let lastid = id;
  let response = await notion.blocks.children.list({ block_id: id });
  const path = [1, 1];
  let i = 0;
  try {
    while (response.results.length >= 1) {
      lastid = response.results[path[i]].id;
      i = i + 1;
      response = await notion.blocks.children.list({ block_id: lastid });
    }
  } catch (error) {}
  return lastid;
}

async function findIdEvaluationRequisitesProject(id) {
  let lastid = id;
  let response = await notion.blocks.children.list({ block_id: id });
  const path = [1, 2];
  let i = 0;
  try {
    while (response.results.length >= 1) {
      lastid = response.results[path[i]].id;
      i = i + 1;
      response = await notion.blocks.children.list({ block_id: lastid });
    }
  } catch (error) {}
  return lastid;
}

async function addToggle(blockId,content){
  try {
    const response = await notion.blocks.children.append({
      block_id:blockId,
      children:[{
        type:"toggle",
        toggle:{
          text:addText(content)
        }
      }]
    })
    return response; 
  } catch (error) { 
      console.log(error)
  }
}
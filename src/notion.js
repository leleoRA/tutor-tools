import { Client } from "@notionhq/client"
import './setup.js';
import {requesiteProject, studentsInfo,projectInfo, tutorInfo} from './feature_notion/faker.js';
import {v4 as uuid, v4 } from 'uuid'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const databaseId = process.env.NOTION_DATABASE_ID

async function main(){
  const projectName = "### Semana #17-Sing me a Song";
  const idProject = (await addToggle(databaseId,projectInfo.title)).results[0].id;
  for (const tutor of tutorInfo){
    const idTutor = (await addToggle(idProject,tutor.name)).results[0].id;
    for (const student of tutor.students){
      const idInitialTemplate = (await initialTemplateStudent(idTutor,student,projectName)).results[0].id;
      const idRequisiteProject = await findIdRequisiteProject(idInitialTemplate);
      await addRequisitesProject(idRequisiteProject)
    }
  }
}
async function initialTemplateStudent(blockId,student,projectName) {
  const idAvaliation = uuid();
  try {
    const response = await notion.blocks.children.append({
      block_id: blockId,
      children: [
        {
          type: "toggle",
          toggle: { text: addText(student.name)
            ,
            children: [
              {
                type:'heading_3',
                heading_3:{
                  text:addText(projectName)
                }
              },
              {
                type: "toggle",
                toggle: {
                  text: addText("Feedback de Entrega"),
                  children:[
                    {
                      type:'bulleted_list_item',
                      bulleted_list_item:{
                        text:addText('Avaliação Geral: '+ student.deliveryReview.evaluation)
                      }
                    },
                    {
                      type: "toggle",
                      toggle: {
                        text: addText("Quais foram os requisitos avaliados nesse projeto?"),
                      }
                    },
                    {
                      type: "toggle",
                      toggle: {
                        text: addText("Avaliação por requisito"),
                      }
                    },
                  ]
                },
              },
              {
                type:'toggle',
                toggle:{
                  text: addText("Feedback de Código"),
                  children:[{
                    type:'bulleted_list_item',
                    bulleted_list_item: {
                      text:addText(getMessageFeedbackCode())
                    }
                  }]
                }
              }
            ]
          }
        },
    ]
    })
    return response;
  } catch (error) {
    console.error(error)
  }
}
async function addRequisitesProject(id){
  try{
    const response = await notion.blocks.children.append({

      block_id:id,
      children: createTemplateRequestProject()
    })
  }catch(e){
    
    console.log("Deu ruim na gamb",e)
  }
}
function createTemplateRequestProject(){
  const requestProjectFormated = requesiteProject.map((request) =>{
    if (request.note === undefined){
      return{
        type:'bulleted_list_item',
        bulleted_list_item:{
          text:[{
            type:'text',
            text:{
              content: request.description
            }
          }],
        }
      }
    }
    return{
      type:'toggle',
      toggle:{
        text:[{
          type:'text',
          text:{
            content: request.description
          }
        }],
        children:[{
          type: "bulleted_list_item",
          bulleted_list_item: {
            text: [{
              type: "text",
              text: {
                content: request.note,
              }
            }],
          }
        }]
      }
    }
  })
  return requestProjectFormated;
  
}

async function findIdRequisiteProject(id){
  let lastid = id;
  try {
    // Como assim ele roda mais rápido gerando o erro do que parando o while? DIFERENÇA DE FUNCK 9 SEGUNDOS
    const response = await notion.blocks.children.list({block_id:id})
    while(response.results.length >= 1){
      const response = await notion.blocks.children.list({block_id:lastid})
      if (response.results.length > 1){
        lastid = response.results[1].id;
      }else{
        lastid = response.results[0].id;
      }
    }
  } catch (error) {
    // console.log(error)
  }
  return lastid
}
async function findLastId(id){
  let lastid = id;
  try {
    const response = await notion.blocks.children.list({block_id:id})
    while(response.results.length >= 1){
      const response = await notion.blocks.children.list({block_id:lastid})
      if (response.results.length > 1){
        lastid = response.results[1].id;
      }else{
        lastid = response.results[0].id;
      }
    }
  } catch (error) {
    // console.log(error)
  }
  return lastid
}


function addText(content){
  return  [{ 
      type: "text", 
      text: { 
        content: content
      },
    }]
}
function getMessageFeedbackCode(){
  return `Feedback Qualitativo: disponível no Pull Request no GitHub (Pode fechar o Pull Request depois de ler, clicando em Close Pull Request.) "`
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
    
  }
}
async function addHeading3(blockId,content){
  try {
    const response = await notion.blocks.children.append({
      block_id:blockId,
      children:[{
        type:"heading_3",
        heading_3:{
          text:addText(content)
        }
      }]
    })
    return response; 
  } catch (error) {
    
  }
}
async function addBlock(blockId,type,content){
  try {
    const response = await notion.blocks.children.append({
      block_id:blockId,
      children:[{
        type:type,
        [type]:{
          text:addText(content)
        }
      }]
    })
    return response; 
  } catch (error) {
    
  }
}

function formatedStudents(){
  tutorInfo.forEach((tutor)=>{
    const studentsTheseTutor = studentsInfo.find( (student) => {return tutor.name === student.tutor} )
    if (studentsTheseTutor !== undefined){
      tutor.students.push(studentsTheseTutor);
    }
  });
}
formatedStudents()
main()
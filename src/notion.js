import { Client } from "@notionhq/client"
import './setup.js';
import {requestProject} from './feature_notion/faker.js';

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const databaseId = process.env.NOTION_DATABASE_ID

async function main(){
  const responseInitial = await initialTemplateProject();
  console.log("Other id =>",responseInitial.results[0].id)
  const lastId = await findLastId(responseInitial.results[0].id);
  console.log("my id =>",lastId) 
  addRequestsProject(lastId);

}

export async function initialTemplateProject() {
  const nomeAluno = "Thiago Paiva"
  const nomeProjeto = '### Semana #17-Sing me a Song'
  const resultadoAluno = "Acima das expectativas"
  try {
    const response = await notion.blocks.children.append({
      block_id: databaseId,
      children: [
        {
          type: "toggle",
          toggle: {
            text: [{ 
              type: "text", 
              text: { 
                content: nomeAluno
              },
            }],
            children: [
              {
                type:'heading_3',
                heading_3:{
                  text:[{
                    type:'text',
                    text:{
                      content:nomeProjeto
                    }
                  }]
                }
              },
              {
                type: "toggle",
                toggle: {
                  text: [{
                    type: "text",
                    text: {
                        content: "Feedback de Entrega",
                    }
                  }],
                  children:[
                    {
                      type:'bulleted_list_item',
                      bulleted_list_item:{
                        text:[{
                          type:'text',
                          text:{
                            content: 'Avaliação Geral: '+ resultadoAluno
                          }
                        }]
                      }
                    },
                    {
                      type: "toggle",
                      toggle: {
                        text: [{
                          type: "text",
                          text: {
                            content: "Quais foram os requisitos avaliados nesse projeto?",
                            link: null
                          }
                        }],
                      }
                    },
                    {
                      type: "toggle",
                      toggle: {
                        text: [{
                          type: "text",
                          text: {
                            content: "Avaliação por requisito",
                            link: null
                          }
                        }],
                      }
                    },
                  ]
                },
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


async function addRequestsProject(id){
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
  const requestProjectFormated = requestProject.map((request) =>{
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
main()
// findLastId("c576e080-a81e-4274-86ee-10bfb8463364")
// get()
// lalala()
// initialTemplateProject();
// createTemplate()
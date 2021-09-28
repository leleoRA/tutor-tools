import { Client } from "@notionhq/client"
import './setup.js';
import { main } from './feature_notion/spreadsheet.js'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const databaseId = process.env.NOTION_DATABASE_ID

export async function addItem(text) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: { 
          title:[
            {
              "text": {
                "content": text
              }
            }
          ]
        }
      },
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}

export async function createTemplate() {
  const criteria = await main()
  const formatedCriteria = criteria.map(individualCriteria => ({
    type: "bulleted_list_item",
    bulleted_list_item: {
        text: [{
          type: "text",
          text: {
              content: individualCriteria.description,
          }
        }]
    }
  }))

  try {
    const response = await notion.blocks.children.append({
      block_id: databaseId,
      children: [
        {
          object: "block",
          type: "heading_1",
          heading_1: {
            text: [{
              type: "text", 
              text: { 
                content: "Feedback de entrega"
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
                content: "Avaliação geral"
              },
            }],
            children: [
              {
                  type: "bulleted_list_item",
                  bulleted_list_item: {
                      text: [{
                        type: "text",
                        text: {
                            content: "Acima das expectativas",
                        }
                      }]
                  }
              }
            ]
          }
        },
        {
          type: "toggle",
          toggle: {
            text: [{ 
              type: "text", 
              text: { 
                content: "Quais foram os requisitos avaliados nesse projeto?"
              },
            }],
            children: formatedCriteria
          }
        }
    ]
  })
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error)
  }
}

export async function createTemplateProject() {
  try {
    const response = await notion.blocks.children.append({
      block_id: databaseId,
      children: [
        {
          object: "block",
          type: "heading_1",
          heading_1: {
            text: [{
              type: "text", 
              text: { 
                content: "Feedback Github"
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
                content: "Thiago Paiva"
              },
            }],
            children: [
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
                      type:'heading_3',
                      heading_3:{
                        text:[{
                          type:'text',
                          text:{
                            content:'### Semana #17-Sing me a Song'
                          }
                        }]
                      }
                    },
                    {
                      type:"toggle",
                      toggle: {
                        text:[{
                          type:"text",
                          text:{
                            content:"Quais foram os requisitos avaliados nesse projeto?"
                          }
                        }]
                      }
                    }
                  ]
                },
              }
            ]
          }
        },

    ]
  })
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error)
  }
}

createTemplateProject();
// createTemplate()
import { Client } from "@notionhq/client"
import './setup.js';

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
                content: "Perfil"
              },
            }],
            children: [
              {
                  type: "bulleted_list_item",
                  bulleted_list_item: {
                      text: [{
                        type: "text",
                        text: {
                            content: "Perfil legal",
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
                content: "Projeto"
              },
            }],
            children: [
              {
                  type: "bulleted_list_item",
                  bulleted_list_item: {
                      text: [{
                        type: "text",
                        text: {
                            content: "Projeto hermoso",
                        }
                      }]
                  }
              }
            ]
          }
        }
    ]
  })
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error)
  }
}

createTemplate();
import { Client } from "@notionhq/client"
const notion = new Client({ auth: process.env.NOTION_TOKEN })

export async function addToggle(blockId,content){
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

export function addText(content){
    return  [{ 
        type: "text",
        text: { 
          content: content
        },
    }]
}
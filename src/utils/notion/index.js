import { Client } from "@notionhq/client"
const notion = new Client({ auth: process.env.NOTION_TOKEN })


export function addText(content){
    return  [{ 
        type: "text",
        text: { 
          content: content
        },
    }]
}

export function getMessageFeedbackCode() {
  return `Feedback Qualitativo: disponível no Pull Request no GitHub (Pode fechar o Pull Request depois de ler, clicando em Close Pull Request.) "`;
}

export function createTemplateRequisitesEvaluationProject(student) {
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

export function createTemplateRequestProject(projectInfo) {
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
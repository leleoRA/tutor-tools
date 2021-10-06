export function addText(content, annotations = {}) {
  return [
    {
      type: 'text',
      text: {
        content,
      },
      annotations,
    },
  ]
}

export function getMessageFeedbackCode() {
  return `Feedback Qualitativo: disponível no Pull Request no GitHub (Pode fechar o Pull Request depois de ler, clicando em Close Pull Request.) `
}

export function createTemplateRequisitesEvaluationProject(student) {
  const requestProjectFormated = student.requisitesReview.map((requisite) => ({
    type: 'bulleted_list_item',
    bulleted_list_item: {
      text: addText(`${requisite.description}: ${requisite.evaluation}`),
    },
  }))
  return requestProjectFormated
}

export function createTemplateRequestProject(projectInfo) {
  const requestProjectFormated = projectInfo.requisites.map((request) => {
    if (request.note === undefined) {
      return {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          text: [
            {
              type: 'text',
              text: {
                content: request.description,
              },
            },
          ],
        },
      }
    }
    return {
      type: 'toggle',
      toggle: {
        text: [
          {
            type: 'text',
            text: {
              content: request.description,
            },
          },
        ],
        children: [
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
              text: [
                {
                  type: 'text',
                  text: {
                    content: request.note,
                  },
                },
              ],
            },
          },
        ],
      },
    }
  })
  return requestProjectFormated
}
export function getColorForEvaluationString(evaluation) {
  if (evaluation.toLowerCase() === 'acima das expectativas') {
    return 'blue'
  }
  if (evaluation.toLowerCase() === 'abaixo das expectativas') {
    return 'yellow'
  }
  return 'gray'
}

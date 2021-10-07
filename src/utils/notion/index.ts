import { Annotations, RichText } from '@notionhq/client/build/src/api-types.js'
import { IprojectInfo, Istudent } from '../../interfaces'

interface BulletedListItemBlock {
  type: string
  // eslint-disable-next-line camelcase
  bulleted_list_item: {
    text: RichText[]
  }
}

interface ITemplateRequisiteToogleBlock {
  type: string
  toggle: {
    text: RichText[]
    children?: BulletedListItemBlock[]
  }
}
export function addText(
  content: string,
  annotations: Annotations = {
    bold: false,
    italic: false,
    underline: false,
    code: false,
    strikethrough: false,
    color: 'default',
  }
): RichText[] {
  return [
    {
      type: 'text',
      text: {
        content,
      },
      annotations,
      plain_text: '',
    },
  ]
}

export function getMessageFeedbackCode(): string {
  return `Feedback Qualitativo: disponível no Pull Request no GitHub (Pode fechar o Pull Request depois de ler, clicando em Close Pull Request.) `
}

export function createTemplateRequisitesEvaluationProject(
  student: Istudent
): BulletedListItemBlock[] {
  const requestProjectFormated = student.requisitesReview.map((requisite) => ({
    type: 'bulleted_list_item',
    bulleted_list_item: {
      text: addText(`${requisite.description}: ${requisite.evaluation}`),
    },
  }))
  return requestProjectFormated
}

export function createTemplateRequestProject(
  projectInfo: IprojectInfo
): Array<BulletedListItemBlock | ITemplateRequisiteToogleBlock> {
  const requestProjectFormated = projectInfo.requisites.map((request) => {
    if (request.note === undefined) {
      return {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          text: addText(request.description),
        },
      }
    }
    return {
      type: 'toggle',
      toggle: {
        text: addText(request.description),
        children: [
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
              text: addText(request.note),
            },
          },
        ],
      },
    }
  })
  return requestProjectFormated
}
export function getColorForEvaluationString(evaluation: string): string {
  if (evaluation.toLowerCase() === 'acima das expectativas') {
    return 'blue'
  }
  if (evaluation.toLowerCase() === 'abaixo das expectativas') {
    return 'yellow'
  }
  return 'gray'
}

import {
  Annotations,
  RichText,
  BulletedListItemBlock,
  ToggleBlock,
} from '@notionhq/client/build/src/api-types.js'
import { v4 as uuid } from 'uuid'
import { IprojectInfo, Istudent } from '../../interfaces'

const optionsDefault = {
  id: uuid(),
  created_time: new Date().toISOString(),
  last_edited_time: new Date().toISOString(),
  archived: false,
}

export function addText(content: string, annotationsParam = null): RichText[] {
  const annotations: Annotations = {
    bold: false,
    italic: false,
    underline: false,
    code: false,
    strikethrough: false,
    color: 'default',
  }
  if (annotationsParam) {
    Object.keys(annotationsParam).forEach((key) => {
      annotations[key] = annotationsParam[key]
    })
  }
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
  const requestProjectFormated = student.requisitesReview.map((requisite) => {
    const bullet: BulletedListItemBlock = {
      ...optionsDefault,
      object: 'block',
      has_children: true,
      type: 'bulleted_list_item',
      bulleted_list_item: {
        text: addText(`${requisite.description}: ${requisite.evaluation}`),
      },
    }

    return bullet
  })
  return requestProjectFormated
}

export function createTemplateRequestProject(
  projectInfo: IprojectInfo
): Array<BulletedListItemBlock | ToggleBlock> {
  const requestProjectFormated = projectInfo.requisites.map((request) => {
    if (request.note === undefined) {
      const bullet: BulletedListItemBlock = {
        ...optionsDefault,
        object: 'block',
        has_children: true,
        type: 'bulleted_list_item',
        bulleted_list_item: {
          text: addText(request.description),
        },
      }
      return bullet
    }
    const toggle: ToggleBlock = {
      ...optionsDefault,
      object: 'block',
      has_children: true,
      type: 'toggle',
      toggle: {
        text: addText(request.description),
        children: [
          {
            ...optionsDefault,
            object: 'block',
            has_children: true,
            type: 'bulleted_list_item',
            bulleted_list_item: {
              text: addText(request.note),
            },
          },
        ],
      },
    }
    return toggle
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

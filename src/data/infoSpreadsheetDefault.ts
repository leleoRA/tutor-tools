import { convertLetterInNumber } from '../utils/tools/index'

export const columnsReferenceDefault = {
  endColumn: convertLetterInNumber('R'),
  nameColumn: convertLetterInNumber('A'),
  tutorColumn: convertLetterInNumber('B'),
  linksColumn: convertLetterInNumber('C'),
  linksColumn2: convertLetterInNumber('D'),
}

export const rowsReferenceDefault = {
  startRowSheet: 3,
  endRowSheet: 52,
  rowRequisit: 1,
}

export function convertLetterInNumber(letter) {
  /*
  97 is the letter 'a'. Then, if letter is 'a',
  so return 0, if b return 1 ...
  */

  const number = letter.toLowerCase().charCodeAt() - 97

  return number
}

export function extractIdByUrlSpreadsheet(url) {
  const id = url.split('/')[5]
  return id
}

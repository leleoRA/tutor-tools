export default function validateUserInput(index: number) {
  const isIndexValid = index + 1 > 0
  if (!isIndexValid) process.exit(1)
}

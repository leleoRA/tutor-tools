export function formatedTutors(tutors, studentsInfo) {
  const tutorInfo = []
  tutors.forEach((tutor) => {
    const students = []
    studentsInfo.forEach((student) => {
      if (tutor.toLowerCase() === student.tutor?.toLowerCase()) {
        students.push(student)
      }
    })
    tutorInfo.push({
      name: tutor,
      students,
    })
  })
  return tutorInfo
}
export function convertRequisiteEvaluation(evaluation) {
  if (evaluation === 0) return 'Requisitos entregues totalmente'
  if (evaluation === 1) return 'Requisitos entregues parcialmente'
  return 'Requisitos não entregues'
}

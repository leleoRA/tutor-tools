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

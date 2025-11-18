// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  const deptIT = await prisma.department.create({
    data: {
      name: 'Комп\'ютерні науки',
      description: 'комп\'ютерні науки та інформаційні технології',
    },
  })

  const deptEcon = await prisma.department.create({
    data: {
      name: 'Математика',
      description: 'Прикладна математика та економіка',
    },
  })

  const groupKN = await prisma.group.create({
    data: {
      name: 'KN1-b24',
      courseYear: 2,
      departmentId: deptIT.id,
    },
  })

  const groupKN2 = await prisma.group.create({
    data: {
      name: 'KNms1-b24',
      courseYear: 3,
      departmentId: deptEcon.id,
    },
  })

  const teacher1 = await prisma.teacher.create({
    data: {
      fullName: 'Vitaliy Ivaniuk',
      email: 'wivanyuk@kpnu.edu.ua',
    },
  })

  const teacher2 = await prisma.teacher.create({
    data: {
      fullName: 'Maruna Miastkovska',
      email: 'myastkovska.maryna@kpnu.edu.ua',
    },
  })

  const subjectOOP = await prisma.subject.create({
    data: {
      name: 'Програмування',
      credits: 5,
      teacherId: teacher1.id,
    },
  })

  const subjectMath = await prisma.subject.create({
    data: {
      name: 'Основи тестування',
      credits: 6,
      teacherId: teacher2.id,
    },
  })

  const student1 = await prisma.student.create({
    data: {
      firstName: 'Олександр',
      lastName: 'Пилипенко',
      email: 'knms1b24.pylypenko@kpnu.edu.ua',
      groupId: groupKN2.id, 
    },
  })

  const student2 = await prisma.student.create({
    data: {
      firstName: 'Юліана',
      lastName: 'Некрасова',
      email: 'knms1b24.nekrasova@kpnu.edu.ua',
      groupId: groupKN2.id, 
    },
  })

  const student3 = await prisma.student.create({
    data: {
      firstName: 'Ярослав',
      lastName: 'Білий',
      email: 'knms1b24.bilyk@kpnu.edu.ua',
      groupId: groupKN2.id, 
    },
  })

  await prisma.grade.create({
    data: {
      value: 95,
      comment: 'Відмінно',
      studentId: student1.id,
      subjectId: subjectOOP.id,
    },
  })

  await prisma.grade.create({
    data: {
      value: 82,
      comment: 'Добре',
      studentId: student2.id,
      subjectId: subjectMath.id,
    },
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
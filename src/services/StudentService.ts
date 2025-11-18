import { prisma } from '../lib/prisma';

export class StudentService {
  
  async getAllStudents() {
    return await prisma.student.findMany({
      include: { group: true } // Join with Group table
    });
  }

  async createStudent(data: { firstName: string; lastName: string; email: string; groupId: number }) {
    return await prisma.student.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        groupId: data.groupId
      }
    });
  }

  async deleteStudent(id: number) {
    return await prisma.student.delete({
      where: { id }
    });
  }
}
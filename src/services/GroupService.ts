// services/GroupService.ts
import { prisma } from '../lib/prisma';

export class GroupService {
  async getGroupById(id: number) {
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        students: true, // Завантажити студентів цієї групи
        department: true, // Завантажити назву факультету
      },
    });

    const subjects = await prisma.subject.findMany({
        include: { teacher: true }
    });

    return { group, subjects };
  }
}
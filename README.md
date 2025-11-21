Використання ООП та класів у програмі
```
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

  async getStudentById(id: number) {
    return await prisma.student.findUnique({
      where: { id },
      include: {
        group: {
          include: {
            department: true // Щоб знати факультет
          }
        },
        grades: {
          include: {
            subject: {
              include: {
                teacher: true // Щоб знати, хто поставив оцінку
              }
            }
          }
        }
      }
    });
  }
}
```

Застосування реляційної бази данних у програмі
'

model Department {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  groups      Group[]  
}

model Group {
  id           Int        @id @default(autoincrement())
  name         String     // knms1-b24
  courseYear   Int        // 3 year
  departmentId Int
  department   Department @relation(fields: [departmentId], references: [id])
  students     Student[]  
}
model Student {
  id          Int      @id @default(autoincrement())
  firstName   String
  lastName    String
  email       String   @unique
  phone       String?
  dateOfBirth DateTime?
  
  groupId     Int
  group       Group    @relation(fields: [groupId], references: [id])
  
  grades      Grade[]  
  createdAt   DateTime @default(now())
}
model Subject {
  id          Int      @id @default(autoincrement())
  name        String   
  credits     Int?     
  
  teacherId   Int?
  teacher     Teacher? @relation(fields: [teacherId], references: [id])
  
  grades      Grade[]
}

model Teacher {
  id        Int       @id @default(autoincrement())
  fullName  String
  email     String    @unique
  subjects  Subject[]
}

model Grade {
  id        Int      @id @default(autoincrement())
  value     Int      // 0-100
  comment   String? 
  date      DateTime @default(now())
  
  studentId Int
  student   Student  @relation(fields: [studentId], references: [id])
  
  subjectId Int
  subject   Subject  @relation(fields: [subjectId], references: [id])
}
'


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { StudentService } from '../../services/StudentService';

interface Grade {
  id: number;
  value: number;
  comment: string | null;
  date: string;
  subject: {
    name: string;
    credits: number;
    teacher?: {
      fullName: string;
    };
  };
}

interface StudentDetail {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  group: {
    name: string;
    department: {
      name: string;
    };
  };
  grades: Grade[];
}

interface PageProps {
  student: StudentDetail;
  error?: string;
}

export default function StudentPage({ student, error }: PageProps) {
  
  if (error) {
    return (
      <div className="p-8 text-red-600 border border-red-600 bg-red-50 max-w-md mx-auto mt-10">
        <h1 className="font-bold text-lg">Помилка</h1>
        <p>{error}</p>
        <Link href="/" className="underline mt-4 block">На головну</Link>
      </div>
    );
  }

  const averageGrade = student.grades.length > 0
    ? (student.grades.reduce((sum, g) => sum + g.value, 0) / student.grades.length).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen p-8 bg-white text-black">
      <Head>
        <title>{student.lastName} {student.firstName} | Картка студента</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        
        {/* Верхня панель навігації */}
        <div className="mb-6 flex justify-between items-center border-b border-gray-400 pb-4">
          <h1 className="text-2xl font-bold">Картка студента</h1>
          <Link href="/" className="text-blue-600 underline hover:text-blue-800">
             &larr; До списку студентів
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Ліва колонка: Особисті дані */}
          <div className="md:col-span-1 border border-gray-400 p-4 h-fit">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-400 pb-2">Інформація</h2>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-600">ПІБ:</label>
              <p className="font-bold text-lg">{student.lastName} {student.firstName}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600">Факультет:</label>
              <p>{student.group.department.name}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600">Група:</label>
              <span className="inline-block border border-black px-2 py-1 text-sm font-bold">
                {student.group.name}
              </span>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600">Email:</label>
              <p className="text-blue-600 underline">{student.email}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-400">
              <label className="block text-sm text-gray-600">Середній бал:</label>
              <p className="text-3xl font-bold">{averageGrade}</p>
            </div>
          </div>

          <div className="md:col-span-2 border border-gray-400 p-4">
            <div className="flex justify-between items-center mb-4 border-b border-gray-400 pb-2">
              <h2 className="text-lg font-bold">Журнал успішності</h2>
            </div>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 p-2 text-left">Предмет</th>
                  <th className="border border-gray-400 p-2 text-center">Бали</th>
                  <th className="border border-gray-400 p-2 text-left">Викладач</th>
                  <th className="border border-gray-400 p-2 text-left">Дата</th>
                </tr>
              </thead>
              <tbody>
                {student.grades.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="border border-gray-400 p-4 text-center text-gray-500">
                      Записів про оцінки ще немає
                    </td>
                  </tr>
                ) : (
                  student.grades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="border border-gray-400 p-2 font-medium">
                        {grade.subject.name}
                        <span className="block text-xs text-gray-500">
                          Кредитів: {grade.subject.credits}
                        </span>
                      </td>
                      <td className="border border-gray-400 p-2 text-center font-bold text-lg">
                        {grade.value}
                      </td>
                      <td className="border border-gray-400 p-2">
                        {grade.subject.teacher?.fullName || '—'}
                      </td>
                      <td className="border border-gray-400 p-2 text-gray-600">
                        {new Date(grade.date).toLocaleDateString('uk-UA')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;

  if (!id || Array.isArray(id) || isNaN(Number(id))) {
    return { props: { error: "Некоректний ID студента" } };
  }

  try {
    const studentService = new StudentService();
    const studentData = await studentService.getStudentById(Number(id));

    if (!studentData) {
      return { notFound: true };
    }

    // Серіалізація (Prisma повертає об'єкти Date, які Next.js не може передати напряму)
    const student = JSON.parse(JSON.stringify(studentData));

    return {
      props: { student },
    };
  } catch (e) {
    return { props: { error: "Помилка сервера при завантаженні даних" } };
  }
};
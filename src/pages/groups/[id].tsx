import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { GroupService } from '../../services/GroupService';

// Типізація даних (Інтерфейси)
interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Subject {
    id: number;
    name: string;
    credits: number;
    teacher?: {
        fullName: string;
    }
}

interface GroupData {
  id: number;
  name: string;
  department: { name: string };
  students: Student[];
}

interface PageProps {
  group: GroupData;
  subjects: Subject[];
  error?: string;
}

export default function GroupDetail({ group, subjects, error }: PageProps) {
  
  if (error) {
    return <div className="p-10 text-red-600">Помилка: {error}</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-white text-black">
      <Head>
        <title>Група {group.name}</title>
      </Head>

     
<div className="max-w-5xl mx-auto">
<Link href="/" className="text-blue-600 underline mb-4 inline-block">
        &larr; На головну
      </Link>
      {/* Заголовок Групи */}
      <div className="w-full mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold">Група: {group.name}</h1>
        <p>Факультет: {group.department.name}</p>
        <p>Кількість студентів: {group.students.length}</p>
      </div>

      <div className="w-full">
        
        {/* Ліва колонка: Список студентів */}
        <div className='w-full mt-4'>
          <h2 className="text-xl font-bold mb-4">Студенти</h2>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-2 text-left">ID</th>
                <th className="border border-gray-400 p-2 text-left">Ім'я</th>
                <th className="border border-gray-400 p-2 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {group.students.length === 0 ? (
                <tr>
                  <td colSpan={3} className="border border-gray-400 p-2 text-center">
                    Студентів немає
                  </td>
                </tr>
              ) : (
                group.students.map((st) => (
                  <tr key={st.id}>
                    <td className="border border-gray-400 p-2">{st.id}</td>
                    <td className="border border-gray-400 p-2">
                        {st.lastName} {st.firstName}
                    </td>
                    <td className="border border-gray-400 p-2">{st.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Права колонка: Предмети (Навчальний план) */}
        <div className='mt-4'>
          <h2 className="text-xl font-bold mb-4">Предмети (План)</h2>
          <ul className="list-disc pl-5 border p-4 border-gray-400">
            {subjects.map((subj) => (
                <li key={subj.id} className="mb-2">
                    <span className="font-bold">{subj.name}</span> 
                    <span className="text-sm text-gray-600 ml-2">({subj.credits} кредитів)</span>
                    <div className="text-sm italic">
                        Викладач: {subj.teacher?.fullName || 'Не призначено'}
                    </div>
                </li>
            ))}
          </ul>
        </div>
</div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Отримуємо ID з URL (наприклад /groups/1 -> id = 1)
  const id = context.params?.id;

  if (!id || Array.isArray(id)) {
    return { notFound: true };
  }

  const groupService = new GroupService();
  
  // Конвертуємо string ID в number
  const groupData = await groupService.getGroupById(Number(id));

  if (!groupData.group) {
    return {
        props: { error: "Групу не знайдено" }
    };
  }

  // Серіалізація даних (JSON hack для дат та об'єктів Prisma)
  return {
    props: {
      group: JSON.parse(JSON.stringify(groupData.group)),
      subjects: JSON.parse(JSON.stringify(groupData.subjects)),
    },
  };
};
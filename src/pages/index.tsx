import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useHttpClient } from '../hooks/http';
import { StudentService } from '../services/StudentService';
interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  group: {
    id: number;
    name: string;
  };
}

interface PageProps {
  students: Student[];
}

export default function StudentsList({ students }: PageProps) {
  const [studentsState, setStudents] = useState<Student[]>(students);
  const { sendReq } = useHttpClient();
  
  function deleteStudent(id: number) {
    sendReq({ path: `students`, method: 'DELETE', body: JSON.stringify({ id }) });

    setStudents(studentsState.filter((student) => student.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head>
        <title>Облік студентів фізико-математичного факультету</title>
      </Head>

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Реєстр студентів</h1>
            <p className="text-gray-500">Керування та перегляд усіх студентів з фізико-математичного факультету</p>
          </div>
          <Link 
            href="/students/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          >
            + Додати студента
          </Link>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Прізвище та ім'я
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Група
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody>
              {studentsState.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-500">
                    Не знайдено студентів.
                  </td>
                </tr>
              ) : (
                studentsState.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                          <Link href={`/students/${student.id}`}>{student.lastName} {student.firstName}</Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{student.email}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                        <span className="relative"><Link href={`/groups/${student.group?.id}`}>{student.group?.name || 'No Group'}</Link></span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button onClick={() => alert('Ви не має права адміністратора')} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const studentService = new StudentService();
  const rawStudents = await studentService.getAllStudents();

  const students = JSON.parse(JSON.stringify(rawStudents));

  return {
    props: {
      students,
    },
  };
};
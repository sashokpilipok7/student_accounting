import type { NextApiRequest, NextApiResponse } from 'next';
import { StudentService } from '../../services/StudentService';

const studentService = new StudentService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  console.log("🟢 [API] Received Body:", req.body);
  if (req.method === 'GET') {
    try {
      const students = await studentService.getAllStudents();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch students', body: error });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const { firstName, lastName, email, groupId } = req.body;
      const newStudent = await studentService.createStudent({
        firstName,
        lastName,
        email,
        groupId: typeof groupId === 'number' ? groupId : Number(groupId)
      });
      console.log("🟢 [API] Created Student:", newStudent);
      res.status(201).json(newStudent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create student', body: error });
    }
  } 

  else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      const deletedStudent = await studentService.deleteStudent(id);
      res.status(200).json(deletedStudent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete student', body: error });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
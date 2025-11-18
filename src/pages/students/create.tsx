import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useHttpClient } from "../../hooks/http";
import { toast } from "react-toastify";
import Link from "next/link";

interface IFormInput {
    firstName: string;
    lastName: string;
    email: string;
    groupId: string;
  }

function CreateStudent() {
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const { sendReq } = useHttpClient();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const submitHandler = async (data: IFormInput) => {
        setIsLoading(true);
        try {
            const response = await sendReq({ path: "students", method: "POST", body: JSON.stringify(data) });
            router.push("/");
        } catch (error) {
            setError("Failed to create student");
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
     <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto border border-gray-400 bg-white">
        
     
        <div className="px-6 py-4 border-b border-gray-400 flex justify-between items-center">
          <h1 className="text-xl font-bold">Створення студента</h1>
          <Link href="/" className="text-sm text-blue-600 underline">
             &larr; Назад до списку
          </Link>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            
            {/* Ім'я */}
            <div>
              <label className="block text-sm font-bold mb-1">Ім'я</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-400"
                placeholder="Іван" 
                {...register("firstName", { required: true })} 
              />
              {errors.firstName && <span className="text-red-600 text-xs">Це поле є обов'язковим</span>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Прізвище</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-400"
                placeholder="Іванов" 
                {...register("lastName", { required: true })} 
              />
              {errors.lastName && <span className="text-red-600 text-xs">Це поле є обов'язковим</span>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Email</label>
              <input 
                type="email" 
                className="w-full p-2 border border-gray-400"
                placeholder="ivan@example.com" 
                {...register("email", { required: true })} 
              />
              {errors.email && <span className="text-red-600 text-xs">Це поле є обов'язковим</span>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">ID Групи</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-400"
                placeholder="наприклад: 1" 
                {...register("groupId", { required: true, valueAsNumber: true })} 
              />
              <p className="text-xs text-gray-500 mt-1">Введіть ID існуючої групи</p>
              {errors.groupId && <span className="text-red-600 text-xs">Це поле є обов'язковим</span>}
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 hover:bg-blue-700"
              >
                {isLoading ? 'Збереження...' : 'Створити студента'}
              </button>
            </div>

            {error && (
              <div className="p-3 border border-red-600 bg-red-50 text-red-700 text-sm">
                Помилка: {error}
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
      );
}

export default CreateStudent;

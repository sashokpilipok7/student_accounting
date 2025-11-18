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
        <div className="min-h-screen bg-gray-100 p-8">
    
          <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">Create New Student</h1>
              <Link href="/" className="text-sm text-blue-600 hover:underline">
                 &larr; Back to List
              </Link>
            </div>
    
            <div className="p-6">
              <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ivan" 
                    {...register("firstName", { required: true })} 
                  />
                  {errors.firstName && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
    
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ivanov" 
                    {...register("lastName", { required: true })} 
                  />
                  {errors.lastName && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
    
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ivan@example.com" 
                    {...register("email", { required: true })} 
                  />
                  {errors.email && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
    
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Group ID</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 1" 
                    {...register("groupId", { required: true, valueAsNumber: true })} 
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the ID of an existing group (e.g. 1 or 2)</p>
                  {errors.groupId && <span className="text-red-500 text-xs">This field is required</span>}
                </div>
    
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Saving...' : 'Create Student'}
                  </button>
                </div>
    
                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded relative text-sm">
                    {error}
                  </div>
                )}
    
              </form>
            </div>
          </div>
        </div>
      );
}

export default CreateStudent;

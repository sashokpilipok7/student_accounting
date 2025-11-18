import { useState, useCallback } from "react";
import { toast } from "react-toastify";

const defaultHeaders = {
  "Content-Type": "application/json",
};

console.log(process.env.NEXT_PUBLIC_API_URL);

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface SendReqParams {
  path: string;
  method?: HttpMethod;
  body?: BodyInit | null;
  headers?: HeadersInit;
}


export function useHttpClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendReq = useCallback(async ({ path, method = "GET", body, headers = defaultHeaders }: SendReqParams) => {
    setIsLoading(true);
    const httpAbortController = new AbortController() as AbortController & { signal: AbortSignal };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, {
        method,
        headers,
        body,
        signal: httpAbortController.signal,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error);
      }

      if (method === "POST" || method === "PUT") {
        toast.success("Success!");
      }
      setIsLoading(false);
      return responseData;
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Something went wrong!");
      setError((err as Error).message);
      setIsLoading(false);
      return err as Error;
    }
  }, []);

  function clearError() {
    setError(null);
  }

  return { isLoading, error, sendReq, clearError };
}
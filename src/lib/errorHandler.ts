import { isAxiosError } from "axios";

export default async function errorHandler(promise: Promise<any>) {
  try {
    return await promise;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error:", error?.response?.data);
      throw new Error(error?.response?.data?.error);
    }
    console.error("Error:", error);
    throw new Error("An error occurred while processing your request.");
  }
}

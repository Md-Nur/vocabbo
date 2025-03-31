export default async function errorHandler(promise: Promise<any>) {
  try {
    return await promise;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred while processing your request.");
  }
}

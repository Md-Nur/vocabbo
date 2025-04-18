import { AxiosError, isAxiosError } from "axios";
import Title from "./Title";

const ErrorPage = ({
  error,
  title,
}: {
  error: AxiosError | Error;
  title?: string;
}) => {
  return (
    <div className="w-full my-20 flex flex-col items-center justify-center">
      <Title>{title || "Error"}</Title>
      <div className="text-center text-error my-10 text-2xl">
        {isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : error?.message || "Something went wrong"}
      </div>
    </div>
  );
};

export default ErrorPage;

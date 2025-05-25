import axios from "axios";
import { StudentRegisterProps } from "../../types/auth-type";

const registerStudentForm = async (studentForm: StudentRegisterProps) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      studentForm
    );

    return data.result;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export { registerStudentForm };

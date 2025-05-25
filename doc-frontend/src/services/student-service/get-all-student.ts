import axios from "axios";

const getAllStudents = async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/student`);

    return data.users;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export { getAllStudents };
 
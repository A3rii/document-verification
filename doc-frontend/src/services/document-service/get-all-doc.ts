import axios from "axios";

const getAllDocument = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/document`
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

export { getAllDocument };

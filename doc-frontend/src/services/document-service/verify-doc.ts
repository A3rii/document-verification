import axios from "axios";

const verifyDocumentHash = async (hash: string) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/document/verify/${hash}`
    );

    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export { verifyDocumentHash };

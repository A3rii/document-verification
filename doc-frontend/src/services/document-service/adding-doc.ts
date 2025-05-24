import axios from "axios";
import { DocumentProps } from "../../types/doc-types";

const addingDocument = async (documentForm: DocumentProps) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/document`,
      documentForm
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

export { addingDocument };

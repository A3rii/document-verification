import axios from "axios";

const updateDocumentAccessStatus = async (docHash: string, status: boolean) => {
  try {
    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}/qrcode/status`,
      {
        docHash,
        status,
      }
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
export { updateDocumentAccessStatus };

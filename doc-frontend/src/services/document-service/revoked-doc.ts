import axios from "axios";

const revokedDocument = async (trxId: string) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/document/revoked`,
      trxId
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

export { revokedDocument };
                                                   
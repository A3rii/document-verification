import axios from "axios";

const getQrFootPrintStatus = async (studentId: string) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/qrcode/${studentId}`
    );

    return data.result.isPublic;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};


export { getQrFootPrintStatus};

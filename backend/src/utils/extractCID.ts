const extractCID = (cid: string): string => {
  const cidExtraction = cid.replace("ipfs://", "");
  const splitCID = cidExtraction.split("/");

  return splitCID[0];
};
export { extractCID };

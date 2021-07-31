export const resizeImage = (imgUrl: string, size: string): string => {
  if (!imgUrl) return "";
  const resizedImage = imgUrl.replace(/\/[0-9]*?x?[0-9]*px\//, `/${size}/`);
  return resizedImage;
};

export const getImageExtension = (imgUrl: string): string => {
  const regexResult = imgUrl.match(/.*\.(jp(e)?g|png).*/);
  return regexResult?.length > 1 ? regexResult[1] : "";
};

export const convertToWebP = (imgUrl: string, currentExtension?: string) => {
  if (!imgUrl) return "";
  let extension = currentExtension;
  if (!extension) extension = getImageExtension(imgUrl);
  return imgUrl.replace(`.${extension}`, ".webp");
};

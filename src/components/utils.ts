import { getResizedImage, getWebPUrl } from "../utils/dotCMS";
import { resizeImage, convertToWebP } from "..//utils/widenCDN";
import { NO_IMAGE_PLACEHOLDER_URL } from "./constant";
import { ISrcSet } from "./Image.types";

export const IMAGE_WEBP_TYPE = "image/webp";

export const handleResizeImage = (
  imageSrc: string,
  imageSize: string,
  isFromDotCMS: boolean
): string =>
  isFromDotCMS
    ? getResizedImage(imageSrc, imageSize)
    : resizeImage(imageSrc, imageSize);

export const handleConversionToWebP = (
  imageSrc: string,
  currentExtension: string,
  isFromDotCMS: boolean
): string =>
  isFromDotCMS
    ? getWebPUrl(imageSrc)
    : convertToWebP(imageSrc, currentExtension);

export const checkForWebP = (
  type: string,
  extension: string,
  src: string,
  isFromDotCMS: boolean
): string =>
  type === "image/webp" && extension !== "webp"
    ? handleConversionToWebP(src, extension, isFromDotCMS)
    : src;

export const adjustImageSize = (
  imgSize: string,
  pixelRatio: number,
  isFromDotCMS: boolean
): string => {
  if (!imgSize || !pixelRatio) return "";
  if (isFromDotCMS) return (Number(imgSize) * pixelRatio).toString();

  const [imgWidth, imgHeight] = imgSize.split("x");
  const width = pixelRatio * Number(imgWidth.replace(/\D/g, ""));
  const height = pixelRatio * Number(imgHeight.replace(/\D/g, ""));
  return `${width}x${height}px`;
};

export const getFallbackSrcSet = (srcSetObj: ISrcSet): string =>
  srcSetObj.imgSize
    ? resizeImage(NO_IMAGE_PLACEHOLDER_URL, srcSetObj.imgSize)
    : NO_IMAGE_PLACEHOLDER_URL;

export const getSrcSet = (
  { imgSize, customUrl }: ISrcSet,
  pixelRatio: number,
  isFromDotCMS: boolean,
  isFallback: boolean,
  fallbackImage: string,
  extension: string,
  src: string,
  type?: string
): string => {
  if (imgSize) {
    return handleResizeImage(
      checkForWebP(type, extension, src, isFromDotCMS),
      adjustImageSize(imgSize, pixelRatio, isFromDotCMS),
      isFromDotCMS
    );
  }
  if (customUrl) {
    return isFallback ? fallbackImage || NO_IMAGE_PLACEHOLDER_URL : customUrl;
  }
  return checkForWebP(type, extension, src, isFromDotCMS);
};

export const getMedia = ({
  widthSize,
  isLargerImg,
}: ISrcSet): string | undefined =>
  widthSize
    ? `(${isLargerImg ? "min-width" : "max-width"}: ${widthSize})`
    : undefined;

export const isJustWebP = (srcSet: ISrcSet[]): boolean =>
  srcSet.length === 1 &&
  srcSet.some(
    (src) =>
      src.type === IMAGE_WEBP_TYPE &&
      !src.isLargerImg &&
      !src.imgSize &&
      !src.customUrl &&
      !src.widthSize
  );

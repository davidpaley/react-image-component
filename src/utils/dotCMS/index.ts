const CMS_API_URL = "https://auth-cityfurniture.dotcmscloud.com";
const imageAssets = `${CMS_API_URL}/contentAsset/image`;

export const getWebPFilterImage = (url: string) =>
  `${imageAssets}/${url}/fileAsset/filter/WebP/webp_q/85`;

export const getImagePath = (url: string) => `${CMS_API_URL}/dA/${url}`;

export const getWebPUrl = (url: string) =>
  `${url}/fileAsset/filter/WebP/webp_q/85`;

export const getResizedImage = (url: string, width: string) =>
  `${url}/${width}w`;

import {
  getImagePath,
  getResizedImage,
  getWebPFilterImage,
  getWebPUrl,
} from ".";

describe("imageFilters", () => {
  it("should return default image url format when using getImagePath", () => {
    const result = getImagePath("1234");
    expect(result).toEqual(
      "https://auth-cityfurniture.dotcmscloud.com/dA/1234"
    );
  });

  it("should return webp filter image url format when using getWebPUrl", () => {
    const result = getWebPUrl("1234");
    expect(result).toEqual("1234/fileAsset/filter/WebP/webp_q/85");
  });

  it("should return webp filter image url format when using getWebPFilterImage", () => {
    const result = getWebPFilterImage("1234");
    expect(result).toEqual(
      "https://auth-cityfurniture.dotcmscloud.com/contentAsset/image/1234/fileAsset/filter/WebP/webp_q/85"
    );
  });

  it("should return resize filter image url format when using getResizedImage", () => {
    const result = getResizedImage("1234", "128");
    expect(result).toEqual("1234/128w");
  });
});

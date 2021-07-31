import { convertToWebP, getImageExtension, resizeImage } from "./index";

const URL_TO_TEST =
  "https://embed.widencdn.net/img/cityfurniture/dh2dksrbv4/950x640px/G1809716593N00_MC_LEMANS_GRY_GLS_TBL_&_4_UPH_CHRS_MAIN.jpeg?keep=c&crop=0&u=m2xgp2";
const URL_WITH_WEBP_FORMAT =
  "https://embed.widencdn.net/img/cityfurniture/dh2dksrbv4/950x640px/G1809716593N00_MC_LEMANS_GRY_GLS_TBL_&_4_UPH_CHRS_MAIN.webp?keep=c&crop=0&u=m2xgp2";
const URL_RESIZED_650_120 =
  "https://embed.widencdn.net/img/cityfurniture/dh2dksrbv4/640x120px/G1809716593N00_MC_LEMANS_GRY_GLS_TBL_&_4_UPH_CHRS_MAIN.jpeg?keep=c&crop=0&u=m2xgp2";

describe("globalUtils test", () => {
  it("resizeImage function should return an empty string when url is empty", () => {
    const webPUrl = resizeImage("", "640x120px");
    expect(webPUrl).toEqual("");
  });

  it("it should re-size image", () => {
    const webPUrl = resizeImage(URL_TO_TEST, "640x120px");
    expect(webPUrl).toEqual(URL_RESIZED_650_120);
  });

  it("it should convert to webP an image url", () => {
    const webPUrl = convertToWebP(URL_TO_TEST, "jpeg");
    expect(webPUrl).toEqual(URL_WITH_WEBP_FORMAT);
  });
  it("it should convert to webP an image url without the extension", () => {
    const webPUrl = convertToWebP(URL_TO_TEST);
    expect(webPUrl).toEqual(URL_WITH_WEBP_FORMAT);
  });
  it("it should return the extension of a URL", () => {
    const extension = getImageExtension(URL_TO_TEST);
    expect(extension).toEqual("jpeg");
  });

  it("it should return an empty string when calling getImageExtension without a valid URL", () => {
    const extension = getImageExtension("pepe");
    expect(extension).toEqual("");
  });
});

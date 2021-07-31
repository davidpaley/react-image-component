import * as React from "react";
import { isElementVisible } from "../utils/isElementVisible";
import { NO_IMAGE_PLACEHOLDER_URL } from "./constant";
import { IImageProps, ISrcSet } from "./Image.types";
import {
  getMedia,
  getFallbackSrcSet,
  getSrcSet,
  isJustWebP,
  IMAGE_WEBP_TYPE,
} from "./utils";

const Image: React.ForwardRefRenderFunction<HTMLImageElement, IImageProps> = (
  {
    id,
    className,
    src,
    alt,
    role,
    title,
    fallbackImage,
    width,
    height,
    testId,
    srcSet = [
      {
        type: IMAGE_WEBP_TYPE,
      },
    ],
    defer,
    dataRef,
    imageClassName,
    dataTestId,
    fallbackSrcSet = [],
    loading: loadingHTMLProp,
    style,
    currentExtension = "jpeg",
    webpType = true,
  },
  ref
): JSX.Element => {
  const imageWrapperRef = React.useRef<HTMLDivElement>(null);
  const [imageMounted, setImageMounted] = React.useState<boolean>(false);

  const isFromDotCMS = !!src && src?.indexOf("dotcmscloud") > -1;
  const isVisible = defer ? isElementVisible(imageWrapperRef, null) : false;
  const isFallback = !src || (defer && !isVisible && !imageMounted);

  /*
   * Keep images when the user scroll (without this it would set the No Image placeholder
   * again when the image is defer and the user scroll)
   */
  const deferCheck = (): string => {
    if (!imageMounted && defer) setImageMounted(true);
    return src;
  };

  const imageProps = {
    id,
    src: isFallback ? fallbackImage || NO_IMAGE_PLACEHOLDER_URL : deferCheck(),
    alt,
    role,
    title,
    width,
    height,
    className: imageClassName,
    loading: loadingHTMLProp || undefined,
    style,
  };

  const getSrcSetImage = (
    srcSetObj: ISrcSet,
    pixelRatio: number,
    extension?: string
  ): string =>
    getSrcSet(
      srcSetObj,
      pixelRatio,
      isFromDotCMS,
      isFallback,
      fallbackImage,
      currentExtension,
      src,
      extension
    );

  return (
    <div className={className} ref={imageWrapperRef} data-testid={testId}>
      <picture>
        {!isFallback && srcSet?.length > 0 && !fallbackSrcSet.length && (
          <>
            {webpType &&
              srcSet.map((srcSetObj, index) => (
                <source
                  key={`${srcSetObj.imgSize}-${index}`}
                  media={getMedia(srcSetObj)}
                  type="image/webp"
                  srcSet={`${getSrcSetImage(
                    srcSetObj,
                    1,
                    "image/webp"
                  )} 1x, ${getSrcSetImage(srcSetObj, 2, "image/webp")} 2x`}
                />
              ))}
            {!isJustWebP(srcSet) &&
              srcSet.map((srcSetObj, index) => (
                <source
                  key={`${srcSetObj.imgSize}-${index}`}
                  media={getMedia(srcSetObj)}
                  type={srcSetObj.type ? srcSetObj.type : undefined}
                  srcSet={`${getSrcSetImage(srcSetObj, 1)} 1x, ${getSrcSetImage(
                    srcSetObj,
                    2
                  )} 2x`}
                />
              ))}
          </>
        )}
        {!!fallbackSrcSet?.length &&
          isFallback &&
          fallbackSrcSet.map((srcSetObj, index) => (
            <source
              key={`${srcSetObj.imgSize}-${index}`}
              media={getMedia(srcSetObj)}
              type={srcSetObj.type ? srcSetObj.type : undefined}
              srcSet={getFallbackSrcSet(srcSetObj)}
            />
          ))}

        <img
          {...imageProps}
          ref={ref}
          data-ref={dataRef}
          data-testid={dataTestId || (isFallback ? "fallbackImage" : "image")}
        />
      </picture>
    </div>
  );
};

Image.displayName = "Image";

export default React.forwardRef(Image);

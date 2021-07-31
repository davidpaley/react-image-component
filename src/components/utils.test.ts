import {
  handleResizeImage,
  handleConversionToWebP,
  checkForWebP,
  adjustImageSize,
  getFallbackSrcSet,
  getSrcSet,
  getMedia,
  isJustWebP,
  IMAGE_WEBP_TYPE,
} from './utils'
import { NO_IMAGE_PLACEHOLDER_URL } from './constant'

describe('Image utils', () => {
  describe('getMedia', () => {
    it('should return undefined if width size is not defined', () => {
      const result = getMedia({ isLargerImg: true })
      expect(result).toBeUndefined()
    })

    it('should return min-width style if width size is defined and is larger img', () => {
      const result = getMedia({ isLargerImg: true, widthSize: '300px' })
      expect(result).toEqual('(min-width: 300px)')
    })

    it('should return max-width style if width size is defined and is not a larger img', () => {
      const result = getMedia({ isLargerImg: false, widthSize: '300px' })
      expect(result).toEqual('(max-width: 300px)')
    })
  })

  describe('adjustImageSize', () => {
    it('should return empty if imgSize is not defined', () => {
      const result = adjustImageSize(undefined, 1.5, false)
      expect(result).toEqual('')
    })

    it('should return empty if imgSize or pixelRatio is not defined or zero', () => {
      const result = adjustImageSize('300', 0, false)
      expect(result).toEqual('')
    })

    it('should return only the size number if it is from dotCms', () => {
      const result = adjustImageSize('300', 1.5, true)
      expect(result).toEqual('450')
    })

    it('should return width and height size when it has ratio and it is not from dotCms', () => {
      const result = adjustImageSize('400x300', 1.5, false)
      expect(result).toEqual('600x450px')
    })
  })

  describe('getFallbackSrcSet', () => {
    it('should return the placeholder image is imgSize is not defined', () => {
      const result = getFallbackSrcSet({})
      expect(result).toEqual(NO_IMAGE_PLACEHOLDER_URL)
    })

    it('should return the resized image url if imgSize is defined', () => {
      const result = getFallbackSrcSet({ imgSize: '218x156px' })
      expect(result).toEqual(
        'https://embed.widencdn.net/img/cityfurniture/wxhf70vcxa/218x156px/no-images-placeholder.jpeg?position=c&crop=no'
      )
    })
  })

  describe('checkForWebP', () => {
    it('should return the same src if type is different to image/webp', () => {
      const result = checkForWebP(
        'image/jpg',
        'webp',
        NO_IMAGE_PLACEHOLDER_URL,
        false
      )
      expect(result).toEqual(NO_IMAGE_PLACEHOLDER_URL)
    })

    it('should return the same src if extension is equal to webp', () => {
      const result = checkForWebP(
        'image/webp',
        'webp',
        NO_IMAGE_PLACEHOLDER_URL,
        false
      )
      expect(result).toEqual(NO_IMAGE_PLACEHOLDER_URL)
    })

    it('should return the converted image to webp for DotCMS', () => {
      const result = checkForWebP(
        'image/webp',
        'png',
        'https://assets.dotcms.com/image123',
        true
      )
      expect(result).toEqual(
        'https://assets.dotcms.com/image123/fileAsset/filter/WebP/webp_q/85'
      )
    })

    it('should return the converted image to webp when it is not for DotCMS', () => {
      const result = checkForWebP(
        'image/webp',
        'png',
        'https://widencdn.com/image123.png',
        false
      )
      expect(result).toEqual('https://widencdn.com/image123.webp')
    })
  })

  describe('handleConversionToWebP', () => {
    it('should return webp url for dotCMS', () => {
      const result = handleConversionToWebP(
        'https://assets.dotcms.com/image123',
        'webp',
        true
      )
      expect(result).toEqual(
        'https://assets.dotcms.com/image123/fileAsset/filter/WebP/webp_q/85'
      )
    })

    it('should return webp url for standard images when it is not for DotCMS', () => {
      const result = handleConversionToWebP(
        'https://widencdn.com/image123.png',
        'png',
        false
      )
      expect(result).toEqual('https://widencdn.com/image123.webp')
    })
  })

  describe('handleResizeImage', () => {
    it('should return resized image for DotCMS when isFromDotCMS is true', () => {
      const result = handleResizeImage(
        'https://assets.dotcms.com/image123',
        '800',
        true
      )
      expect(result).toEqual('https://assets.dotcms.com/image123/800w')
    })

    it('should return resized image for widencdn when isFromDotCMS is false', () => {
      const result = handleResizeImage(
        'https://embed.widencdn.net/img/cityfurniture/wxhf70vcxa/218x156px/no-images-placeholder.jpeg?position=c&crop=no',
        '300x400px',
        false
      )
      expect(result).toEqual(
        'https://embed.widencdn.net/img/cityfurniture/wxhf70vcxa/300x400px/no-images-placeholder.jpeg?position=c&crop=no'
      )
    })
  })

  describe('getSrcSet', () => {
    it('should return a resized image if imgSize attribute is defined', () => {
      const result = getSrcSet(
        { imgSize: '800', customUrl: 'https://assets.dotcms.com/image123' },
        1.5,
        true,
        false,
        NO_IMAGE_PLACEHOLDER_URL,
        'jpeg',
        'https://assets.dotcms.com/image123'
      )
      expect(result).toEqual('https://assets.dotcms.com/image123/1200w')
    })

    it('should return a fallback image if custom url', () => {
      const result = getSrcSet(
        { customUrl: 'https://assets.dotcms.com/image123' },
        1.5,
        true,
        true,
        'https://widencdn.com/image-abcd.jpg',
        'jpeg',
        'https://assets.dotcms.com/image123'
      )
      expect(result).toEqual('https://widencdn.com/image-abcd.jpg')
    })

    it('should return a fallback placeholder image when is custom url but fallbackImage is not defined', () => {
      const result = getSrcSet(
        { customUrl: 'https://assets.dotcms.com/image123' },
        1.5,
        true,
        true,
        '',
        'jpeg',
        'https://assets.dotcms.com/image123'
      )
      expect(result).toEqual(NO_IMAGE_PLACEHOLDER_URL)
    })

    it('should return the custom url when it is not fallback', () => {
      const result = getSrcSet(
        { customUrl: 'https://assets.dotcms.com/image123' },
        1.5,
        true,
        false,
        '',
        'jpeg',
        'https://assets.dotcms.com/image123/src'
      )
      expect(result).toEqual('https://assets.dotcms.com/image123')
    })

    it('should return the src converted when there is no imgSize and customUrl', () => {
      const result = getSrcSet(
        {},
        1.5,
        true,
        false,
        '',
        'jpeg',
        'https://assets.dotcms.com/image123'
      )
      expect(result).toEqual('https://assets.dotcms.com/image123')
    })
  })
})

describe('isJustWebP', () => {
  it('should return true when it is just the initializaton of the srcSet for transform to webP', () => {
    const result = isJustWebP([
      {
        type: IMAGE_WEBP_TYPE,
      },
    ])
    expect(result).toEqual(true)
  })

  it('should return false when we have a custom srcSet Array', () => {
    const result = isJustWebP([{ isLargerImg: true, widthSize: '300px' }])
    expect(result).toEqual(false)
  })
})

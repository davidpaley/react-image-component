export interface ISrcSet {
  widthSize?: string
  imgSize?: string
  type?: string
  isLargerImg?: boolean
  customUrl?: string
}

export interface IImageProps {
  id?: string
  className?: string
  title?: string
  src?: string
  alt: string
  role?: string
  onSuccess?: (imgUrl: string) => void
  onError?: (imgUrl: string) => void
  fallbackImage?: string
  height?: number | string
  width?: number | string
  testId?: string
  srcSet?: ISrcSet[]
  fallbackSrcSet?: ISrcSet[]
  preload?: boolean
  defer?: boolean
  dataRef?: string
  imageClassName?: string
  dataTestId?: string
  loading?: 'lazy' | 'eager'
  style?: React.CSSProperties
  currentExtension?: string
  webpType?: boolean
}

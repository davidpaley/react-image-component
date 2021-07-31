import * as React from "react";
import { render, screen } from "@testing-library/react";
import Image from "./Image";

let props: React.ComponentProps<typeof Image>;

const mockIntersectionObserver = () => {
  type IntersectionObserverCallback = {
    isIntersecting: boolean;
    target: Element;
    intersectionRatio: number;
  };
  const observerMap = new Map<
    Element,
    (props: IntersectionObserverCallback[]) => void
  >();
  let currentInstance: IntersectionObserver;
  const MyMock = jest.fn();
  const IntersectionObserverMock = MyMock.mockImplementation((cb, options) => {
    const instance = {
      thresholds: Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold],
      root: options.root,
      rootMargin: options.rootMargin,
      observe: jest.fn((element: Element) => {
        observerMap.set(element, cb);
      }),
      unobserve: jest.fn((element: Element) => {
        observerMap.delete(element);
      }),
      disconnect: jest.fn(),
      takeRecords: jest.fn(),
    };
    currentInstance = instance;
    return instance;
  });
  (global as any).IntersectionObserver = IntersectionObserverMock;
};

describe("Image Component", () => {
  beforeEach(() => {
    props = {
      id: "test",
      alt: "test",
      ref: null,
      src: "/test.jpg",
      fallbackImage: "/test-fallback.jpg",
      onError: jest.fn(),
      onSuccess: jest.fn(),
    };
    jest.clearAllMocks();
  });

  const renderComponent = () => render(<Image {...props} alt="test" />);

  it("should display placeholder image before loading", () => {
    const { container } = renderComponent();
    const image = container.querySelector(`#${props.id}`);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test.jpg");
  });

  it("should display image after loading", async () => {
    renderComponent();
    const image = await screen.findByTestId("image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test.jpg");
  });

  it("should display fallback image", async () => {
    props.src = undefined;
    renderComponent();
    const image = await screen.findByTestId("fallbackImage");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-fallback.jpg");
  });

  it("should render webp image sources by default", async () => {
    props.srcSet = [
      {
        widthSize: "800",
        isLargerImg: true,
      },
      {
        widthSize: "400",
        isLargerImg: false,
      },
    ];
    const { container } = renderComponent();
    const PictureContainer = container.querySelectorAll("picture source");
    /*
     * 2 sources for webp images
     * 2 sources for default images
     */
    expect(PictureContainer.length).toEqual(4);
  });

  it("should render WITHOUT webp image sources", async () => {
    props.webpType = false;
    props.srcSet = [
      {
        widthSize: "800",
        isLargerImg: true,
      },
      {
        widthSize: "400",
        isLargerImg: false,
      },
    ];
    const { container } = renderComponent();
    const PictureContainer = container.querySelectorAll("picture source");
    /*
     * No sources for webp images
     * 2 sources for default images
     */
    expect(PictureContainer.length).toEqual(2);
  });

  it("should render fallback image sources", async () => {
    props.src = undefined;
    props.fallbackSrcSet = [
      {
        widthSize: "800",
        isLargerImg: true,
        type: "image/png",
      },
      {
        widthSize: "400",
        isLargerImg: false,
      },
    ];
    const { container } = renderComponent();
    const PictureContainer = container.querySelectorAll("picture source");
    expect(PictureContainer[0]).toHaveAttribute("type", "image/png");
    expect(PictureContainer[1]).not.toHaveAttribute("type");
  });
  it("should display fallback image when Image defer prop is true", async () => {
    mockIntersectionObserver();

    props.defer = true;
    const { container } = renderComponent();
    const image = await screen.findByTestId("fallbackImage");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-fallback.jpg");
    const PictureContainer = container.querySelectorAll("picture source");
    expect(PictureContainer.length).toEqual(0);
  });
});

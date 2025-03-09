"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  JSX,
} from "react";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Markdown from "react-markdown";
import { getAIExplanation } from "@/lib/api/api";

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  genres: string[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string; // Keeping as string since API returns YYYY-MM-DD
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  isOwn?: boolean;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto py-10 md:py-20 scroll-smooth [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "absolute right-0  z-[1000] h-auto  w-[5%] overflow-hidden bg-gradient-to-l"
            )}
          ></div>

          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              "max-w-7xl mx-auto" // remove max-w-4xl if you want the carousel to span the full width of its container
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                className="last:pr-[5%] md:last:pr-[33%]  rounded-3xl"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mr-10">
          <button
            className="relative z-40 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative z-40 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  // const [aiRecommendation, setAiRecommendation] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const useOutsideClick = (
    ref: React.RefObject<HTMLElement | null>,
    callback: () => void
  ) => {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, callback]);
  };

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAiRecommendation("");
    onCardClose(index);
  };
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAiRecommendation = async () => {
    setLoading(true);
    try {
      const response = await getAIExplanation(card.title); // Call your API function
      if (response) {
        setAiRecommendation(response);
      } else {
        setAiRecommendation("No recommendation available.");
      }
    } catch (error) {
      setAiRecommendation("Error fetching recommendation.");
    }
    setLoading(false);
  };
  // Image base URLs - replace with your actual image URLs
  const backdropBaseUrl = "https://image.tmdb.org/t/p/original";
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <>
      {/* Closed card (thumbnail view) */}
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="rounded-3xl bg-gray-100 dark:bg-neutral-900 h-80 w-56 md:h-[40rem] md:w-96 overflow-hidden flex flex-col items-start justify-start relative z-10"
      >
        <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.genres[0]}` : undefined}
            className="text-white text-sm md:text-base font-medium font-sans text-left"
          >
            {card.genres[0]}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="text-white text-xl md:text-3xl font-semibold max-w-xs text-left [text-wrap:balance] font-sans mt-2"
          >
            {card.title}
          </motion.p>

          {/* Year & Rating */}
          <motion.p className="text-white text-xs md:text-sm font-medium font-sans text-left mt-1 opacity-80">
            {card.release_date ? card.release_date.split("-")[0] : "N/A"} • ⭐{" "}
            {card.vote_average?.toFixed(1) ?? "N/A"}
          </motion.p>
        </div>
        <BlurImage
          src={
            card.isOwn
              ? card.poster_path
              : `${posterBaseUrl}/${card.poster_path}`
          }
          alt={card.title}
          fill="true"
          className="object-cover absolute z-10 inset-0"
        />
      </motion.button>

      {/* Modal view when card is open */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div
            ref={containerRef}
            className="relative bg-gray-900 rounded-lg max-w-4xl w-full max-h-screen overflow-auto"
          >
            {/* Backdrop image as background */}
            <div className="relative h-64 md:h-96">
              <img
                src={
                  card.isOwn
                    ? card.backdrop_path
                    : `${backdropBaseUrl}${card.backdrop_path}`
                }
                alt={`${card.title} backdrop`}
                className="w-full h-full object-cover opacity-50"
              />
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Content area with poster and details */}
            <div className="flex flex-col md:flex-row p-6 -mt-24 relative">
              {/* Centered poster */}
              <div className="mx-auto md:mx-0 -mt-16 md:-mt-32 mb-6 md:mb-0 md:mr-6">
                <img
                  src={
                    card.isOwn
                      ? card.poster_path
                      : `${posterBaseUrl}${card.poster_path}`
                  }
                  alt={card.title}
                  className="w-48 rounded-lg shadow-lg border-4 border-gray-800"
                />
              </div>

              {/* Movie details */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {card.title}
                  </h2>

                  {/* Edit & Delete buttons (only for own cards) */}
                  {card.isOwn && (
                    <div className="flex gap-2">
                      <button
                        // onClick={}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition duration-300"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        // onClick={}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition duration-300"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>

                {card.original_title !== card.title && (
                  <h3 className="text-xl text-gray-300 mb-4">
                    {card.original_title}{" "}
                    <span className="text-sm text-gray-400">
                      ({card.genres[0]})
                    </span>
                  </h3>
                )}

                <p className="text-gray-300 mb-6">{card.overview}</p>

                {/* AI Recommendation section */}
                <div className="mt-4">
                  {!aiRecommendation && (
                    <button
                      onClick={fetchAiRecommendation}
                      disabled={loading}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
                    >
                      {loading
                        ? "Getting recommendation..."
                        : "Why should I watch this?"}
                    </button>
                  )}

                  {aiRecommendation && (
                    <div className="mt-4 bg-gray-800 p-4 rounded-lg text-gray-200">
                      <h4 className="text-lg font-medium text-purple-400 mb-2">
                        Why you might enjoy this:
                      </h4>

                      <Markdown>{aiRecommendation.toString()}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: any) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurdataurl={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};

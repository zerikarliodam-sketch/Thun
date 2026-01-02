"use client";
import { Image } from "@/components/Image";
import { Pagination } from "@/components/Pagination";
import { AppContext } from "@/context/app.context";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect, useState } from "react";

type Movie = {
  slug: string;
  thumb_url: string;
  name: string;
};

const ITEMS_PER_PAGE = 24;

export default function FavouritePage() {
  return (
    <Suspense>
      <Favourite />
    </Suspense>
  );
}

function Favourite() {
  const { state, dispatch } = useContext(AppContext);
  const [movies, setMovies] = useState<Movie[]>([]);
  const searchParams = useSearchParams();

  let page = searchParams.get("page") || 1;
  page = Number.isNaN(+page) ? 1 : +page;

  useEffect(() => {
    const idx = (+page - 1) * ITEMS_PER_PAGE;
    setMovies(state.favMovies.slice(idx, idx + ITEMS_PER_PAGE));
  }, [page, state]);

  if (!movies.length) {
    return (
      <h5 className="font-bold text-2xl text-center min-h-screen mt-24">
        Chưa có phim yêu thích nào
      </h5>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 min-h-screen">
      <h2 className="mt-24 capitalize text-3xl font-bold mb-6 md:text-4xl">
        Yêu Thích
      </h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <div key={movie.slug}>
            <div className="relative rounded-lg overflow-hidden group">
              <Icon
                icon="ph:heart-fill"
                className="absolute top-2.5 right-2.5"
                color="red"
                height={28}
              />

              <Image
                src={movie.thumb_url}
                alt={movie.name}
                className="aspect-[2/3]"
              />

              <Link
                href={`/movies/${movie.slug}`}
                className="absolute inset-0 z-10 md:hidden"
              />

              <div className="absolute inset-0 bg-black/60 hidden md:flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 duration-300">
                <button
                  className="rounded-full w-36 px-6 py-2.5 bg-red-600"
                  onClick={() =>
                    dispatch(
                      {
                        type: "REMOVE",
                        payload: { slug: movie.slug },
                      } as any
                    )
                  }
                >
                  Bỏ Thích
                </button>

                <Link
                  href={`/movies/${movie.slug}`}
                  className="rounded-full border-2 w-36 px-6 py-2.5 bg-black/70 hover:bg-primary hover:text-black"
                >
                  Chi Tiết
                </Link>
              </div>
            </div>

            <Link
              href={`/movies/${movie.slug}`}
              className="block mt-2 font-bold line-clamp-2 hover:text-primary"
            >
              {movie.name}
            </Link>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalItems={state.favMovies.length}
        totalItemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
}
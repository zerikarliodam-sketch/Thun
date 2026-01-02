"use client";
import { DOMAIN, SOCIALS_SHARING } from "@/constants";
import { ModalContext } from "@/context/modal.context";
import { Icon } from "@iconify/react";
import { useRouter } from "next-nprogress-bar";
import { usePathname } from "next/navigation";
import {
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const Modal = () => {
  const { state, dispatch } = useContext(ModalContext);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const { searchValue, videoTrailerId, modalType } = state;
  const inputRef = useRef<any>();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (modalType === "search") {
      inputRef.current?.focus();
      window.addEventListener("keydown", handleCloseOnEsc);
    }
    document.body.style.overflow = modalType ? "hidden" : "initial";

    return () => {
      window.removeEventListener("keydown", handleCloseOnEsc);
    };
  }, [modalType]);

  useEffect(() => {
    if (modalType) return;
    const timeout = setTimeout(() => {
      handleClose();
    }, 200);
    return () => clearTimeout(timeout);
  }, [modalType]);

  useEffect(() => {
    if (!isCopy) return;
    const timeout = setTimeout(() => setIsCopy(false), 3000);
    return () => clearTimeout(timeout);
  }, [isCopy]);

  const handleSearch = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      router.push(`/tim-kiem?q=${searchValue.replace(/\s+/g, "+")}`);
      dispatch({ type: "CLOSE" } as any);
    },
    [searchValue]
  );

  const handleCloseOnEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" || e.keyCode === 27) {
      handleClose();
    }
  }, []);

  const handleClose = useCallback(() => {
    dispatch({ type: "CLOSE" } as any);
  }, []);

  if (!modalType) return null;

  return (
    <div
      className="fixed z-50 inset-0 bg-black/95 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget && state.modalType !== "warning") {
          dispatch({ type: "CLOSE" } as any);
        }
      }}
    >
      {modalType !== "warning" && (
        <Icon
          icon="ic:round-close"
          height={36}
          className="absolute top-4 right-4 cursor-pointer"
          onClick={handleClose}
        />
      )}

      {modalType === "search" && (
        <form className="w-[80vw] max-w-md" onSubmit={handleSearch}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm phim, TV Shows,..."
            className="border-b-2 border-white/10 bg-transparent outline-none w-full px-0.5 py-1"
            value={searchValue}
            onChange={(e) =>
              dispatch(
                {
                  type: "SEARCH",
                  payload: { searchValue: e.target.value },
                } as any
              )
            }
          />
        </form>
      )}

      {modalType === "trailer" && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoTrailerId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="aspect-video w-full max-w-4xl"
          allowFullScreen
        />
      )}

      {modalType === "share" && (
        <div className="bg-zinc-900 rounded-lg p-6 w-[90vw] max-w-max">
          <h3 className="text-center text-2xl font-bold">Chia sẻ</h3>
          <ul className="flex gap-3 my-6 overflow-auto">
            {SOCIALS_SHARING.map((social) => (
              <button
                key={social.platform}
                onClick={() =>
                  window.open(
                    social.baseHref + encodeURIComponent(DOMAIN + pathname)
                  )
                }
              >
                <Icon
                  icon={social.icon}
                  height={56}
                  style={{ backgroundColor: social.color }}
                  className="p-3 rounded-full"
                />
              </button>
            ))}
          </ul>
        </div>
      )}

      {modalType === "warning" && (
        <div className="max-w-xl w-[90vw] bg-white text-black p-5 rounded-lg">
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => {
                router.back();
                dispatch({ type: "CLOSE" } as any);
              }}
              className="px-5 rounded-full border-primary py-2 border-2"
            >
              Quay lại
            </button>
            <button
              onClick={() => {
                dispatch(
                  { type: "CLOSE", payload: { hasShown: true } } as any
                );
                sessionStorage.setItem("display-warning", "true");
              }}
              className="px-5 rounded-full bg-primary py-2.5"
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
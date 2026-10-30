import { useEffect, useRef, useState } from "react";

export default function useInView({ threshold = 0, rootMargin = "0px 0px -8% 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);

    const raf = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.92 && r.bottom > 0) {
        setInView(true);
        io.disconnect();
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [threshold, rootMargin]);

  return [ref, inView];
}
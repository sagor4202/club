import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TranslatedText from "../components/TranslatedText";
import { useLanguage } from "../i18n/LanguageContext";

const galleryItems = [
  {
    title: "Elegance",
    type: "image",
    src: "/wp-content/uploads/2026/05/gallery-01-scaled.webp",
  },
  {
    title: "Energy",
    type: "video",
    src: "/wp-content/uploads/2026/05/gallery-02.mp4",
    poster: "/wp-content/uploads/2026/05/gallery-02.webp",
  },
  {
    title: "Style",
    type: "image",
    src: "/wp-content/uploads/2026/05/gallery-03-scaled.webp",
  },
  { title: "Vibe", type: "image", src: "/wp-content/uploads/2026/05/gallery-04-scaled.webp" },
  {
    title: "Fashion",
    type: "video",
    src: "/wp-content/uploads/2026/05/gallery-05.mp4",
    poster: "/wp-content/uploads/2026/05/gallery-05-scaled.webp",
  },
  { title: "Nightlife", type: "image", src: "/wp-content/uploads/2026/05/gallery-06-scaled.webp" },
  { title: "Glamour", type: "image", src: "/wp-content/uploads/2026/05/gallery-07-scaled.webp" },
  { title: "Spirit", type: "image", src: "/wp-content/uploads/2026/05/gallery-08-scaled.webp" },
  {
    title: "Chic",
    type: "video",
    src: "/wp-content/uploads/2026/05/gallery-09.mp4",
    poster: "/wp-content/uploads/2026/05/gallery-09-scaled.webp",
  },
  { title: "Atmosphere", type: "image", src: "/wp-content/uploads/2026/05/gallery-10-scaled.webp" },
  {
    title: "Elegance",
    type: "image",
    src: "/wp-content/themes/night-club-theme/dist/images/Markus-Schneeberger-boudoir-web-41.jpg",
  },
  {
    title: "Energy",
    type: "video",
    src: "/wp-content/themes/night-club-theme/dist/images/5805686-hd_720_1144_30fps.mp4",
  },
  {
    title: "Style",
    type: "image",
    src: "/wp-content/themes/night-club-theme/dist/images/Markus-Schneeberger-boudoir-web-50.jpg",
  },
  {
    title: "Vibe",
    type: "image",
    src: "/wp-content/themes/night-club-theme/dist/images/WhatsApp Image 2026-05-05 at 10.11.42.jpeg",
  },
  {
    title: "Fashion",
    type: "video",
    src: "/wp-content/themes/night-club-theme/dist/images/5871210-uhd_2160_3840_24fps.mp4",
  },
  {
    title: "Spirit",
    type: "image",
    src: "/wp-content/themes/night-club-theme/dist/images/kathi-boudoir-vorschau-129.jpg",
  },
];

const destinations = [
  {
    city: "Braunau",
    name: "Pascha Laufhaus - Braunau Am Inn",
    img: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=1600&q=80",
    mapLink: "https://maps.app.goo.gl/gM9w6F5DfrXGDjsi9",
  },
  {
    city: "Salzburg",
    name: "pascha Laufhaus - Salzburg",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
    mapLink: "https://maps.app.goo.gl/Qb6ShHv4Z7o1EK6L6",
  },
  {
    city: "Salzburg",
    name: "Pascha nightclub - Salzburg",
    img: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1600&q=80",
    mapLink: "https://maps.app.goo.gl/Qb6ShHv4Z7o1EK6L6",
  },
];

const SERVICE_CARD_COPY = [
  "We offer a calm, discreet, and high-comfort environment designed for guests who value privacy, relaxation, and top-class service. Our facility is located in a safe and peaceful area, ensuring a fully secure and comfortable experience for every visitor. Our team is professional, well-trained, and dedicated to providing excellent service with full attention to guest satisfaction. We maintain the highest standards of hygiene and cleanliness throughout the premises. We welcome guests from different backgrounds and ensure a respectful, comfortable atmosphere for everyone. We provide a secure and discreet environment along with free private parking for the convenience of our guests. High standards of hygiene and cleanliness are maintained at all times, ensuring a fresh and well-kept setting. Our rooms are comfortable, well-maintained, and designed to offer a relaxing stay. Professional and friendly staff are always available to ensure a smooth and pleasant experience. Your privacy, safety, and comfort are always our top priorities.",
  "We offer a calm, discreet, and high-comfort environment designed for guests who value privacy, relaxation, and top-class service. Our facility is located in a safe and peaceful area, ensuring a fully secure and comfortable experience for every visitor. Our team is professional, well-trained, and dedicated to providing excellent service with full attention to guest satisfaction. We maintain the highest standards of hygiene and cleanliness throughout the premises. We welcome guests from different backgrounds and ensure a respectful, comfortable atmosphere for everyone. We provide a secure and discreet environment along with free private parking for the convenience of our guests. High standards of hygiene and cleanliness are maintained at all times, ensuring a fresh and well-kept setting. Our rooms are comfortable, well-maintained, and designed to offer a relaxing stay. Professional and friendly staff are always available to ensure a smooth and pleasant experience. Your privacy, safety, and comfort are always our top priorities.",
  "Welcome to Pascha Salzburg – Nightclub and bar, your exclusive table dance nightclub and brothel in the picturesque city of Salzburg! We have 30-40 seductive, multicultural women on hand daily. Our establishment offers a unique combination of first-class entertainment and discreet service.\n\nExpect breathtaking striptease shows, lap dances, and table dances performed with passion and professionalism by our talented dancers. Enjoy the sensual atmosphere of Pascha and let yourself be seduced by our top international ladies, whose lineup changes weekly.\n\nThe establishment offers discreet parking to ensure your visit is as relaxed as possible. We place great importance on your privacy and discretion, so you can feel completely at ease.\nVisit us in the heart of Salzburg and experience unforgettable nights filled with eroticism and entertainment. Leave the everyday behind and immerse yourself in the world of Pascha Salzburg. We look forward to giving you an unforgettable evening!\n\nProfessionalism, safety, cleanliness, reliability, and discretion.\nWe place great value on your trust – and equally trust our ladies, who come from all corners of the world. This ensures that you will be completely satisfied, regardless of your ethnic preferences. These multicultural ladies enrich Pascha with variety, charm, and all kinds of sensuality – a spectacular mix that makes Pascha more vibrant and adventurous",
];

function ServiceCard({ loc, index, t }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const copyKey = index === 2 ? "service_nightclub_description" : "service_laufhaus_description";

  return (
    <div className="glass-card rounded-2xl overflow-visible group transition-all duration-300 relative pb-10 flex flex-col hover:shadow-[0_0_30px_rgba(255,0,255,0.18)] max-w-[420px] mx-auto">
      <div className="p-8 pb-4 flex-1 flex flex-col items-center text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center gap-2 text-[#ffabf3] text-[11px] font-bold uppercase tracking-[0.32em]">
            <span className="material-symbols-outlined text-base">location_on</span>
            <span>{loc.city}</span>
          </div>
        </div>

        <p className={`text-white/70 text-sm font-['Be_Vietnam_Pro'] leading-relaxed transition-all duration-300 whitespace-pre-line ${isExpanded ? "" : "line-clamp-4"}`}>
          {t(copyKey)}
        </p>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-[#ffabf3] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
        >
          {isExpanded ? t("see_less") : t("see_more")}
        </button>

        <div className="mt-6 h-px w-16 bg-white/10 mx-auto" />
      </div>

      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-full px-4 flex justify-center">
        <a
          href={loc.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="max-w-full px-5 py-2 rounded-full bg-[#0F0F3D]/85 backdrop-blur-md text-white text-[11px] md:text-xs font-extrabold uppercase tracking-[0.18em] whitespace-nowrap shadow-[0_0_26px_rgba(255,0,255,0.28)] leading-none hover:bg-[#FF00FF] transition-all duration-300"
        >
          {loc.name}
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [footerPad, setFooterPad] = useState(0);
  const [activeHeroIndex, setActiveHeroIndex] = useState(1);
  const heroRef = useRef(null);
  const heroAutoRef = useRef(null);
  const autoRotateRef = useRef(null);
  const slides = useMemo(() => galleryItems, []);
  const heroPanels = useMemo(
    () => [
      {
        title: "Pascha Laufhaus - Braunau Am Inn",
        subtitle: "Salzburger Str. 136 // 5280 Braunau am Inn",
        img: "/wp-content/uploads/2026/05/hero%20laufhaus%20page.jpeg",
        path: "braunau",
        mapLink: "https://maps.app.goo.gl/gM9w6F5DfrXGDjsi9",
      },
      {
        title: "pascha Laufhaus - Salzburg",
        subtitle: "Sterneckstraße 14 // 5020 Salzburg",
        img: "/wp-content/uploads/2026/05/hero%20laufhaus%20page%2001.jpeg",
        path: "salzburg",
        mapLink: "https://maps.app.goo.gl/Qb6ShHv4Z7o1EK6L6",
      },
      {
        title: "Pascha nightclub - Salzburg",
        subtitle: "Sterneckstraße 14 // 5020 Salzburg",
        img: "/wp-content/themes/night-club-theme/dist/images/Nightclub%20Carasol.jpeg",
        path: "nightclub",
        mapLink: "https://maps.app.goo.gl/Qb6ShHv4Z7o1EK6L6",
      },
    ],
    []
  );

  // Marquee-style infinite gallery (BrandLogoMarquee concept)
  const galleryTrackRef = useRef(null);
  const galleryGroupRef = useRef(null);
  const galleryOffsetRef = useRef(0);
  const galleryWidthRef = useRef(0);
  const galleryStepRef = useRef(0);
  const galleryLastTsRef = useRef(0);
  const galleryRafRef = useRef(null);
  const galleryManualRef = useRef(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return undefined;

    const update = () => {
      const next = Math.ceil(footer.getBoundingClientRect().height);
      setFooterPad(next);
    };

    update();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(footer);
    window.addEventListener("resize", update);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const track = galleryTrackRef.current;
    const group = galleryGroupRef.current;
    if (!track || !group) return undefined;

    const measure = () => {
      galleryWidthRef.current = Math.ceil(group.getBoundingClientRect().width);
      const first = group.querySelector("[data-gallery-item]");
      if (first) {
        const itemWidth = first.getBoundingClientRect().width;
        const styles = window.getComputedStyle(group);
        const gap =
          Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
        galleryStepRef.current = itemWidth + gap;
      }
    };

    const wrap = (value, width) => {
      if (!width) return 0;
      return ((value % width) + width) % width;
    };

    const applyTransform = (forceOffsetPx = null) => {
      const width = galleryWidthRef.current || 1;
      const wrapped =
        forceOffsetPx == null ? wrap(galleryOffsetRef.current, width) : forceOffsetPx;
      track.style.transform = `translate3d(${-wrapped}px,0,0)`;
    };

    measure();
    applyTransform();

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => {
        measure();
        applyTransform();
      }) : null;
    ro?.observe(group);
    window.addEventListener("resize", measure);

    const speedPxPerSec = 55;
    const tick = (ts) => {
      if (!galleryLastTsRef.current) galleryLastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - galleryLastTsRef.current) / 1000);
      galleryLastTsRef.current = ts;

      if (!galleryManualRef.current) {
        galleryOffsetRef.current += speedPxPerSec * dt;
        applyTransform();
      }

      galleryRafRef.current = requestAnimationFrame(tick);
    };

    track.style.willChange = "transform";
    track.style.backfaceVisibility = "hidden";
    galleryRafRef.current = requestAnimationFrame(tick);

    const nudge = (dir) => {
      const step = galleryStepRef.current || 0;
      if (!step) return;
      const width = galleryWidthRef.current || 0;
      if (!width) return;

      galleryManualRef.current = true;
      track.style.transition = "transform 420ms ease-out";

      const startWrapped = wrap(galleryOffsetRef.current, width);
      let nextRaw = galleryOffsetRef.current + dir * step;
      const endWrapped = wrap(nextRaw, width);

      // Ensure the animated movement is monotonic in the chosen direction
      let renderEnd = endWrapped;
      if (dir > 0 && endWrapped < startWrapped) renderEnd = endWrapped + width;
      if (dir < 0 && endWrapped > startWrapped) renderEnd = endWrapped - width;

      // Start from wrapped position to avoid huge transforms
      applyTransform(startWrapped);
      // Commit raw offset, then animate to renderEnd
      galleryOffsetRef.current = nextRaw;
      requestAnimationFrame(() => applyTransform(renderEnd));

      const done = () => {
        track.removeEventListener("transitionend", done);
        track.style.transition = "none";
        galleryManualRef.current = false;
        // Snap (invisibly) to the wrapped equivalent after crossing boundaries
        applyTransform(wrap(galleryOffsetRef.current, width));
      };

      track.addEventListener("transitionend", done, { once: true });
    };

    const nextBtn = document.getElementById("slider-next");
    const prevBtn = document.getElementById("slider-prev");
    const onNext = () => nudge(1);
    const onPrev = () => nudge(-1);

    nextBtn?.addEventListener("click", onNext);
    prevBtn?.addEventListener("click", onPrev);

    return () => {
      nextBtn?.removeEventListener("click", onNext);
      prevBtn?.removeEventListener("click", onPrev);
      if (galleryRafRef.current) cancelAnimationFrame(galleryRafRef.current);
      galleryRafRef.current = null;
      galleryLastTsRef.current = 0;
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Hero section mobile scroll tracking and auto-slide
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    const media = window.matchMedia("(max-width: 1023px)");

    // IntersectionObserver to update active index on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && media.matches) {
            const index = parseInt(entry.target.getAttribute("data-index"));
            setActiveHeroIndex(index);
          }
        });
      },
      { threshold: 0.6, root: hero }
    );

    const panels = hero.querySelectorAll(".hero-panel");
    panels.forEach((panel) => observer.observe(panel));

    const start = () => {
      if (!media.matches) return;
      if (heroAutoRef.current) clearInterval(heroAutoRef.current);

      const scrollNext = () => {
        const amount = hero.offsetWidth;
        if (hero.scrollLeft + hero.offsetWidth >= hero.scrollWidth - 10) {
          hero.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          hero.scrollBy({ left: amount, behavior: "smooth" });
        }
      };

      heroAutoRef.current = setInterval(scrollNext, 5000); // Slower interval for better readability
    };

    const stop = () => {
      if (heroAutoRef.current) clearInterval(heroAutoRef.current);
      heroAutoRef.current = null;
    };

    const onTouch = () => {
      stop();
      start();
    };

    start();
    media.addEventListener("change", () => {
      stop();
      start();
    });
    hero.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      stop();
      observer.disconnect();
      hero.removeEventListener("touchstart", onTouch);
    };
  }, []);

  // (Removed old index-based carousel logic; gallery now uses marquee-style loop)

  return (
    <div
      className="min-h-screen selection:bg-[#ffabf3] selection:text-[#5b005b]"
      style={{ paddingBottom: footerPad }}
    >
      <Navbar />

      <main className="pt-[72px]">
        <section
          ref={heroRef}
          className="h-[75vh] w-full flex hero-expand-container transition-all duration-500 overflow-x-auto snap-x snap-mandatory lg:overflow-hidden scrollbar-hide"
        >
          {heroPanels.map((panel, idx) => (
            <div
              key={panel.title}
              data-index={idx}
              className="hero-panel min-w-full snap-start lg:min-w-0 lg:flex-1 flex flex-col h-full transition-all duration-700 ease-in-out group"
              onMouseEnter={() => setActiveHeroIndex(idx)}
              onFocus={() => setActiveHeroIndex(idx)}
              onClick={() => navigate(`/girls/${panel.path}`)}
            >
              <div className="relative flex-1 overflow-hidden cursor-pointer">
                {panel.video ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                    src={panel.video}
                  />
                ) : (
                  <img
                    alt={panel.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                    src={panel.img}
                    loading="eager"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F3D] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[92%] lg:w-[88%] opacity-100 transition-opacity duration-500 text-center">
                  <h2
                    className={[
                      "font-['Epilogue'] text-[11px] sm:text-[13px] lg:text-[16px] xl:text-[20px] font-extrabold text-white uppercase tracking-tight leading-[1.08] transition-all duration-300 inline-block px-5 py-2.5 border-2 border-white/40 bg-black/20 backdrop-blur-sm hover:border-[#FF00FF] hover:bg-[#FF00FF]/10 hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] group-hover:border-[#FF00FF] group-hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] whitespace-nowrap mx-auto",
                      activeHeroIndex === idx ? "opacity-100" : "lg:opacity-60",
                    ].join(" ")}
                  >
                    {panel.title}
                  </h2>
                </div>
              </div>
              <div className="mt-4 flex justify-center pb-2">
                <a
                  href={panel.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    "inline-flex items-center gap-2 text-white/80 text-sm lg:text-base font-['Be_Vietnam_Pro'] text-center transition-opacity duration-300 hover:text-white",
                    activeHeroIndex === idx ? "opacity-100" : "lg:opacity-60",
                  ].join(" ")}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="material-symbols-outlined text-[18px] lg:text-[22px]">
                    location_on
                  </span>
                  <span className="underline decoration-white/30 underline-offset-4 hover:decoration-white transition-all duration-300">
                    {panel.subtitle}
                  </span>
                </a>
              </div>
            </div>
          ))}
        </section>

        <a href="https://apeshop.at/" target="_blank" rel="noopener noreferrer" className="block w-full mt-16 mb-8">
          <img src="/wp-content/themes/night-club-theme/dist/images/Poster.jpg.jpeg" alt="Poster" className="w-full" />
        </a>

        <section className="w-full px-6 lg:px-8 py-[50px]">
          <div className="text-center mb-12">
            <div className="relative inline-block pt-6 pb-8">
              <div className="absolute top-0 left-[-20%] right-[-20%] h-0.5 bg-white"></div>
              <h2 className="font-['Epilogue'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FF00FF] uppercase tracking-tighter px-6 sm:px-12">
                {t("our_services")}
              </h2>
              <div className="absolute bottom-0 left-[-20%] right-[-20%] flex items-center justify-center">
                <div className="h-0.5 bg-white flex-1"></div>
                <span className="mx-3 text-white text-2xl leading-none">★</span>
                <div className="h-0.5 bg-white flex-1"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {destinations.slice(0, 3).map((loc, index) => {
              const [isExpanded, setIsExpanded] = React.useState(false);
              const dummyText = index === 0
                ? "We offer a calm, discreet, and high-comfort environment designed for guests who value privacy, relaxation, and top-class service. Our facility is located in a safe and peaceful area, ensuring a fully secure and comfortable experience for every visitor. Our team is professional, well-trained, and dedicated to providing excellent service with full attention to guest satisfaction. We maintain the highest standards of hygiene and cleanliness throughout the premises. We welcome guests from different backgrounds and ensure a respectful, comfortable atmosphere for everyone. We provide a secure and discreet environment along with free private parking for the convenience of our guests. High standards of hygiene and cleanliness are maintained at all times, ensuring a fresh and well-kept setting. Our rooms are comfortable, well-maintained, and designed to offer a relaxing stay. Professional and friendly staff are always available to ensure a smooth and pleasant experience. Your privacy, safety, and comfort are always our top priorities."
                : index === 1
                  ? "We offer a calm, discreet, and high-comfort environment designed for guests who value privacy, relaxation, and top-class service. Our facility is located in a safe and peaceful area, ensuring a fully secure and comfortable experience for every visitor. Our team is professional, well-trained, and dedicated to providing excellent service with full attention to guest satisfaction. We maintain the highest standards of hygiene and cleanliness throughout the premises. We welcome guests from different backgrounds and ensure a respectful, comfortable atmosphere for everyone. We provide a secure and discreet environment along with free private parking for the convenience of our guests. High standards of hygiene and cleanliness are maintained at all times, ensuring a fresh and well-kept setting. Our rooms are comfortable, well-maintained, and designed to offer a relaxing stay. Professional and friendly staff are always available to ensure a smooth and pleasant experience. Your privacy, safety, and comfort are always our top priorities."
                  : "Welcome to Pascha Salzburg – Nightclub and bar, your exclusive table dance nightclub and brothel in the picturesque city of Salzburg! We have 30-40 seductive, multicultural women on hand daily. Our establishment offers a unique combination of first-class entertainment and discreet service.\n\nExpect breathtaking striptease shows, lap dances, and table dances performed with passion and professionalism by our talented dancers. Enjoy the sensual atmosphere of Pascha and let yourself be seduced by our top international ladies, whose lineup changes weekly.\n\nThe establishment offers discreet parking to ensure your visit is as relaxed as possible. We place great importance on your privacy and discretion, so you can feel completely at ease.\nVisit us in the heart of Salzburg and experience unforgettable nights filled with eroticism and entertainment. Leave the everyday behind and immerse yourself in the world of Pascha Salzburg. We look forward to giving you an unforgettable evening!\n\nProfessionalism, safety, cleanliness, reliability, and discretion.\nWe place great value on your trust – and equally trust our ladies, who come from all corners of the world. This ensures that you will be completely satisfied, regardless of your ethnic preferences. These multicultural ladies enrich Pascha with variety, charm, and all kinds of sensuality – a spectacular mix that makes Pascha more vibrant and adventurous";

              return (
                <div
                  key={`${loc.name}-${index}`}
                  className="glass-card rounded-2xl overflow-visible group transition-all duration-300 relative pb-10 flex flex-col hover:shadow-[0_0_30px_rgba(255,0,255,0.18)] max-w-[420px] mx-auto"
                >
                  {/* Text content instead of image */}
                  <div className="p-8 pb-4 flex-1 flex flex-col items-center text-center">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center gap-2 text-[#ffabf3] text-[11px] font-bold uppercase tracking-[0.32em]">
                        <span className="material-symbols-outlined text-base">
                          location_on
                        </span>
                        <span>{loc.city}</span>
                      </div>
                    </div>



                    <p className={`text-white/70 text-sm font-['Be_Vietnam_Pro'] leading-relaxed transition-all duration-300 whitespace-pre-line ${isExpanded ? '' : 'line-clamp-4'}`}>
                      {t(index === 2 ? "service_nightclub_description" : "service_laufhaus_description")}
                    </p>

                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="mt-3 text-[#ffabf3] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                    >
                      {isExpanded ? t("see_less") : t("see_more")}
                    </button>

                    <div className="mt-6 h-px w-16 bg-white/10 mx-auto" />
                  </div>

                  {/* Bottom label (No change) */}
                  <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-full px-4 flex justify-center">
                    <a
                      href={loc.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="max-w-full px-5 py-2 rounded-full bg-[#0F0F3D]/85 backdrop-blur-md text-white text-[11px] md:text-xs font-extrabold uppercase tracking-[0.18em] whitespace-nowrap shadow-[0_0_26px_rgba(255,0,255,0.28)] leading-none hover:bg-[#FF00FF] transition-all duration-300"
                    >
                      {loc.name}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Highlighted Note Section */}
        <section className="bg-[#0A0A26] py-[100px] px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <p className="text-white text-base lg:text-lg font-['Be_Vietnam_Pro'] leading-relaxed">
              <span className="font-bold text-[#FF00FF]">{t("note")}:</span>{" "}
              <span className="text-lg lg:text-2xl font-extrabold">{t("parking_is_free")}</span> - {t("parking_note_detail")}
            </p>
            <p className="text-white/80 text-base lg:text-lg font-['Be_Vietnam_Pro'] leading-relaxed">
              {t("appointment_change_note")}
            </p>
            <p className="text-white/70 text-base lg:text-lg font-['Be_Vietnam_Pro'] leading-relaxed">
              {t("privacy_note")}
            </p>
          </div>
        </section>



        {/* Work With Us Section - Redesigned to match image */}
        <section className="bg-[#E3087E] py-10 px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10 text-center text-black">

            {/* Title with Lines and Star */}
            <div className="relative inline-block mb-16 pt-6 pb-8">
              <div className="absolute top-0 left-[-20%] right-[-20%] h-0.5 bg-white"></div>
              <h2 className="font-['Epilogue'] text-3xl sm:text-4xl lg:text-6xl font-extrabold uppercase tracking-tight px-6 sm:px-12">
                {t("work_with_us_title")}
              </h2>
              <div className="absolute bottom-0 left-[-20%] right-[-20%] flex items-center justify-center">
                <div className="h-0.5 bg-white flex-1"></div>
                <span className="mx-3 text-white text-2xl leading-none">★</span>
                <div className="h-0.5 bg-white flex-1"></div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-xl lg:text-2xl font-bold uppercase tracking-[0.1em]">
                  {t("looking_for_ladies")}
                </h3>
                <p className="text-sm lg:text-lg font-medium font-['Be_Vietnam_Pro'] leading-relaxed max-w-3xl mx-auto">
                  {t("work_with_us_body")}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold uppercase tracking-widest">
                  {t("requirements")}
                </h4>
                <p className="text-sm lg:text-lg font-medium font-['Be_Vietnam_Pro'] leading-relaxed">
                  {t("requirements_body")}
                </p>
              </div>


            </div>
          </div>
        </section>

        {/* Info/Contact Section - Matches Image */}
        <section className="bg-[#2E2C7F] py-6 px-6 lg:px-8 text-white text-center border-t border-white/5">
          <div className="max-w-5xl mx-auto space-y-10 relative">
            {/* 24/7 Sticker - Top Left (CSS Recreation) */}
            <div className="absolute top-2 sm:top-6 -left-4 sm:-left-24 z-10">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28 lg:h-44 lg:w-44">
                {/* Neon Circle */}
                <div className="w-full h-full rounded-full border-[1.5px] lg:border-2 border-[#FF00FF] flex flex-col items-center justify-center shadow-[0_0_15px_rgba(255,0,255,0.4),inset_0_0_15px_rgba(255,0,255,0.4)] bg-[#2E2C7F]">
                  <div className="font-['Epilogue'] font-black leading-[1.1] tracking-widest text-transparent flex flex-col items-center justify-center text-center scale-x-110">
                    <span className="text-[10px] sm:text-[12px] md:text-[16px] lg:text-[26px]" style={{ WebkitTextStroke: '1.2px #FF00FF' }}>OPEN</span>
                    <span className="text-[12px] sm:text-[14px] md:text-[20px] lg:text-[32px]" style={{ WebkitTextStroke: '1.2px #00e5ff' }}>24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Area */}
            <div className="flex justify-center mb-2">
              <div className="relative">
                <img
                  src="/wp-content/themes/night-club-theme/dist/images/Logo-Pascha-.png"
                  alt="Pascha"
                  className="h-16 lg:h-24 w-auto drop-shadow-[0_0_20px_rgba(255,0,255,0.6)]"
                />
              </div>
            </div>

            <h3 className="text-xl lg:text-3xl font-bold tracking-[0.2em] uppercase font-['Epilogue']">
              {t("contact_heading")}
            </h3>

            <div className="h-[1px] w-28 bg-[#E3087E] mx-auto opacity-60" />

            <div className="text-[10px] sm:text-xs lg:text-sm font-['Be_Vietnam_Pro'] font-medium tracking-wider opacity-90">
              WhatsApp: +43 676 3303336 // WhatsApp: +43 676 6826881
            </div>

            <div className="text-base sm:text-lg lg:text-2xl font-extrabold font-['Epilogue'] tracking-tight leading-tight uppercase">
              {t("open_continuously")}
              <br />
              {t("no_everyday_routine")}
            </div>

            <div className="h-[1px] w-28 bg-[#E3087E] mx-auto opacity-60" />

            <div className="flex justify-center items-center gap-6 text-[10px] sm:text-xs lg:text-sm font-['Be_Vietnam_Pro'] font-bold tracking-[0.2em] uppercase opacity-80">
              <a href="/legal-notice" className="hover:text-[#E3087E] transition-all">{t("legal_notice")}</a>
              <span className="text-white/20">•</span>
              <a href="/privacy-policy" className="hover:text-[#E3087E] transition-all">{t("privacy_policy")}</a>
            </div>
          </div>
        </section>

        {/* The Experience Section - Polished */}
        <section className="w-full bg-[#0c0f0f] pt-10 pb-10 px-6 lg:px-8 border-t border-white/5">
          <div className="w-full text-center space-y-4">
            <div className="inline-flex items-center justify-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">
              {t("visual_journey")}
            </div>
            <h2 className="font-['Epilogue'] text-4xl lg:text-6xl font-extrabold text-white uppercase tracking-tight">
              {t("the_experience")}
            </h2>
            <p className="text-white/40 text-base lg:text-lg font-['Be_Vietnam_Pro'] max-w-lg mx-auto">
              {t("experience_subtitle")}
            </p>
          </div>
        </section>

        <section className="w-full bg-[#380E49] py-2 lg:py-4 px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <button
              id="slider-prev"
              type="button"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-7 h-7 lg:w-10 lg:h-10 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/20 backdrop-blur hover:bg-[#ffabf3]/30 hover:border-[#ffabf3]/50 transition-all active:scale-90 no-hover-scale"
              aria-label="Previous"
            >
              <FiChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
            <button
              id="slider-next"
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-7 h-7 lg:w-10 lg:h-10 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/20 backdrop-blur hover:bg-[#ffabf3]/30 hover:border-[#ffabf3]/50 transition-all active:scale-90 no-hover-scale"
              aria-label="Next"
            >
              <FiChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>

            <div className="overflow-hidden">
              <div
                ref={galleryTrackRef}
                className="flex w-max gap-6 transform-[translate3d(0,0,0)]"
              >
                <div ref={galleryGroupRef} className="flex shrink-0 gap-6">
                  {slides.map((slide) => (
                    <div
                      key={slide.title}
                      data-gallery-item
                      className="flex flex-col gap-3 group shrink-0 w-[170px] sm:w-[190px] lg:w-[210px] xl:w-[230px]"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-[#1e2020]">
                        {slide.type === "video" ? (
                          <video
                            className="w-full h-full object-cover"
                            src={slide.src}
                            poster={slide.poster}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img
                            alt={slide.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={slide.src}
                            loading="lazy"
                          />
                        )}
                      </div>
                      {/* Removed Title */}
                    </div>
                  ))}
                </div>

                <div className="flex shrink-0 gap-6" aria-hidden="true">
                  {slides.map((slide) => (
                    <div
                      key={`${slide.title}-dup`}
                      className="flex flex-col gap-3 group shrink-0 w-[170px] sm:w-[190px] lg:w-[210px] xl:w-[230px]"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-[#1e2020]">
                        {slide.type === "video" ? (
                          <video
                            className="w-full h-full object-cover"
                            src={slide.src}
                            poster={slide.poster}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            src={slide.src}
                            loading="lazy"
                          />
                        )}
                      </div>
                      {/* Removed Title */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

import React, { useState, useEffect } from "react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-24 lg:bottom-28 right-6 z-[100]">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff00ff]/20 border border-[#ff00ff]/50 text-[#ffabf3] shadow-[0_0_15px_rgba(255,0,255,0.3)] backdrop-blur-md transition-all duration-300 hover:bg-[#ff00ff] hover:text-white hover:shadow-[0_0_25px_rgba(255,0,255,0.6)] hover:-translate-y-1 active:scale-95"
          aria-label="Back to top"
        >
          <span className="material-symbols-outlined text-3xl">
            keyboard_arrow_up
          </span>
        </button>
      )}
    </div>
  );
};

export default BackToTop;

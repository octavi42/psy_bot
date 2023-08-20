import React, { createContext, useContext, useRef, ReactNode } from "react";

// Create a context with an initial value (empty function)
export const ScrollContext = createContext<{ scrollToBottom: () => void }>({
  scrollToBottom: () => {},
});

export const useScrollContext = () => {
  return useContext(ScrollContext);
};

// ScrollProvider component to wrap your main page content
type ScrollProviderProps = {
  children: ReactNode;
};

export const ScrollProvider = ({ children }: ScrollProviderProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <ScrollContext.Provider value={{ scrollToBottom }}>
      <div
        className="pb-0 h-auto bg-white rounded-lg shadow-md overflow-y-auto"
        style={{ scrollSnapType: "y mandatory", maxHeight: "100vh" }}
        ref={containerRef}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
};

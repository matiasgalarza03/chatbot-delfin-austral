import React, { createContext, useContext, useState, useCallback } from "react";

/**
 * AnimationContext holds the current animation state that the 3D avatar should play.
 * It exposes `animation` (string) and helper setters so that other components can
 * request a specific animation.  Avatar listens to this value and updates clips.
 */
const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [animation, setAnimation] = useState("Happy_Idle"); // default idle

  /**
   * Helper to set the animation directly
   */
  const playAnimation = useCallback((name) => {
    setAnimation(name);
  }, []);

  return (
    <AnimationContext.Provider value={{ animation, playAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const ctx = useContext(AnimationContext);
  if (!ctx) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return ctx;
};

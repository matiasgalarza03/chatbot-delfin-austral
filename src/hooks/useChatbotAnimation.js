import { useAnimation } from "../contexts/AnimationContext";
import { useCallback } from "react";

// Mapping rules as required by user
const mapAnimations = (groupKeyOrName, speaking) => {
  // Normalize
  const key = (groupKeyOrName || "").toUpperCase();
  const lowerName = (groupKeyOrName || "").toLowerCase();

  // Default animations
  let idle = "Bored";
  let talk = "Bored"; // if speaking but no mapping, stick to idle

  const isMalvinasSubmenu = key === "D" || lowerName.includes("malvinas");
  const isHappyGroup =
    key === "A" ||
    key === "B" ||
    lowerName.includes("delfín austral") ||
    lowerName.includes("museo escolar") ||
    lowerName.includes("escuela secundaria n° 3");

  if (isHappyGroup || isMalvinasSubmenu) {
    idle = "Happy_Idle";
    talk = "Happy_Talk";
  }

  return speaking ? talk : idle;
};

/**
 * Hook that returns a function to update animation based on current group and speaking state.
 */
export const useChatbotAnimation = () => {
  const { playAnimation } = useAnimation();

  const updateAnimation = useCallback(
    (groupIdOrName, speaking) => {
      const anim = mapAnimations(groupIdOrName, speaking);
      
      // Log para debugging de animaciones
      console.log(`🎭 Animación actualizada: grupo="${groupIdOrName}", speaking=${speaking} → "${anim}"`);
      
      playAnimation(anim);
    },
    [playAnimation],
  );

  return { updateAnimation };
};

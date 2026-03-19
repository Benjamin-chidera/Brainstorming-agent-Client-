import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

interface PersonaOrbProps {
  /** 0-1 audio volume level */
  volume: number;
  /** Whether the AI is currently speaking/thinking */
  isActive: boolean;
  /** Whether the user is currently speaking */
  isListening: boolean;
}

export const PersonaOrb = ({
  volume,
  isActive,
  isListening,
}: PersonaOrbProps) => {
  const controls = useAnimation();
  const prevVolume = useRef(0);

  // Smooth volume tracking
  useEffect(() => {
    const smoothed = prevVolume.current * 0.3 + volume * 0.7;
    prevVolume.current = smoothed;

    const scale = 1 + smoothed * 0.35;
    const blur = 80 + smoothed * 60;

    controls.start({
      scale,
      filter: `blur(${blur}px)`,
      transition: { duration: 0.15, ease: "easeOut" },
    });
  }, [volume, controls]);

  return (
    <div className="relative flex items-center justify-center w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]">
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isListening
            ? [
                "0 0 60px 20px rgba(0, 200, 255, 0.15)",
                "0 0 100px 40px rgba(0, 200, 255, 0.25)",
                "0 0 60px 20px rgba(0, 200, 255, 0.15)",
              ]
            : isActive
            ? [
                "0 0 60px 20px rgba(127, 13, 242, 0.15)",
                "0 0 100px 40px rgba(127, 13, 242, 0.3)",
                "0 0 60px 20px rgba(127, 13, 242, 0.15)",
              ]
            : "0 0 40px 10px rgba(127, 13, 242, 0.1)",
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Core Orb Layer 1 — Deep background */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "60%",
          height: "60%",
          background:
            "radial-gradient(circle at 30% 30%, rgba(127, 13, 242, 0.8), rgba(80, 0, 180, 0.4), transparent)",
        }}
        animate={controls}
      />

      {/* Core Orb Layer 2 — Cyan accent */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "50%",
          height: "50%",
          background:
            "radial-gradient(circle at 60% 40%, rgba(0, 200, 255, 0.6), rgba(127, 13, 242, 0.3), transparent)",
        }}
        animate={{
          scale: [1, 1.1 + volume * 0.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* Core Orb Layer 3 — Bright center */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "35%",
          height: "35%",
          background: isListening
            ? "radial-gradient(circle, rgba(0, 230, 255, 0.9), rgba(0, 150, 255, 0.5), transparent)"
            : "radial-gradient(circle, rgba(200, 130, 255, 0.9), rgba(127, 13, 242, 0.5), transparent)",
        }}
        animate={{
          scale: [1, 1.15 + volume * 0.3, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Particle Ring */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background:
              i % 2 === 0
                ? "rgba(127, 13, 242, 0.8)"
                : "rgba(0, 200, 255, 0.8)",
          }}
          animate={{
            x: [
              Math.cos((i / 8) * Math.PI * 2) * (80 + volume * 20),
              Math.cos(((i + 1) / 8) * Math.PI * 2) * (80 + volume * 20),
            ],
            y: [
              Math.sin((i / 8) * Math.PI * 2) * (80 + volume * 20),
              Math.sin(((i + 1) / 8) * Math.PI * 2) * (80 + volume * 20),
            ],
            opacity: [0.3, 0.8 + volume * 0.2, 0.3],
            scale: [0.8, 1.2 + volume, 0.8],
          }}
          transition={{
            duration: 3,
            delay: i * 0.375,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Center Label */}
      <motion.div
        className="absolute flex flex-col items-center gap-1 z-10"
        animate={{ opacity: isActive || isListening ? 1 : 0.7 }}
      >
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{
            background: isListening
              ? "rgba(0, 230, 255, 0.9)"
              : "rgba(127, 13, 242, 0.9)",
            boxShadow: isListening
              ? "0 0 20px rgba(0, 230, 255, 0.5)"
              : "0 0 20px rgba(127, 13, 242, 0.5)",
          }}
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 mt-2">
          {isListening ? "Listening..." : isActive ? "Thinking..." : "Manager Agent"}
        </span>
      </motion.div>
    </div>
  );
};

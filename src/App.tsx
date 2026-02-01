import { useEffect, useMemo, useRef, useState } from "react";
import Track from "./components/Track";
import CharacterNo from "./components/CharacterNo";
import ConfettiLayer, { ConfettiPiece } from "./components/ConfettiLayer";
import ModalOverlay from "./components/ModalOverlay";

type StageSize = { width: number; height: number };
type Point = { x: number; y: number };

const BASE_THETA = 0.65;

const createHearts = () =>
  Array.from({ length: 7 }).map((_, index) => ({
    id: index,
    x: 0.15 + Math.random() * 0.7,
    y: 0.1 + Math.random() * 0.75,
    size: 10 + Math.random() * 10,
    drift: 8 + Math.random() * 12,
    phase: Math.random() * Math.PI * 2,
  }));

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef({ x: 0, y: 0, active: false });
  const thetaRef = useRef(BASE_THETA);
  const speedRef = useRef(0.12);
  const dirRef = useRef(1);
  const lastTimeRef = useRef(0);
  const panicRef = useRef(0);
  const dashRef = useRef(0);
  const baseThetaRef = useRef(BASE_THETA);
  const wiggleBoostRef = useRef(0);
  const wiggleDirRef = useRef(1);
  const reduceMotionRef = useRef(false);
  const heartData = useRef(createHearts());
  const messageTimerRef = useRef<number | null>(null);

  const [stageSize, setStageSize] = useState<StageSize>({
    width: 800,
    height: 560,
  });
  const [noPos, setNoPos] = useState<Point>({ x: 0, y: 0 });
  const [timeMs, setTimeMs] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [showYes, setShowYes] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const track = useMemo(() => {
    const width = stageSize.width;
    const height = stageSize.height;
    return {
      cx: width / 2,
      cy: height / 2,
      rx: width * 0.375, // 300/800
      ry: height * 0.3833, // 230/600
    };
  }, [stageSize]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const element = containerRef.current;
    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reduceMotionRef.current = media.matches;
    };
    update();
    if (media.addEventListener) {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useEffect(() => {
    let rafId = 0;
    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const dt = Math.min(0.032, (timestamp - lastTimeRef.current) / 1000);
      lastTimeRef.current = timestamp;
      setTimeMs(timestamp);

      const { cx, cy, rx, ry } = track;
      const baseTheta = baseThetaRef.current;
      const cursor = cursorRef.current;
      const currentTheta = thetaRef.current;
      const noPosition = {
        x: cx + rx * Math.cos(currentTheta),
        y: cy + ry * Math.sin(currentTheta),
      };

      const distanceToCursor = Math.hypot(
        cursor.x - noPosition.x,
        cursor.y - noPosition.y
      );
      const panic = panicRef.current;
      const dangerRadius = 140 + panic * 26;
      const inDanger = cursor.active && distanceToCursor < dangerRadius;

      if (reduceMotionRef.current) {
        if (inDanger) {
          const lookAhead = 0.35;
          const nextPlus = {
            x: cx + rx * Math.cos(baseTheta + lookAhead),
            y: cy + ry * Math.sin(baseTheta + lookAhead),
          };
          const nextMinus = {
            x: cx + rx * Math.cos(baseTheta - lookAhead),
            y: cy + ry * Math.sin(baseTheta - lookAhead),
          };
          const distPlus = Math.hypot(cursor.x - nextPlus.x, cursor.y - nextPlus.y);
          const distMinus = Math.hypot(cursor.x - nextMinus.x, cursor.y - nextMinus.y);
          wiggleDirRef.current = distPlus > distMinus ? 1 : -1;
          wiggleBoostRef.current = Math.min(
            1,
            wiggleBoostRef.current + dt * 2.2
          );
        } else {
          wiggleBoostRef.current = Math.max(
            0,
            wiggleBoostRef.current - dt * 2
          );
        }
        const wiggle = Math.sin(timestamp * 0.004) * 0.02;
        const theta =
          baseTheta +
          wiggle +
          wiggleDirRef.current * wiggleBoostRef.current * 0.08;
        thetaRef.current = theta;
      } else {
        const idleSpeed = 0.12;
        const maxSpeed = 1.6 + panic * 0.35;
        const targetSpeed = inDanger ? maxSpeed : idleSpeed;
        const speedLerp = inDanger ? 4.5 : 2.8;
        speedRef.current += (targetSpeed - speedRef.current) * Math.min(1, dt * speedLerp);

        if (inDanger) {
          const lookAhead = 0.45;
          const nextPlus = {
            x: cx + rx * Math.cos(currentTheta + lookAhead),
            y: cy + ry * Math.sin(currentTheta + lookAhead),
          };
          const nextMinus = {
            x: cx + rx * Math.cos(currentTheta - lookAhead),
            y: cy + ry * Math.sin(currentTheta - lookAhead),
          };
          const distPlus = Math.hypot(cursor.x - nextPlus.x, cursor.y - nextPlus.y);
          const distMinus = Math.hypot(cursor.x - nextMinus.x, cursor.y - nextMinus.y);
          dirRef.current = distPlus > distMinus ? 1 : -1;
        }

        if (dashRef.current > 0) {
          thetaRef.current += dirRef.current * dashRef.current * dt;
          dashRef.current = Math.max(0, dashRef.current - dt * 3);
        }

        thetaRef.current += speedRef.current * dt * dirRef.current;
      }

      setNoPos({
        x: cx + rx * Math.cos(thetaRef.current),
        y: cy + ry * Math.sin(thetaRef.current),
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [track]);

  const hearts = useMemo(() => {
    const data = heartData.current;
    return data.map((heart) => ({
      ...heart,
      x: heart.x * stageSize.width + Math.sin(timeMs * 0.0009 + heart.phase) * heart.drift,
      y: heart.y * stageSize.height + Math.cos(timeMs * 0.0011 + heart.phase) * heart.drift,
    }));
  }, [stageSize, timeMs]);

  const handlePointerMove = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    cursorRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    cursorRef.current.active = false;
  };

  const handleNoClick = () => {
    panicRef.current += 1;
    dashRef.current = 3 + panicRef.current * 0.6;
    wiggleBoostRef.current = 1;
    setMessage("היי! האופציה הזאת לא זמינה 😭");
    if (messageTimerRef.current) {
      window.clearTimeout(messageTimerRef.current);
    }
    messageTimerRef.current = window.setTimeout(() => {
      setMessage(null);
    }, 1600);
  };

  const handleYesClick = () => {
    const count = 100; // Increased count
    const pieces: ConfettiPiece[] = Array.from({ length: count }).map((_, index) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 150 + Math.random() * 250; // Faster burst
      return {
        id: `${Date.now()}-${index}`,
        x: track.cx,
        y: track.cy,
        dx: Math.cos(angle) * velocity,
        dy: Math.sin(angle) * velocity - 100, // Burst upwards slightly
        rotate: -180 + Math.random() * 360,
        size: 6 + Math.random() * 12,
        color: `hsl(${Math.random() * 360}, 90%, 65%)`,
      };
    });
    setConfetti(pieces);
    setShowYes(true);
  };

  const handleReplay = () => {
    setShowYes(false);
    setConfetti([]);
  };

  return (
    <div className="app" dir="rtl">
      <header className="title">
        <h1>האם אתה נרשם לישראמן ב2027?</h1>
      </header>

      <div
        className="stage"
        ref={containerRef}
        onMouseMove={(event) => handlePointerMove(event.clientX, event.clientY)}
        onMouseLeave={handlePointerLeave}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          if (touch) {
            handlePointerMove(touch.clientX, touch.clientY);
          }
        }}
        onTouchMove={(event) => {
          const touch = event.touches[0];
          if (touch) {
            handlePointerMove(touch.clientX, touch.clientY);
          }
        }}
        onTouchEnd={handlePointerLeave}
      >
        <Track />

        <div className="field-hint side">אילת</div>
        <img src="/logo.png" className="solos-logo-img" alt="Solos Logo" />

        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="float-heart"
            style={{
              left: heart.x,
              top: heart.y,
              width: heart.size,
              height: heart.size,
            }}
          />
        ))}

        <div className="center-logo-container" onClick={handleYesClick} style={{ left: track.cx, top: track.cy }}>
          <img src="/logo.png" className="center-logo" alt="Solos Logo" />
          <button className="sign yes-sign" aria-label="Happy yes button" onClick={handleYesClick}>
            כן 😍
          </button>
        </div>
        <CharacterNo position={noPos} onClick={handleNoClick} />

        {message && <div className="message-bubble">{message}</div>}

        <ConfettiLayer pieces={confetti} />
        {showYes && <ModalOverlay onReplay={handleReplay} />}
      </div>
    </div>
  );
}

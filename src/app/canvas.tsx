"use client";
import { useEffect, useRef } from "react";
import styles from "./canvas.module.css";
import { useAppThemeContext } from "./context/AppThemeContext";



export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mode, setMode } = useAppThemeContext();
  let color = {
    light: ["#91a88a", "#91a88a", "#91a88a", "#c8d4c4"],
    dark: ["#697565", "#697565", "#697565", "#EEEEEE"],
  };
  let resizeListener: ((this: Window, ev: UIEvent) => any) | null = null;
  let mouseListener: ((this: Window, ev: MouseEvent) => any) | null = null;

  class Effect {
    context: CanvasRenderingContext2D;
    canvasWidth: number;
    canvasHeight: number;
    textX: number;
    textY: number;
    fontSize: number;
    maxTWidth: number;
    lineHeight: number;
    particles: Particle[];
    color: string[];
    gap: number;
    mouse: { radius: number; x: number; y: number };
    constructor(
      context: CanvasRenderingContext2D,
      cvWidth: number,
      cvHeight: number,
      color: string[]
    ) {
      this.context = context;
      this.canvasWidth = cvWidth;
      this.canvasHeight = cvHeight;
      this.textX = this.canvasWidth / 2;
      this.textY = this.canvasHeight / 3;
      this.fontSize = 150;
      this.maxTWidth = this.canvasWidth * 0.8;
      this.lineHeight = 120;
      this.color = color;

      this.particles = [];
      this.gap = 1;
      this.mouse = { radius: 20000, x: 0, y: 0 };

      if (mouseListener) window.removeEventListener("mousemove", mouseListener);

      window.addEventListener("mousemove", (e) => {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      });
    }
    wrapText(text: string) {
      const gradient = this.context.createLinearGradient(
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      );
      gradient.addColorStop(0, this.color[0]);
      gradient.addColorStop(0.5, this.color[1]);
      gradient.addColorStop(1, this.color[2]);
      this.context.fillStyle = gradient;
      this.context.textAlign = "center";
      this.context.textBaseline = "bottom";
      this.context.lineWidth = 3;
      this.context.strokeStyle = this.color[3];
      this.context.font = this.fontSize + "px Helvetica";
      this.context.fillText(text, this.textX, this.textY);
      this.context.strokeText(text, this.textX, this.textY);

      let linesArray = [];
      let lineCount = 0;
      let line = " ";
      let words = text.split(" ");
      for (let i = 0; i < words.length; i++) {
        let testLine = (line = words[i] + " ");
        if (this.context.measureText(testLine).width > this.maxTWidth) {
          line = words[i] + " ";
          lineCount++;
        } else {
          line = testLine;
        }
        linesArray[lineCount] = line;
      }
      let tHeight = this.lineHeight * lineCount;
      let textY = this.canvasHeight / 3 - tHeight / 2;
      linesArray.forEach((el, i) => {
        this.context.fillText(
          el,
          this.canvasWidth / 1.95,
          this.canvasHeight / 3
        );
        this.context.strokeText(
          el,
          this.canvasWidth / 1.95,
          this.canvasHeight / 3
        );
      });
      this.convertToParticles();
    }
    convertToParticles() {
      this.particles = [];
      const pixels = this.context.getImageData(
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      ).data;
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      for (let y = 0; y < this.canvasHeight; y += this.gap) {
        for (let x = 0; x < this.canvasWidth; x += this.gap) {
          const index = (y * this.canvasWidth + x) * 4;
          const alpha = pixels[index + 3];
          if (alpha > 0) {
            const color =
              "rgb(" +
              pixels[index] +
              "," +
              pixels[index + 1] +
              "," +
              pixels[index + 2] +
              ")";
            this.particles.push(new Particle(this, x, y, color));
            // const coords = { x: x, y: y };
            // this.particles.push({ color: color, coords: coords });
          }
        }
      }
    }
    render() {
      this.particles.forEach(
        (particle: { update: () => void; draw: () => void }) => {
          particle.update();
          particle.draw();
        }
      );
    }

    resize(width: number, height: number) {
      this.canvasWidth = width;
      this.canvasHeight = height;
      this.textX = this.canvasWidth / 2;
      this.textY = this.canvasHeight / 3;
      this.maxTWidth = this.canvasWidth * 0.8;
    }
  }

  class Particle {
    effect: Effect;
    x: number;
    y: any;
    color: string;
    oriX: number;
    oriY: number;
    size: any;
    dx: number;
    dy: number;
    vx: number;
    vy: number;
    force: number;
    angle: number;
    distance: number;
    friction: number;
    ease: number;
    constructor(effect: Effect, x: number, y: number, color: string) {
      this.effect = effect;
      this.x = Math.random() * this.effect.canvasWidth;
      this.y = this.effect.canvasHeight;
      this.color = color;
      this.oriX = x;
      this.oriY = y;
      this.size = this.effect.gap;
      this.dx = 0;
      this.dy = 0;
      this.vx = 0;
      this.vy = 0;
      this.force = 0;
      this.angle = 0;
      this.distance = 0;
      this.friction = Math.random() * 0.6 + 0.15;
      this.ease = Math.random() * 0.1 + 0.005;
    }
    draw() {
      this.effect.context.fillStyle = this.color;
      this.effect.context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
      this.dx = this.effect.mouse.x - this.x;
      this.dy = this.effect.mouse.y - this.y;
      this.distance = this.dx * this.dx + this.dy * this.dy;
      this.force = -this.effect.mouse.radius / this.distance;
      if (this.distance < this.effect.mouse.radius) {
        this.angle = Math.atan2(this.dy, this.dx);
        this.vx += this.force * Math.cos(this.angle);
        this.vy += this.force * Math.sin(this.angle);
      }

      this.x += (this.vx *= this.friction) + (this.oriX - this.x) * this.ease;
      this.y += (this.vy *= this.friction) + (this.oriY - this.y) * this.ease;
    }
  }

  const loadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const effect = new Effect(
      ctx,
      canvas.width,
      canvas.height,
      mode == "light" ? color.light : color.dark
    );
    effect.wrapText("CSCI—2720");
    effect.render();

    function animation() {
      if (canvas) {
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      effect.render();
      requestAnimationFrame(animation);
    }
    animation();

    if (resizeListener) window.removeEventListener("resize", resizeListener);

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      effect.resize(canvas.width, canvas.height);
      effect.wrapText("CSCI—2720");
    });
  };

  useEffect(() => {
    loadCanvas();

    return () => {
      if (resizeListener) window.removeEventListener("resize", resizeListener);
      if (mouseListener) window.removeEventListener("mousemove", mouseListener);
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.full}>
          <canvas id="canvas1" ref={canvasRef}></canvas>
        </div>
        <div></div>
      </div>
    </div>
  );
}

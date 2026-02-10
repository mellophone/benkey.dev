"use client";

import { useEffect } from "react";
import "./page.module.css";

const Space = () => {
  const startGame = () => {
    try {
      const canvas = document.getElementsByTagName("canvas")[0];

      const context = canvas.getContext("2d");

      if (!context) return;

      if (!window.visualViewport) return;

      const wi = window.visualViewport.width - 40;
      const hi = window.visualViewport.height - 40;

      canvas.width = wi;
      canvas.height = hi;

      const ratio = wi / hi;

      canvas.style.width = `min( calc(100vw - 40px), calc( ${ratio} * (100vh - 40px) ) )`;

      const highlight = "white";

      canvas.style.borderColor = highlight;

      context.lineWidth = 2;
      context.fillStyle = "black";
      context.strokeStyle = highlight;

      let user = {
        w: false,
        a: false,
        s: false,
        d: false,
        space: false,
      };

      document.onkeydown = (ev) => {
        let key = ev.key.toLowerCase();
        key = key === " " ? "space" : key;

        if (user[key as keyof typeof user] !== undefined) {
          user[key as keyof typeof user] = true;
        }
      };

      document.onkeyup = (ev) => {
        let key = ev.key.toLowerCase();
        key = key === " " ? "space" : key;

        if (user[key as keyof typeof user]) {
          user[key as keyof typeof user] = false;
        }
      };

      const degToRad = Math.PI / 180;

      let theta = 0;
      let x = 25;
      let y = 25;

      const move = (direction: number) => {
        const focus = theta + 135;
        const xa = x + Math.cos(focus * degToRad) * 5 * direction;
        const ya = y - Math.sin(focus * degToRad) * 5 * direction;
        if (xa > 25 && xa < wi - 25) x = xa;
        if (ya > 25 && ya < hi - 25) y = ya;
      };

      const drawRocket = () => {
        const d1 = Math.sqrt(25 ** 2 + 25 ** 2);
        const px1 = x + Math.cos((135 + theta) * degToRad) * d1;
        const py1 = y - Math.sin((135 + theta) * degToRad) * d1;

        const d2 = Math.sqrt(75 ** 2 + 25 ** 2);
        const a2 = Math.atan(1 / 3) / degToRad;
        const px2 = x + Math.cos((a2 + theta) * degToRad) * d2;
        const py2 = y - Math.sin((a2 + theta) * degToRad) * d2;

        const a3 = Math.atan(3) / degToRad + 180;
        const px3 = x + Math.cos((a3 + theta) * degToRad) * d2;
        const py3 = y - Math.sin((a3 + theta) * degToRad) * d2;

        context.beginPath();
        context.moveTo(px1, py1);
        context.lineTo(px2, py2);
        context.lineTo(px3, py3);
        context.lineTo(px1, py1);
        context.closePath();

        context.fill();
        context.stroke();
      };

      const drops: number[][] = [];
      const dropTimes = [];
      let dropOffs = 0;

      const drop = () => {
        if (dropOffs) {
          if (
            drops.length > 0 &&
            drops[drops.length - 1][0] === x &&
            drops[drops.length - 1][1] === y
          )
            return;
          return dropOffs--;
        }

        dropOffs = 8;
        drops.push([x, y]);
        if (drops.length > 10) drops.shift();
      };

      type Particle = {
        x: number;
        y: number;
        focus: number;
      };

      const shoots: Particle[] = [];

      const shoot = () => {
        const focus = theta + 135;
        const bullet = {
          x: x,
          y: y,
          focus,
        };
        shoots.push(bullet);

        if (shoots.length > 250) shoots.shift();
      };

      const eventLoop = setInterval(() => {
        context.clearRect(0, 0, wi, hi);

        const rSpeed = 3;

        if (user.d) theta -= rSpeed;
        if (user.a) theta += rSpeed;
        if (user.w) move(1);
        if (user.s) move(-1);
        if (user.space) shoot();
        drop();

        drops.forEach((d) => {
          context.beginPath();
          context.ellipse(
            d[0] + Math.random() - 0.5,
            d[1] + 2 * (Math.random() - 0.5),
            7.5,
            7.5,
            0,
            0,
            360,
          );
          context.closePath();
          context.fill();
          context.stroke();
        });

        shoots.forEach((bullet) => {
          context.beginPath();
          context.ellipse(bullet.x, bullet.y, 5, 5, 0, 0, 360);
          context.closePath();
          context.fill();
          context.stroke();

          bullet.x = bullet.x + Math.cos(bullet.focus * degToRad) * 10;
          bullet.y = bullet.y - Math.sin(bullet.focus * degToRad) * 10;
        });

        drawRocket();
      }, 10);
    } catch (e) {}
  };

  useEffect(() => {
    setTimeout(startGame, 50);
  }, []);

  return (
    <>
      <div
        style={{
          margin: 0,
          padding: 0,
          overflow: "hidden",
          backgroundColor: "black",
        }}
      >
        <canvas
          style={{
            border: "solid 2px",
            backgroundColor: "black",
            borderRadius: 5,
            imageRendering: "pixelated",
            margin: 20,
          }}
        ></canvas>
      </div>
    </>
  );
};

export default Space;

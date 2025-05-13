"use strict";
const common_vendor = require("../common/vendor.js");
const generateCaptcha = () => {
  const canvasId = "myCanvas";
  const ctx = common_vendor.index.createCanvasContext(canvasId);
  const backgroundR = Math.floor(Math.random() * 128);
  const backgroundG = Math.floor(Math.random() * 128);
  const backgroundB = Math.floor(Math.random() * 128);
  ctx.setFillStyle(`rgb(${backgroundR},${backgroundG},${backgroundB})`);
  ctx.fillRect(0, 0, 100, 50);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 100, 50);
  const characters = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let captcha = "";
  for (let i = 0; i < 4; i++) {
    const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    captcha += randomChar;
    ctx.setFontSize(20);
    const textR = Math.min(255, backgroundR + 128);
    const textG = Math.min(255, backgroundG + 128);
    const textB = Math.min(255, backgroundB + 128);
    ctx.setFillStyle(`rgb(${textR},${textG},${textB})`);
    ctx.fillText(randomChar, i * 20 + 10, 30);
  }
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 100, Math.random() * 50);
    ctx.lineTo(Math.random() * 100, Math.random() * 50);
    ctx.strokeStyle = getRandomColor();
    ctx.stroke();
  }
  ctx.draw();
  return captcha;
  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }
};
exports.generateCaptcha = generateCaptcha;

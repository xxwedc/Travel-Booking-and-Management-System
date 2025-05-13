const generateCaptcha = () => {
  const canvasId = 'myCanvas';
  const ctx = uni.createCanvasContext(canvasId);
  // 设置随机背景色，但确保与数字颜色有明显差异
  const backgroundR = Math.floor(Math.random() * 128);
  const backgroundG = Math.floor(Math.random() * 128);
  const backgroundB = Math.floor(Math.random() * 128);
  ctx.setFillStyle(`rgb(${backgroundR},${backgroundG},${backgroundB})`);
  ctx.fillRect(0, 0, 100, 50);
  // 绘制边框
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 100, 50);
  const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let captcha = '';
  for (let i = 0; i < 4; i++) {
    const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    captcha += randomChar;
    ctx.setFontSize(20);
    // 确保数字颜色与背景色有明显差异，例如选择较亮的颜色
    const textR = Math.min(255, backgroundR + 128);
    const textG = Math.min(255, backgroundG + 128);
    const textB = Math.min(255, backgroundB + 128);
    ctx.setFillStyle(`rgb(${textR},${textG},${textB})`);
    ctx.fillText(randomChar, i * 20 + 10, 30);
  }
  // 添加干扰线条
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

export default generateCaptcha;
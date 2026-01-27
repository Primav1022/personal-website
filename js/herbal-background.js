let codeLines = [];
let fontSize = 22;
let lineHeight = 30;
let margin = 70;

let scrollSpeed = 35; // frames between new lines
let frameCounter = 0;
let nextY;

// Typing state
let typingSpeed = 1; // frames per character
let typingCounter = 0;
let currentSnippet = "";
let currentIndex = 0;
let isTyping = false;

// Cursor
let cursorBlinkSpeed = 10;
let cursorVisible = true;
let cursorCounter = 0;
let cursorSize = 16;

let funSnippets = [
  "/**",
  " * 💊 PROJECT: SHENNONG-REVOLUTION-2077",
  " * 💊 MODULE: BIOLOGICAL_KERNEL_PATCHER",
  " */",
  "",
  "const CyberMateriaMedica = {",
  "    internalClearance: {",
  "        attack: [\"木通\", \"防己\", \"滑石\", \"茯苓\", \"芫花\", \"甘遂\", \"大戟\", \"牵牛\"],",
  "        diuretic: [\"滑石\", \"猪苓\", \"泽泻\", \"茯苓\", \"瞿麦\", \"灯草\", \"车前子\"],",
  "        expelPhlegm: [\"半夏\", \"茯苓\"],",
  "        detox: [\"五叶藤\", \"萱草根\"]",
  "    },",
  "",
  "    polarity: {",
  "        yangOfYang: { name: \"附子\", property: \"气浓\", effect: \"益阳\" },",
  "        yinOfYin: { name: \"大黄\", property: \"味浓\", effect: \"泄火\" },",
  "        yangOfYin: { name: \"茯苓\", property: \"气薄\", effect: \"利小便\" }",
  "    },",
  "",
  "    routing: {",
  "        handTaiYang: [\"木通\", \"黄柏\"],",
  "        yangMing: [\"升麻\", \"葛根\", \"甘草\"],",
  "        lung: [\"桔梗\", \"升麻\"],",
  "        kidney: [\"补骨脂\", \"知母\", \"玄参\"]",
  "    },",
  "",
  "    algorithm: {",
  "        tonifyMother: {",
  "            waterWeak: [\"人参\", \"山药\"],",
  "            earthWeak: [\"苍术\", \"白术\", \"半夏\", \"茯苓\", \"橘皮\", \"生姜\"]",
  "        },",
  "        drainSon: {",
  "            fireExcess: [\"黄连\", \"大黄\"],",
  "            相火: [\"黄柏\", \"知母\", \"牡丹皮\", \"地骨皮\", \"生地黄\", \"茯苓\", \"玄参\", \"寒水石\"]",
  "        },",
  "        surfaceOpen: [\"葛根\", \"苍术\", \"麻黄\", \"独活\"]",
  "    },",
  "",
  "    firewall: [",
  "        { subject: \"甘草\", fear: \"远志\", avoid: \"猪肉\" },",
  "        { subject: \"人参\", fear: \"马蔺\", avoid: \"猪肉\" },",
  "        { subject: \"当归\", avoid: \"湿面\" },",
  "        { subject: \"土茯苓\", avoid: [\"面汤\", \"茶\"] },",
  "        { subject: \"何首乌\", avoid: [\"葱\", \"蒜\", \"萝卜\", \"诸血\", \"无鳞鱼\"] },",
  "        { subject: \"丹参\", fear: \"雷丸\", avoid: \"醋\" },",
  "        { subject: \"淫羊藿\", avoid: [\"贝母\", \"漏芦\"] }",
  "    ]",
  "};",
  "",
  "class CyberApothecary {",
  "    constructor() {",
  "        this.systemLog = [];",
  "        this.activeBuffer = new Set();",
  "    }",
  "",
  "    async diagnoseAndPatch(syndrome) {",
  "        console.log(\"%c[SYSTEM] 初始化赛博脉诊扫描仪...\", \"color: #00ffcc\");",
  "",
  "        let prescription = [];",
  "",
  "        if (syndrome.internalBlockage) {",
  "            console.log(\"检测到内阻：启动 [留者行也] 协议...\");",
  "            prescription.push(...CyberMateriaMedica.internalClearance.attack);",
  "        }",
  "",
  "        if (syndrome.temp === \"EXTREME_COLD\") {",
  "            prescription.push(CyberMateriaMedica.polarity.yangOfYang.name);",
  "        } else if (syndrome.temp === \"EXTREME_HEAT\") {",
  "            prescription.push(CyberMateriaMedica.polarity.yinOfYin.name);",
  "        }",
  "",
  "        if (syndrome.organFailure === \"WATER_WEAK\") {",
  "            prescription.push(...CyberMateriaMedica.algorithm.tonifyMother.waterWeak);",
  "            prescription.push(\"气之补: \" + [\"知母\", \"玄参\"].join(\"/\"));",
  "        }",
  "",
  "        if (syndrome.fireStatus === \"XIANG_HUO_STRONG\") {",
  "            prescription.push(...CyberMateriaMedica.algorithm.drainSon.相火);",
  "        }",
  "",
  "        if (syndrome.targetPath === \"HAND_TAI_YANG\") {",
  "            console.log(\"路由寻址：入手太阳 -> 映射至 [阳胛/肘/臂]\");",
  "            prescription.push(...CyberMateriaMedica.routing.handTaiYang);",
  "        }",
  "",
  "        if (syndrome.needCleansing) {",
  "            prescription.push(...[\"滑石\", \"猪苓\", \"泽泻\", \"茯苓\", \"栀子\", \"牡丹皮\"]);",
  "        }",
  "",
  "        await this.execute(prescription);",
  "    }",
  "",
  "    async execute(herbs) {",
  "        console.log(\"%c[EXECUTION] 开始注入复合补丁流...\", \"color: #ffff00\");",
  "",
  "        for (let name of herbs) {",
  "            if (this.checkSafety(name)) {",
  "                this.activeBuffer.add(name);",
  "                console.log(`> 注入组件: [${name}] ... %c成功`, \"color: #00ff00\");",
  "            } else {",
  "                console.error(`> 注入组件: [${name}] ... 拦截！检测到生物冲突。`);",
  "            }",
  "            await new Promise(r => setTimeout(r, 50));",
  "        }",
  "",
  "        this.shutdown();",
  "    }",
  "",
  "    checkSafety(herbName) {",
  "        const violation = CyberMateriaMedica.firewall.find(f => f.subject === herbName);",
  "        if (violation) {",
  "            console.warn(`[SECURITY] ${herbName} 已加载。防火墙提示：忌食 ${JSON.stringify(violation.avoid)}`);",
  "        }",
  "        return true;",
  "    }",
  "",
  "    shutdown() {",
  "        console.log(`[FINAL_RECIPE]: ${Array.from(this.activeBuffer).join(\" -> \")}`);",
  "        console.log(`[STATUS]: 系统熵值已降低。`);",
  "        console.log(`(▀̿Ĺ̯▀̿ ̿) 愿代码与气血同在。`);",
  "    }",
  "}",
  "",
  "const engine = new CyberApothecary();",
  "",
  "engine.diagnoseAndPatch({",
  "    internalBlockage: true,",
  "    temp: \"NEUTRAL\",",
  "    organFailure: \"WATER_WEAK\",",
  "    fireStatus: \"XIANG_HUO_STRONG\",",
  "    targetPath: \"HAND_TAI_YANG\",",
  "    needCleansing: true",
  "});",
  "",
  "/**",
  " * 额外的逻辑碎片：",
  " * if(brain === null) { reboot(); }",
  " * while(!coffee) { complain(); }",
  " * 附子气浓，大黄味浓，阴阳交织，代码纵横。",
  " */"
];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');
  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '1');
  
  textFont("monospace");
  textSize(fontSize);
  frameRate(60);

  nextY = height / 2;
}

function draw() {
  background(0, 70);

  // Draw all lines
  for (let line of codeLines) {
    drawGlowingText(line.text, line.x, line.y);
  }

  // Cursor blink logic
  cursorCounter++;
  if (cursorCounter >= cursorBlinkSpeed) {
    cursorCounter = 0;
    cursorVisible = !cursorVisible;
  }

  // Start typing a new line after a pause
  frameCounter++;
  if (frameCounter >= scrollSpeed && !isTyping) {
    frameCounter = 0;
    startTyping();
  }

  // Type characters
  if (isTyping) {
    typeCharacter();
  }

  // Draw cursor
  if (cursorVisible && codeLines.length > 0) {
    drawCursor();
  }
}

// -------------------------
// Typing control
// -------------------------
function startTyping() {
  currentSnippet = random(funSnippets);
  currentIndex = 0;
  isTyping = true;

  codeLines.push({
    text: "",
    x: margin,
    y: nextY
  });
}

function typeCharacter() {
  typingCounter++;
  if (typingCounter < typingSpeed) return;
  typingCounter = 0;

  let currentLine = codeLines[codeLines.length - 1];
  currentLine.text += currentSnippet[currentIndex];
  currentIndex++;

  if (currentIndex >= currentSnippet.length) {
    isTyping = false;
    nextY += lineHeight;
    handleScroll();
  }
}

// -------------------------
// Scrolling logic
// -------------------------
function handleScroll() {
  if (nextY + lineHeight > height - margin) {
    for (let line of codeLines) {
      line.y -= lineHeight;
    }
    nextY -= lineHeight;
  }

  codeLines = codeLines.filter(
    line => line.y > margin - lineHeight
  );
}

// -------------------------
// Cursor
// -------------------------
function drawCursor() {
  let lastLine = codeLines[codeLines.length - 1];
  let cursorX = lastLine.x + textWidth(lastLine.text) + 6;
  let cursorY = lastLine.y - fontSize + 4;

  drawingContext.shadowBlur = 6;
  drawingContext.shadowColor = color(0, 255, 70);

  noStroke();
  fill(0, 255, 70);
  rect(cursorX, cursorY, cursorSize, cursorSize);

  drawingContext.shadowBlur = 0;
}

// -------------------------
// Glowing text
// -------------------------
function drawGlowingText(txt, x, y) {
  for (let i = 4; i > 0; i--) {
    fill(0, 255, 70, 40 * i);
    text(txt, x, y);
  }
  fill(0, 255, 70);
  text(txt, x, y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Clear all previous lines
  codeLines = [];

  // Reset typing state
  isTyping = false;
  currentSnippet = "";
  currentIndex = 0;
  typingCounter = 0;
  frameCounter = 0;

  // Reset cursor
  cursorCounter = 0;
  cursorVisible = true;

  // Reset starting position
  nextY = height / 2;
}

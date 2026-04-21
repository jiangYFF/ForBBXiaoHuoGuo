const comfortMessages = [
  "江江在！",
  "在的！",
  "干嘛 (○｀ 3′○)",
  "还戳我！！",
  "快回我微信！",
  "吃饭了吗",
  "戳我干嘛~",
  "(#^.^#)",
  "今天开心吗！",
  "hhhh",
  "宝宝",
  "小宝~ 你是最可爱的宝宝",
  "小火锅在不在！(｡•̀ᴗ-)✧",
  "理理我嘛～(˃ ⌑ ˂ഃ )",
  "你是不是又在发呆(｡•́︿•̀｡)",
  "喂喂喂 小火锅收信！(ﾉ>ω<)ﾉ",
  "不许装没看见我",
  "今天也要做可爱小火锅",
  "小火锅辛苦啦(っ˘ω˘ς )",
  "你现在有没有偷偷叹气",
  "先回我一下下！(╥﹏╥)",
  "让我看看是谁还没吃饭",
  "又被我抓到啦٩(ˊᗜˋ*)و",
  "你已经很棒啦 小火锅",
  "今天有没有乖乖照顾自己( •̀ .̫ •́ )✧",
  "别皱眉啦 我看见了(´ . .̫ . `)",
  "小火锅请签收一个抱抱",
  "怎么不说话呀(｡•́ - •̀｡)",
  "你一出现我就开心了(๑´>᎑<)~*",
  "小火锅今天也会顺顺的",
  "你先别凶自己",
  "给你贴一个夸夸૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა",
  "我来查岗啦！ᐠ( ᐢ ᵕ ᐢ )ᐟ",
  "累了就偷偷戳一下嘛(っ ̯ -｡)"
];

const noteMessages = [
  "每个人都会有自己的开心基线，但你也可以一点点把它找回来。",
  "今天的目标不是一下子好起来，是先别再对自己那么严格。",
  "不是非要像别人那样开心，你也可以有属于小火锅版本的开心。",
  "世界有时候很怪，但你是会做水煮菜的小火锅。",
  "如果今天只是稳稳地活着，那也已经很了不起了。"
];

const moodMap = {
  1: "今天就先缩进软软的小毯子里吧，先活过这一小会儿就很好。",
  2: "你可以慢一点，不需要为了证明自己而立刻振作。",
  3: "今天就先不用逼自己发光，能稳稳地待着也很厉害。",
  4: "有一点暖起来了，那就把这点暖收好，留给等会儿的自己。",
  5: "看，你真的有在慢慢回到自己身边，这份亮亮的是属于你的。"
};

const softenedReplies = [
  "换句话说：瞎说！小火锅才不是小废物",
  "换句话说：瞎说！你明明是最可爱的宝宝",
  "换句话说：不管！江江抱抱🤗",
  "换句话说：才不是呢！",
  "换句话说：小火锅不需要审判！！"
];

let currentNote = noteMessages[0];
let isRecordPlaying = false;
let lyricTimerId = null;
let introTimerId = null;

function initApp() {
  bindEvents();
  setupIntroScreen();
  updateMoodCard(3);
  renderStars(7);
  updateRecordPlayer(false);
}
// 方法备注：初始化页面默认状态，并把所有交互先挂好。

function bindEvents() {
  const comfortButton = document.getElementById("comfort-button");
  const introButton = document.getElementById("intro-button");
  const recordToggle = document.getElementById("record-toggle");
  const recordToggleCopy = document.getElementById("record-toggle-copy");
  const moodRange = document.getElementById("mood-range");
  const noteButton = document.getElementById("note-button");
  const favoriteButton = document.getElementById("favorite-button");
  const releaseButton = document.getElementById("release-button");

  introButton.addEventListener("click", dismissIntroScreen);
  comfortButton.addEventListener("click", handleComfortClick);
  recordToggle.addEventListener("click", toggleRecordPlayer);
  recordToggleCopy.addEventListener("click", toggleRecordPlayer);
  moodRange.addEventListener("input", handleMoodInput);
  noteButton.addEventListener("click", drawNote);
  favoriteButton.addEventListener("click", saveFavoriteNote);
  releaseButton.addEventListener("click", releaseWorry);
}
// 方法备注：集中注册按钮、滑块和文本区域的事件，方便后面统一检查。

function setupIntroScreen() {
  document.body.classList.add("is-locked");
  introTimerId = window.setTimeout(() => {
    dismissIntroScreen();
  }, 2600);
}
// 方法备注：页面刚打开时先显示开场层，并设置一个自动淡出的时间。

function dismissIntroScreen() {
  const introScreen = document.getElementById("intro-screen");

  if (!introScreen || introScreen.classList.contains("is-hidden")) {
    return;
  }

  window.clearTimeout(introTimerId);
  introScreen.classList.add("is-hidden");
  introScreen.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}
// 方法备注：手动或自动关闭开场动画，同时恢复页面的正常滚动和点击。

function handleComfortClick() {
  const message = pickRandomItem(comfortMessages);
  spawnComfortBubble(message);
}
// 方法备注：点击“安慰”按钮后随机取一句暖话，并丢到页面上飘起来。

function handleMoodInput(event) {
  updateMoodCard(Number(event.target.value));
}
// 方法备注：读取当前滑块位置，把心情卡片同步更新成对应文案。

function updateMoodCard(level) {
  const moodLevel = document.getElementById("mood-level");
  const moodText = document.getElementById("mood-text");
  const moodCard = document.getElementById("mood-card");
  const hueStrength = 18 + level * 6;

  moodLevel.textContent = `温度 ${level} / 5`;
  moodText.textContent = moodMap[level];
  moodCard.style.background = `linear-gradient(180deg, rgba(255, 250, 246, 0.95), rgba(255, ${245 - hueStrength}, ${247 - level * 3}, 0.92))`;
}
// 方法备注：根据温度值切换心情文字，同时微调卡片底色让反馈更直观。

function drawNote() {
  const noteContent = document.getElementById("note-content");

  currentNote = pickRandomItem(noteMessages);
  noteContent.textContent = currentNote;
  noteContent.animate(
    [
      { opacity: 0.45, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    {
      duration: 260,
      easing: "ease-out"
    }
  );
}
// 方法备注：抽取一张新的小纸条，并给文字一个很轻的出现动画。

function saveFavoriteNote() {
  const favoriteStrip = document.getElementById("favorite-strip");

  favoriteStrip.textContent = `已收藏：${currentNote}`;
}
// 方法备注：把当前纸条内容放进“收藏”区域，形成一个简单的记住动作。

function toggleRecordPlayer() {
  isRecordPlaying = !isRecordPlaying;
  updateRecordPlayer(isRecordPlaying);
}
// 方法备注：切换黑胶唱片的播放状态，让转盘、按钮文案和歌词高亮一起变化。

function updateRecordPlayer(isPlaying) {
  const recordStage = document.getElementById("record-stage");
  const recordToggle = document.getElementById("record-toggle");
  const recordToggleCopy = document.getElementById("record-toggle-copy");

  recordStage.classList.toggle("is-playing", isPlaying);
  recordToggle.setAttribute("aria-pressed", String(isPlaying));
  recordToggleCopy.textContent = isPlaying ? "暂停这张小唱片" : "播放这张小唱片";

  runLyricCycle(isPlaying);
}
// 方法备注：根据播放状态统一更新留声机外观，并启动或停止歌词轮播。

function runLyricCycle(isPlaying) {
  const lyricLines = Array.from(document.querySelectorAll(".lyric-line"));

  window.clearInterval(lyricTimerId);
  setActiveLyricLine(0);

  if (!isPlaying) {
    return;
  }

  let activeIndex = 0;
  lyricTimerId = window.setInterval(() => {
    activeIndex = (activeIndex + 1) % lyricLines.length;
    setActiveLyricLine(activeIndex);
  }, 1800);
}
// 方法备注：播放时按顺序点亮歌词，暂停时就停在第一句上。

function setActiveLyricLine(activeIndex) {
  const lyricLines = Array.from(document.querySelectorAll(".lyric-line"));

  lyricLines.forEach((line, index) => {
    line.classList.toggle("lyric-line-active", index === activeIndex);
  });
}
// 方法备注：把当前需要突出的那一行歌词加亮，其余行退回柔和状态。

function releaseWorry() {
  const worryInput = document.getElementById("worry-input");
  const releaseResult = document.getElementById("release-result");
  const value = worryInput.value.trim();

  if (!value) {
    releaseResult.textContent = "先写一句也没关系，哪怕只是“我今天有点难过”。";
    renderStars(4);
    return;
  }

  releaseResult.textContent = `${pickRandomItem(softenedReplies)} 原句是：“${value}”`;
  worryInput.value = "";
  renderStars(10);
}
// 方法备注：读取输入的烦恼，换成更温柔的表达，再顺手刷新一片星星效果。

function spawnComfortBubble(message) {
  const floatingArea = document.getElementById("floating-area");
  const bubble = document.createElement("div");

  bubble.className = "floating-bubble";
  bubble.textContent = message;
  floatingArea.appendChild(bubble);

  window.setTimeout(() => {
    bubble.remove();
  }, 3800);
}
// 方法备注：动态生成一个会向上飘走的小气泡，用来承载安慰文字。

function renderStars(count) {
  const starField = document.getElementById("star-field");

  starField.innerHTML = "";

  for (let index = 0; index < count; index += 1) {
    const star = document.createElement("span");
    star.className = "tiny-star";
    star.textContent = index % 2 === 0 ? "✦" : "✧";
    star.style.left = `${8 + Math.random() * 84}%`;
    star.style.top = `${10 + Math.random() * 58}px`;
    star.style.animationDelay = `${Math.random() * 1.8}s`;
    starField.appendChild(star);
  }
}
// 方法备注：在底部区域生成随机分布的小星星，增加被“吹散”后的轻盈感。

function pickRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);

  return items[randomIndex];
}
// 方法备注：从给定数组里随机抽一项，给多处交互复用。

document.addEventListener("DOMContentLoaded", initApp);

// ============================================================
// 减脂计划 · 共享数据源 v1.0
// 用途：4个HTML文件共享的数据、视频BV号、天气逻辑
// 更新：改此处一处，所有页面自动同步
// ============================================================

// ---- 核心指标 ----
const FIT = {
  metrics: {
    protein: 100, proteinBf: 27, proteinLu: 20, proteinDn: 53,
    water: '2.5L', waterSeg: 5, waterPer: '400ml',
    sleepH: 7, sleepBed: '00:00', sleepWake: '07:00',
    exercise: '90′'
  },
  body: {
    gender: '男', age: 40, height: 170, weight: 83.25, bmi: 28.7,
    goal: '63-70', location: '株洲 · 石峰区', commute: '小电动通勤'
  },

  // ---- B站视频BV号注册表（所有BV号的唯一来源） ----
  vids: {
    shoulderRehab:  { bv: 'BV1WM411U7yq', title: '倍他运动康复 · 肩袖弹力带', plays: '99万' },
    morningCardio:  { bv: 'BV1oLpFeGEu6', title: 'MIZI · 20分钟晨起空腹有氧', plays: '14.5万' },
    morningCore:    { bv: 'BV1Ss421P7Uz', title: 'MIZI · 15分钟腹部核心（零基础）' },
    morningYoga:    { bv: 'BV1M9GC6uE1V', title: 'Yoga With Nancy · 16分钟晨间舒展' },
    cardioMarina:   { bv: 'BV1ge6ZB2ECj', title: 'Marina Takewaki · 30分钟燃脂', plays: '6.1万' },
    stretchEleni:   { bv: 'BV1j35azKEWA', title: 'Eleni Fit · 20分钟全身拉伸' },
    yogaEleni:      { bv: 'BV1sWs5z8Enm', title: 'Eleni Fit · 30分钟瑜伽拉伸' },
    pullWorkout:    { bv: 'BV1bB54zGEeT', title: '棠晞xx · 弹力带还原背部训练' },
    pushWorkout:    { bv: 'BV16SGH6aEyU', title: '阿龙新手健身 · 居家三分化 胸+三头' },
    legWorkout:     { bv: 'BV1Ry4y1Y7rP', title: '帅soserious · 8′高效臀腿' },
    sundayStretch:  { bv: 'BV1MjXZBGEVt', title: '阿见见 · 20分钟拉伸全身' },
    theoryNewbie:   { bv: 'BV1Hk4y187jF', title: '好人松松 · 健身新手训练完全手册' },
    warmupSaturday: { bv: 'BV1Q4411A7Kw', title: '周六野 · 10分钟全身动态热身' },
    shoulderWarmup: { bv: 'BV1E2RkBWEFs', title: '骨科康复师 · 上肢完整热身' },
    foamRoller:     { bv: 'BV1wY4y1h7Bd', title: '健身普拉斯 · 40分钟全身泡沫轴' },
    cardioJo:       { bv: 'BV1cs421w77d', title: 'Jo姐 · 30′膝盖友好有氧' },
    cardioBurpee:   { bv: 'BV1we411j7YV', title: 'Burpeegirl · 30′华语歌单' },
    pullTheory:     { bv: 'BV18jxRznELd', title: '梅林FIT · 三分化4.0 拉日' },
    pushTheory:     { bv: 'BV1LhnmzFEEa', title: '梅林FIT · 三分化4.0 推日' },
    legTheory:      { bv: 'BV1FusRzAEYv', title: '梅林FIT · 三分化4.0 腿日' },
    cardioAltMizi:  { bv: 'BV1rZunziEST', title: 'MIZI + BLACKPINK · 22′' },
    cardioAltEleni: { bv: 'BV1wV4y1t7iv', title: 'EleniFit · 30′ 腰腹' },
    stretchAlt:     { bv: 'BV1gVLFzBEBN', title: '张德琪 · 6′拉伸' },
    stretchAltLong: { bv: 'BV1skaizGEqH', title: '暴躁小细菌 · 40′全身拉伸' }
  },

  // ---- 晚餐默认配置 ----
  dinner: {
    protein: '240g', veg: '300g', carb: '50g内',
    proteinOpts: '鸡胸肉 / 瘦牛肉（腿日用牛肉）',
    vegOpts: '黄瓜 / 丝瓜 / 菠菜 / 生菜 / 苋菜',
    carbOpts: '半根玉米80g / 小块南瓜200g / 半个红薯100g',
    note: '不吃西兰花'
  },

  // ---- 每日标签 ----
  dayLabels: ['纯恢复日','拉日训练','有氧+核心','推日训练','有氧+核心','腿日训练','力量维持+瑜伽'],
  dayKeys:   ['recovery','pull','cardio','push','cardio','leg','recovery'],

  // ---- 里程碑 ----
  milestones: [
    { wt: '85kg', label: '起点', time: '' },
    { wt: '80kg', label: '', time: '4–5周' },
    { wt: '75kg', label: '', time: '8–10周' },
    { wt: '70kg', label: '', time: '14–18周' },
    { wt: '65kg', label: '目标', time: '22–26周' }
  ],

  // ---- 天气 ----
  weather: {
    city: 'Zhuzhou', url: 'https://wttr.in/Zhuzhou?format=j1',
    cacheKey: 'fit_wx_cache', cacheTTL: 30 * 60 * 1000
  }
};

// ---- URL 工具 ----
FIT.bvUrl = function(bvid) {
  return 'https://player.bilibili.com/player.html?bvid=' + bvid + '&page=1&high_quality=1&autoplay=0';
};
FIT.bvLink = function(bvid) {
  return 'https://www.bilibili.com/video/' + bvid;
};

// ---- 天气 Emoji 映射 ----
function wxEmo(c) {
  if (c >= 200 && c < 300) return '⛈️';
  if (c >= 300 && c < 400) return '🌧️';
  if (c >= 500 && c < 600) return '🌧️';
  if (c >= 600 && c < 700) return '🌨️';
  if (c >= 700 && c < 800) return '🌫️';
  if (c === 801) return '🌤️';
  if (c > 801) return '☁️';
  return '☀️';
}

// ---- 天气获取（带 localStorage 缓存 30min） ----
function fetchWeather(callback) {
  var CACHE_KEY = FIT.weather.cacheKey;
  var CACHE_TTL = FIT.weather.cacheTTL;
  var cached;
  try { cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch(e) { cached = null; }

  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    callback(cached.data, null);
    return;
  }

  fetch(FIT.weather.url)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data })); } catch(e) {}
      callback(data, null);
    })
    .catch(function(err) {
      if (cached) { callback(cached.data, null); }
      else { callback(null, err); }
    });
}

// ---- 从 wttr.in 响应中提取明日天气 ----
function extractTomorrow(d) {
  if (!d || !d.weather || !d.weather[1]) return null;
  var tw = d.weather[1];
  var hourly = tw.hourly || [];
  var mid = Math.floor(hourly.length / 2);
  var evRain = hourly.filter(function(h) {
    var hr = parseInt(h.time) / 100;
    return hr >= 17 && hr <= 20;
  }).some(function(h) { return parseInt(h.chanceofrain) > 30; });
  return {
    minTemp: tw.mintempC, maxTemp: tw.maxtempC,
    desc: hourly.length ? hourly[mid].weatherDesc[0].value : '',
    weatherCode: hourly.length ? parseInt(hourly[mid].weatherCode) : 0,
    evRain: evRain
  };
}

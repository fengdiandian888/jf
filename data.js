// ============================================================
// 减脂计划 · 共享数据源 v3.0 — 2026-06-25 全男性博主
// 用途：4个HTML文件共享的数据、视频BV号、天气逻辑
// 更新：改此处一处，所有页面自动同步
// v3.0: 全部跟练视频替换为男性博主（游书庭/刘畊宏/梅林FIT/凯圣王/闫帅奇/张德琪）
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
    morningCardio:  { bv: 'BV1e541197y8', title: '刘畊宏 · 18分钟晨间暖身训练', plays: '254.6万', note: '提高代谢·运动前提升心率' },
    morningCore:    { bv: 'BV182eRzuEMD', title: '游书庭 · 20分钟瘦腰腹核心', note: '全程站立·无跳跃·大体重友好' },
    morningYoga:    { bv: 'BV1gVLFzBEBN', title: '张德琪 · 6分钟晨间柔韧拉伸' },
    cardioMain:     { bv: 'BV1KH4y137xv', title: '游书庭 · 30分钟无跳跃有氧HIIT', plays: '277万', note: '大体重/新手·无跳跃·膝盖友好' },
    cardioAlt2:     { bv: 'BV1pr4y1t7BZ', title: '刘畊宏 · 30分钟有氧快乐健身操', plays: '1459.8万', note: '附带拉伸·无剧烈运动·男女皆宜' },
    stretchEleni:   { bv: 'BV1Eu41187oU', title: '凯圣王 · 躯干拉伸', plays: '21.7万', note: '7′41″·新手增肌系列·运动后必做' },
    yogaEleni:      { bv: 'BV18P411v72s', title: '凯圣王 · 四肢拉伸', plays: '18.4万', note: '7′16″·新手增肌系列·恢复日必做' },
    pullWorkout:    { bv: 'BV162421N7Xs', title: '梅林FIT · 弹力绳三分化 背+二头', plays: '5.5万', note: '45′59″·完整跟练·弹力绳拉日' },
    pushWorkout:    { bv: 'BV16SGH6aEyU', title: '阿龙新手健身 · 居家三分化 胸+三头', note: '13′49″·无器械·适合新手' },
    legWorkout:     { bv: 'BV15C41137dN', title: '梅林FIT · 弹力绳三分化 肩+臀腿', plays: '3.5万', note: '47′42″·完整跟练·弹力绳腿日' },
    sundayStretch:  { bv: 'BV1MjXZBGEVt', title: '阿见见 · 20分钟拉伸全身' },
    theoryNewbie:   { bv: 'BV1Hk4y187jF', title: '好人松松 · 健身新手训练完全手册' },
    warmupSaturday: { bv: 'BV1DbM2eKEe2', title: '游书庭 · 5分钟暖身操', plays: '3.8万', note: '5′26″·居家运动前必做·唤醒肌肉' },
    shoulderWarmup: { bv: 'BV1E2RkBWEFs', title: '骨科康复师 · 上肢完整热身' },
    foamRoller:     { bv: 'BV1wY4y1h7Bd', title: '健身普拉斯 · 40分钟全身泡沫轴' },
    cardioJo:       { bv: 'BV182eRzuEKL', title: '游书庭 · 30分钟站立式全身燃脂', note: '零跳跃·不伤膝盖·简单有效' },
    cardioBurpee:   { bv: 'BV1KH4y137xv', title: '游书庭 · 30分钟无跳跃HIIT', note: '大体重/新手友好·零跳跃' },
    pullTheory:     { bv: 'BV18jxRznELd', title: '梅林FIT · 三分化4.0 拉日' },
    pushTheory:     { bv: 'BV1LhnmzFEEa', title: '梅林FIT · 三分化4.0 推日' },
    legTheory:      { bv: 'BV1FusRzAEYv', title: '梅林FIT · 三分化4.0 腿日' },
    cardioAltMizi:  { bv: 'BV1pr4y1t7BZ', title: '刘畊宏 · 30分钟有氧快乐健身操', note: '附带拉伸·男女皆宜' },
    cardioAltEleni: { bv: 'BV1bz411b7HH', title: '闫帅奇 · 健身前全身热身训练', plays: '71.2万', note: '5′53″·收藏向·激活全身' },
    stretchAlt:     { bv: 'BV1shM2eTEhW', title: '游书庭 · 6分钟收操拉伸', note: '训练后·全身放松舒展' },
    stretchAltLong: { bv: 'BV1skaizGEqH', title: '暴躁小细菌 · 40′全身拉伸' },
    bandFullBody:   { bv: 'BV1ZT4y1U7vX', title: 'Erik埃里克 · 弹力带全身训练', plays: '180万', note: '19′49″·无跳跃·膝盖友好·周六维持日' },
    pushBandPro:    { bv: 'BV1VF4m1L7Mb', title: '梅林FIT · 弹力绳三分化 胸+三头', plays: '5.3万', note: '50′56″·完整跟练·弹力绳推日' }
  },

  // ---- 抖音精选视频（点击跳转抖音App观看） ----
  douyin: {
    cardio1:   { id: '7633005394315387062', title: '30分钟无跳跃有氧｜大体重膝盖友好', note: '不跳不蹲不废膝盖·全程低冲击' },
    cardio2:   { id: '7615091538897944006', title: '大体重减脂必练·低冲击无跳跃', note: '护膝燃脂·全程暴汗跟练' },
    legs:      { id: '7604314582463141221', title: 'MIZI搬运·30分钟无器械臀腿', note: '无跳跃·居家练翘臀美腿' },
    pull:      { id: '7621139006446168753', title: '三分化拉日训练记录·背+肩后束+二头', note: '丹尼Danny·训练记录参考' },
    legBand:   { id: '7566585849870711616', title: '弹力绳三分化腿日·彬哥居家教练', note: '收藏跟着练·居家弹力绳腿日' }
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

FIT.dyUrl = function(vid) {
  return 'https://www.douyin.com/video/' + vid;
};
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

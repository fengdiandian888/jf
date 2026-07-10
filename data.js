// ============================================================
// 减脂计划 · 共享数据源 v3.0 — 2026-06-25 全男性博主
// 用途：4个HTML文件共享的数据、视频BV号、天气逻辑
// 更新：改此处一处，所有页面自动同步
// v3.0: 全部跟练视频替换为男性博主（游书庭/刘畊宏/梅林FIT/凯圣王/闫帅奇/张德琪）
// v3.1: 新增哑铃器械（单手最重20KG），力量训练大幅升级
// v3.2: 哑铃指导跟练视频全覆盖（梅林FIT哑铃二分化/三分化）
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
  // 器材
  equipment: {
    bands: true,
    jumpRope: { have: true, usable: false, reason: 'BMI≥25，等75kg以下再用' },
    mat: true,
    dumbbell: { have: true, maxPerHandKg: 20, note: '' },
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
    pullWorkout:    { bv: 'BV1uZ42127Gz', title: '梅林FIT · 二分化拉日 哑铃增肌', plays: '12.8万', note: '52′·一对哑铃·背+二头·新手时间少首选', dbType: true },
    pullBandAlt:    { bv: 'BV162421N7Xs', title: '梅林FIT · 弹力绳三分化 背+二头', plays: '5.5万', note: '45′59″·弹力绳备选版' },
    pushWorkout:    { bv: 'BV1qF4m1M7rL', title: '梅林FIT · 二分化推日 哑铃增肌', plays: '34万', note: '51′45″·一对哑铃·胸+三头·肩安全关注', dbType: true },
    pushBandAlt:    { bv: 'BV16SGH6aEyU', title: '阿龙新手健身 · 居家三分化 胸+三头', note: '13′49″·无器械·弹力绳备选' },
    legWorkout:     { bv: 'BV1RW42197ez', title: '梅林FIT · 三分化 哑铃增肌 肩+臀腿', plays: '33.6万', note: '66′30″·哑铃臀腿·收藏1.6万·一步到位', dbType: true },
    legBandAlt:     { bv: 'BV15C41137dN', title: '梅林FIT · 弹力绳三分化 肩+臀腿', plays: '3.5万', note: '47′42″·弹力绳备选版' },
    fullBodyDB:     { bv: 'BV11cmmYeED4', title: '梅林FIT · 20分钟哑铃全身塑形', plays: '9.3万', note: '21′·轻量哑铃·周六维持日·新手友好', dbType: true },
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

// ---- FOODS 数据库（全站唯一来源，供饮食参考页 + 今日计划页共享） ----
// v8.3: 从两个HTML中提取到此处统一管理
window.FOODS = (function() {
  return {
    // --- 蛋白质 ---
    '鸡蛋':       { cat:'meat', cal:144,pro:13,  carb:1.5, fat:9,   portion:100, unit:'g≈2个', tip:'全蛋营养',      meals:['breakfast','lunch','dinner'] },
    '牛奶':       { cat:'meat', cal:54, pro:3,   carb:3.4, fat:3.2, portion:250, unit:'ml',    tip:'补钙·全脂',     meals:['breakfast'] },
    '无糖酸奶':   { cat:'meat', cal:63, pro:3.5, carb:4.5, fat:3.2, portion:200, unit:'ml',    tip:'补钙·益生菌',   meals:['breakfast'] },
    '鸡胸肉':     { cat:'meat', cal:133,pro:30,  carb:0,   fat:1.5, portion:150, unit:'g生重', tip:'高蛋白低脂',    meals:['lunch','dinner'] },
    '瘦猪肉':     { cat:'meat', cal:143,pro:20,  carb:1,   fat:7,   portion:180, unit:'g生重', tip:'里脊/后腿',     meals:['lunch','dinner'] },
    '瘦牛肉':     { cat:'meat', cal:125,pro:22,  carb:0,   fat:4,   portion:180, unit:'g生重', tip:'补铁最佳·炒',   meals:['lunch','dinner'] },
    '虾仁':       { cat:'meat', cal:99, pro:20,  carb:0,   fat:1,   portion:180, unit:'g生重', tip:'几乎零脂肪',    meals:['lunch','dinner'] },
    '草鱼块':     { cat:'meat', cal:113,pro:18,  carb:0,   fat:4.5, portion:180, unit:'g',     tip:'清蒸最佳',      meals:['lunch','dinner'] },
    '鸭腿':       { cat:'meat', cal:135,pro:18,  carb:0,   fat:6.5, portion:180, unit:'g生重', tip:'去皮·焖/炖',    meals:['lunch','dinner'] },
    '龙利鱼':     { cat:'meat', cal:88, pro:18,  carb:0,   fat:1.5, portion:200, unit:'g',     tip:'便宜无刺·清蒸', meals:['lunch','dinner'] },
    '鸭胸':       { cat:'meat', cal:155,pro:15,  carb:0.5, fat:10,  portion:180, unit:'g生重', tip:'去皮·稍肥',     meals:['lunch','dinner'] },
    '鲈鱼':       { cat:'meat', cal:105,pro:18.6,carb:0,   fat:3.4, portion:200, unit:'g',     tip:'清蒸·肉嫩',    meals:['lunch','dinner'] },
    '羊肉':       { cat:'meat', cal:118,pro:19,  carb:0,   fat:4.5, portion:180, unit:'g生重', tip:'选瘦·补铁',     meals:['lunch','dinner'] },
    '鸡腿(去皮)': { cat:'meat', cal:119,pro:20,  carb:0,   fat:4,   portion:200, unit:'g生重', tip:'比鸡胸嫩',      meals:['lunch','dinner'] },

    // --- 豆制品 ---
    '无糖豆浆':   { cat:'soy',  cal:31, pro:3,   carb:1.2, fat:1.6, portion:250, unit:'ml',   tip:'无糖·低热量',   meals:['breakfast'] },
    '嫩豆腐':     { cat:'soy',  cal:62, pro:6.5, carb:2,   fat:3.5, portion:200, unit:'g',    tip:'做汤/凉拌',     meals:['lunch','dinner'] },
    '老豆腐':     { cat:'soy',  cal:81, pro:8.1, carb:2.8, fat:3.7, portion:180, unit:'g',    tip:'炒/煎不散',     meals:['lunch','dinner'] },
    '豆干':       { cat:'soy',  cal:142,pro:16.2,carb:2.8, fat:7,   portion:100, unit:'g',    tip:'蛋白密度高',    meals:['lunch','dinner'] },
    '千张':       { cat:'soy',  cal:260,pro:24.5,carb:5.5, fat:16,  portion:70,  unit:'g',    tip:'热量偏高',      meals:['lunch','dinner'] },
    '毛豆':       { cat:'soy',  cal:131,pro:13.1,carb:10,  fat:5,   portion:100, unit:'g',    tip:'植物蛋白高',    meals:['lunch','dinner'] },
    '素鸡':       { cat:'soy',  cal:165,pro:17,  carb:5,   fat:9,   portion:80,  unit:'g',    tip:'口感像肉',      meals:['lunch','dinner'] },

    // --- 蔬菜 ---
    '番茄':  { cat:'veg',cal:20, pro:0.9,carb:4,   fat:0.2,portion:200,unit:'g',tip:'炒蛋/煮汤',  meals:['lunch','dinner'] },
    '丝瓜':  { cat:'veg',cal:20, pro:1,  carb:3,   fat:0.2,portion:250,unit:'g',tip:'当季·清炒',  meals:['lunch','dinner'] },
    '空心菜':{ cat:'veg',cal:23, pro:2.2,carb:2.2, fat:0.3,portion:250,unit:'g',tip:'株洲天天有', meals:['lunch','dinner'] },
    '苋菜':  { cat:'veg',cal:25, pro:2.8,carb:3,   fat:0.3,portion:250,unit:'g',tip:'红苋菜·补铁',meals:['lunch','dinner'] },
    '茄子':  { cat:'veg',cal:25, pro:1.1,carb:4.9, fat:0.2,portion:250,unit:'g',tip:'少油蒸拌',   meals:['lunch','dinner'] },
    '豆角':  { cat:'veg',cal:34, pro:2.5,carb:6,   fat:0.3,portion:200,unit:'g',tip:'务必炒熟',   meals:['lunch','dinner'] },
    '黄瓜':  { cat:'veg',cal:16, pro:0.8,carb:2.9, fat:0.2,portion:250,unit:'g',tip:'生吃凉拌',   meals:['lunch','dinner'] },
    '冬瓜':  { cat:'veg',cal:12, pro:0.4,carb:2.6, fat:0.1,portion:300,unit:'g',tip:'热量最低',   meals:['lunch','dinner'] },
    '韭菜':  { cat:'veg',cal:26, pro:2.4,carb:3.2, fat:0.4,portion:150,unit:'g',tip:'炒蛋经典',   meals:['lunch','dinner'] },
    '蘑菇类':{ cat:'veg',cal:25, pro:2.5,carb:2,   fat:0.3,portion:200,unit:'g',tip:'热量极低',   meals:['lunch','dinner'] },
    '西兰花':{ cat:'veg',cal:34, pro:2.8,carb:4,   fat:0.4,portion:200,unit:'g',tip:'健身标配',   meals:['lunch','dinner'] },
    '白菜':  { cat:'veg',cal:13, pro:1.5,carb:2,   fat:0.2,portion:300,unit:'g',tip:'便宜量足',   meals:['lunch','dinner'] },
    '芹菜':  { cat:'veg',cal:14, pro:0.8,carb:2.5, fat:0.1,portion:200,unit:'g',tip:'炒牛肉绝配', meals:['lunch','dinner'] },
    '菠菜':  { cat:'veg',cal:28, pro:2.6,carb:2.8, fat:0.3,portion:200,unit:'g',tip:'补铁补叶酸', meals:['lunch','dinner'] },
    '生菜':  { cat:'veg',cal:15, pro:1.4,carb:2,   fat:0.2,portion:250,unit:'g',tip:'生吃凉拌',   meals:['lunch','dinner'] },
    '秋葵':  { cat:'veg',cal:31, pro:2,  carb:4,   fat:0.2,portion:150,unit:'g',tip:'白灼最佳',   meals:['lunch','dinner'] },
    '荷兰豆':{ cat:'veg',cal:42, pro:4.5,carb:4,   fat:0.4,portion:150,unit:'g',tip:'蛋白较高',   meals:['lunch','dinner'] },

    // --- 主食 ---
    '燕麦片':  { cat:'staple',cal:377,pro:13.5,carb:66,  fat:6.5,portion:50, unit:'g干重',   tip:'高纤维饱腹',      meals:['breakfast'] },
    '玉米':    { cat:'staple',cal:112,pro:4,   carb:22.8,fat:1.2,portion:200,unit:'g≈1根',  tip:'优质粗粮',        meals:['breakfast','lunch','dinner'] },
    '红薯':    { cat:'staple',cal:102,pro:1.6, carb:23.1,fat:0.2,portion:200,unit:'g生重',  tip:'慢碳水',          meals:['lunch','dinner'] },
    '全麦面包':{ cat:'staple',cal:265,pro:10.5,carb:47,  fat:4,  portion:80, unit:'g≈2~3片',tip:'膳食纤维',        meals:['breakfast'] },
    '南瓜':    { cat:'staple',cal:26, pro:1,   carb:6,   fat:0.1,portion:300,unit:'g',       tip:'碳水偏低',        meals:['lunch','dinner'] },
    '杂粮饭':  { cat:'staple',cal:140,pro:3.5, carb:28,  fat:0.8,portion:150,unit:'g熟重',  tip:'大米小米糙米',    meals:['lunch','dinner'] },
    '米饭':    { cat:'staple',cal:116,pro:2.6, carb:25.9,fat:0.3,portion:150,unit:'g熟重',  tip:'优先杂粮饭',      meals:['lunch','dinner'] },
    '土豆':    { cat:'staple',cal:81, pro:2,   carb:17.5,fat:0.2,portion:250,unit:'g',       tip:'蒸煮最好',        meals:['lunch','dinner'] },
    '紫薯':    { cat:'staple',cal:82, pro:2.5, carb:17,  fat:0.2,portion:200,unit:'g生重',  tip:'花青素·慢碳水',   meals:['lunch','dinner'] },
    '山药':    { cat:'staple',cal:57, pro:1.9, carb:12.4,fat:0.2,portion:200,unit:'g',       tip:'养胃·蒸着吃',    meals:['lunch','dinner'] },
    '芋头':    { cat:'staple',cal:75, pro:2.2, carb:16,  fat:0.2,portion:200,unit:'g',       tip:'替代部分主食',    meals:['lunch','dinner'] },
    '荞麦面':  { cat:'staple',cal:350,pro:11,  carb:66,  fat:2.5,portion:80, unit:'g干重',   tip:'低GI·饱腹',      meals:['lunch','dinner'] },
  };
})();

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

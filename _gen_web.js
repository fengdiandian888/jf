// 网页版生成（带动作示范图）：从 plan.js 读取数据，渲染成单文件 HTML
// 图片来源：hasaneyldrm/exercises-dataset，经 jsDelivr CDN 引用
const plan = require('./utils/plan.js');
const fs = require('fs');

const CDN = 'https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main/images/';
// 动作名 -> 数据集图片 id-media_id（已人工校验，哑铃/自重优先）
const IMG = {
  // 推日
  "哑铃卧推（地板或凳）": "0289-SpYC0Kp",
  "上斜哑铃推举": "1283-bfiHMpI",
  "上斜俯卧撑（手撑凳/椅）": "0493-B1EVP9F",
  "坐姿哑铃推举": "0405-znQUdHY",
  "哑铃侧平举": "0334-DsgkuIt",
  "哑铃俯身臂屈伸（kickback）": "0333-W6PxUkg",
  "凳上臂屈伸（脚踩地）": "0129-RrLske5",
  // 拉日
  "单臂哑铃划船（俯身）": "0293-BJ0Hz5L",
  "自重反向划船": "0499-bZGHsAZ",
  "哑铃俯身反向飞鸟": "0383-EAs3xL9",
  "哑铃二头弯举": "0294-NbVPDMW",
  "锤式弯举（对握）": "0313-slDvUAU",
  "侧卧哑铃肩外旋": "0864-x306lCW",
  "超人（俯卧背伸展）": "1314-qLpO4vV",
  // 腿日
  "哑铃高脚杯深蹲": "1760-yn8yg1r",
  "哑铃相扑硬拉": "0300-nUwVh7b",
  "哑铃原地箭步蹲": "0336-RRWFUcw",
  "哑铃箱式深蹲": "",
  "站姿提踵": "0417-dPmaUaU",
  "臀桥": "3013-u0cNiij",
  "跪姿平板支撑": "3239-h1ezqSu",
  "仰卧抬腿": "1002-bbLR7fB",
  "死虫（仰卧对侧手脚）": "0276-iny3m5y",
  // 额外区块
  "靠墙俯卧撑": "0659-LEH9jxP",
  "徒手深蹲": "1760-yn8yg1r",
  "爬楼梯": "",
  "靠墙静蹲": "",
  "提踵": "1373-bJYHBIN",
  "原地高抬腿": "3655-J9zIWig",
  // 体态矫正
  "弓步髋屈肌拉伸": "1559-2LQkNPW",
  "猫牛式": "",
  "收下巴": "",
  "胸肌拉伸": "1259-QoHIhPl",
  "肩胛后缩夹背": "0359-e25F58f"
};

function exImg(name) {
  const m = IMG[name];
  if (!m) return '<div class="ex-noimg">暂无示范图</div>';
  return '<div class="ex-img-wrap"><img class="ex-img" loading="lazy" src="' + CDN + m + '.jpg" alt="' + name + '" onerror="hideImg(this)"></div>';
}

function chipType(t) {
  return { pro: 'c-pro', carb: 'c-carb', fat: 'c-fat', veg: 'c-veg' }[t] || 'c-def';
}

function renderRows(rows) {
  let cards = rows.map(function (r) {
    return '<div class="ex-card">' + exImg(r.name) +
      '<div class="body">' +
      '<div class="ex-name">' + r.name + '</div>' +
      '<div class="ex-meta">重量 ' + r.weight + ' ｜ 组数 ' + r.sets + ' ｜ 休息 ' + r.rest + '</div>' +
      '<div class="ex-tip">' + r.tip + '</div>' +
      '</div></div>';
  }).join('');
  return '<div class="ex-grid">' + cards + '</div>';
}

function renderPlans(plans) {
  return '<div class="plans">' + plans.map(function (p) {
    let items = p.items.map(function (it) {
      return '<div class="pi">· ' + it.act + ' ' + it.dur +
        (it.note ? '<span class="pn">' + it.note + '</span>' : '') + '</div>';
    }).join('');
    return '<div class="plan"><b>' + p.name + '</b>' + items + '</div>';
  }).join('') + '</div>';
}

function renderEx(d) {
  const ex = plan.days[d].ex;
  if (ex.rows) return renderRows(ex.rows);
  if (ex.plans) return renderPlans(ex.plans);
  if (ex.note) return '<p class="rest">' + ex.note + '</p>';
  return '';
}

function renderDiet(d) {
  const diet = plan.days[d].diet;
  let meals = diet.map(function (m) {
    let chips = m.f.map(function (f) {
      return '<span class="chip ' + chipType(f.type) + '">' + f.text + '</span>';
    }).join('');
    return '<div class="meal"><div class="m-time">' + m.t + '</div>' +
      '<div class="m-body"><div class="m-label">' + m.m + '</div>' +
      '<div class="m-food">' + chips + '</div></div>' +
      '<div class="m-k">' + (m.k || '') + '</div></div>';
  }).join('');
  return '<div class="diet">' + meals + '</div>';
}

function renderDay(d) {
  const day = plan.days[d];
  return '<section class="day">' +
    '<div class="day-h"><span class="dot ' + day.type + '"></span>' +
    '<span class="day-name">' + day.name + '</span>' +
    '<span class="day-sub">' + day.sub + '</span></div>' +
    '<div class="tags"><span class="tag">热量 ' + day.kcal + '</span>' +
    '<span class="tag warn">' + day.def + '</span>' +
    '<span class="tag">消耗 ' + day.burn + '</span></div>' +
    '<h3>训练</h3>' + renderEx(d) +
    '<h3>饮食</h3>' + renderDiet(d) +
    '<div class="walks">' + day.walks + '</div>' +
    '</section>';
}

function renderBlock(title, hint, list) {
  let cards = list.map(function (r) {
    return '<div class="ex-card">' + exImg(r.name) +
      '<div class="body">' +
      '<div class="ex-name">' + (r.icon ? r.icon + ' ' : '') + r.name + '</div>' +
      '<div class="ex-meta">' + r.sets + '</div>' +
      '<div class="ex-detail">' + r.detail + '</div>' +
      '<div class="ex-tip">' + r.tip + '</div>' +
      '</div></div>';
  }).join('');
  return '<section class="day"><div class="day-h"><span class="day-name">' + title + '</span>' +
    '<span class="day-sub">' + hint + '</span></div>' +
    '<div class="ex-grid">' + cards + '</div></section>';
}

function renderSupp() {
  let rows = Object.keys(plan.SUPP).map(function (t) {
    return '<div class="meal"><div class="m-time">' + t + '</div>' +
      '<div class="m-body"><div class="m-food">' + plan.SUPP[t] + '</div></div></div>';
  }).join('');
  return '<section class="day"><div class="day-h"><span class="day-name">补剂时间表</span>' +
    '<span class="day-sub">每天固定</span></div><div class="diet">' + rows + '</div></section>';
}

const days = plan.order.map(renderDay).join('');
const html = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>个人健身指南</title>' +
  '<style>' +
  '*{box-sizing:border-box}body{margin:0;font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;background:#f4f6f8;color:#1f2937;line-height:1.6}' +
  '.wrap{max-width:760px;margin:0 auto;padding:16px 14px 60px}' +
  '.hero{background:linear-gradient(135deg,#2b6cb0,#3182ce);color:#fff;border-radius:16px;padding:22px 20px;margin-bottom:18px}' +
  '.hero h1{margin:0 0 6px;font-size:22px}.hero p{margin:0;opacity:.92;font-size:14px}' +
  '.ov{background:#fff;border-radius:12px;padding:12px 14px;margin-bottom:18px;font-size:13px;color:#4b5563}' +
  '.day{background:#fff;border-radius:14px;padding:16px 16px 14px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,.05)}' +
  '.day-h{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:8px}' +
  '.day-name{font-size:17px;font-weight:700}.day-sub{font-size:13px;color:#6b7280}' +
  '.dot{width:10px;height:10px;border-radius:50%;display:inline-block}.dot.tr{background:#e53e3e}.dot.act{background:#319795}.dot.rs{background:#9ca3af}' +
  '.tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}' +
  '.tag{font-size:12px;background:#eef2f7;color:#374151;padding:3px 9px;border-radius:20px}.tag.warn{background:#fff3e0;color:#b45309}' +
  'h3{font-size:14px;color:#374151;margin:14px 0 8px;border-left:3px solid #3182ce;padding-left:8px}' +
  '.ex-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}' +
  '.ex-card{border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff}' +
  '.ex-img-wrap{height:170px;background:#f3f4f6;display:flex;align-items:center;justify-content:center}' +
  '.ex-img{max-width:100%;max-height:170px;object-fit:contain;display:block}' +
  '.ex-noimg{height:170px;display:flex;align-items:center;justify-content:center;background:#f3f4f6;color:#9ca3af;font-size:13px}' +
  '.body{padding:8px 10px 10px}.ex-name{font-weight:600;font-size:14px}.ex-meta{font-size:12px;color:#6b7280;margin-top:3px}' +
  '.ex-tip{font-size:12px;color:#9ca3af;margin-top:5px}.ex-detail{font-size:12px;color:#6b7280;margin-top:4px}' +
  '.rest{background:#f3f4f6;border-radius:8px;padding:10px 12px;color:#6b7280;font-size:13px}' +
  '.plans{display:flex;flex-direction:column;gap:10px}.plan{background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:8px 10px}' +
  '.plan b{font-size:13px}.pi{font-size:13px;color:#374151;margin-top:3px}.pn{color:#9ca3af;font-size:12px;margin-left:4px}' +
  '.diet{display:flex;flex-direction:column;gap:8px}.meal{display:flex;align-items:center;gap:10px;background:#f8fafc;border-radius:10px;padding:8px 10px}' +
  '.m-time{font-weight:700;font-size:13px;color:#3182ce;min-width:42px}.m-body{flex:1}.m-label{font-size:12px;color:#6b7280}' +
  '.m-food{display:flex;flex-wrap:wrap;gap:5px;margin-top:3px}.m-k{font-size:12px;color:#9ca3af;min-width:48px;text-align:right}' +
  '.chip{font-size:12px;padding:2px 8px;border-radius:6px}.c-pro{background:#dbeafe;color:#1e40af}.c-carb{background:#fef3c7;color:#92400e}' +
  '.c-fat{background:#dcfce7;color:#166534}.c-veg{background:#d1fae5;color:#065f46}.c-def{background:#e5e7eb;color:#374151}' +
  '.walks{margin-top:10px;font-size:13px;color:#6b7280;background:#f0fdf4;border-radius:8px;padding:8px 10px}' +
  '@media(max-width:480px){.ex-grid{grid-template-columns:1fr}}' +
  '</style></head><body><div class="wrap">' +
  '<div class="hero"><h1>个人健身指南</h1>' +
  '<p>男 ｜ 170 厘米 ｜ 81 公斤 → 65 公斤 ｜ 哑铃 · 自重 · 三分化 · 减脂保肌</p></div>' +
  '<div class="ov">每周安排：周一三五 力量训练（推 / 拉 / 腿），周二四六 骑车有氧，周日休息。日常步行算日常活动消耗。每个动作配示范图，看图即知做法。</div>' +
  days +
  renderBlock('每日额外训练', '每天做 · 低耗容量', plan.extra) +
  renderBlock('体态矫正 · 久坐体态修复', '每天做 · 慢做不计消耗（骨盆前倾 + 富贵包）', plan.posture) +
  renderSupp() +
  '</div><script>function hideImg(el){el.outerHTML=\'<div class="ex-noimg">暂无示范图</div>\';}</script></body></html>';

fs.writeFileSync(__dirname + '/index.html', html, 'utf8');
console.log('生成完成，字节数:', html.length);

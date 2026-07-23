// 主题持久化与切换（浅色 / 深色）
const KEY = 'jf_theme';

// 训练记录存储
const TRAIN_KEY = 'jf_trainlog_v1';
// JS 标准顺序（0=周日）
const WD = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
// 展示顺序：周一到周日
const WD_ORDER = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

function getTheme() {
  try {
    return wx.getStorageSync(KEY) || 'light';
  } catch (e) {
    return 'light';
  }
}

function setTheme(t) {
  try {
    wx.setStorageSync(KEY, t);
  } catch (e) {}
}

// 切换主题：更新 globalData + 存储，并对当前 page 做 setData
function toggleTheme(page) {
  const app = getApp();
  const next = app.globalData.theme === 'dark' ? 'light' : 'dark';
  app.globalData.theme = next;
  setTheme(next);
  if (page && typeof page.setData === 'function') {
    page.setData({ theme: next });
  }
  return next;
}

function weekdayOf(d) {
  return WD[d.getDay()];
}

function dateStr(d) {
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

function loadTrainLog() {
  try {
    const arr = wx.getStorageSync(TRAIN_KEY);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

// rec: { date:'2026年7月22日', wd:'周三', min:90 }
function saveTrainRecord(rec) {
  try {
    const arr = loadTrainLog();
    arr.push({
      date: rec.date,
      wd: rec.wd,
      min: rec.min,
      ts: Date.now()
    });
    wx.setStorageSync(TRAIN_KEY, arr);
  } catch (e) {}
}

function clearTrainLog() {
  try { wx.removeStorageSync(TRAIN_KEY); } catch (e) {}
}

module.exports = {
  getTheme, setTheme, toggleTheme,
  TRAIN_KEY, WD, WD_ORDER,
  weekdayOf, dateStr, loadTrainLog, saveTrainRecord, clearTrainLog
};

const plan = require('../../utils/plan.js');
const util = require('../../utils/util.js');

const LOG_KEY = 'jf_log_v1';

Page({
  data: {
    theme: 'light',
    log: [],
    trainGroups: [],
    trainTotal: 0,
    showAdd: false,
    addDate: '',
    addMin: ''
  },

  onShow() {
    const app = getApp();
    this.setData({ theme: app.globalData.theme });
    this.loadLog();
    this.loadTrain();
  },

  /* ===== 双周体重 / 腰围记录 ===== */
  loadLog() {
    let saved = [];
    try { saved = wx.getStorageSync(LOG_KEY) || []; } catch (e) {}
    if (!saved.length) saved = [{ d: '', w: '', c: '', n: '基线', m: '起点' }];
    while (saved.length < 6) saved.push({ d: '', w: '', c: '', n: '', m: '' });
    this.setData({ log: saved });
  },

  onLogInput(e) {
    const i = e.currentTarget.dataset.i;
    const f = e.currentTarget.dataset.f;
    const v = e.detail.value;
    const log = this.data.log.slice();
    log[i][f] = v;
    this.setData({ log: log });
    try { wx.setStorageSync(LOG_KEY, log); } catch (e) {}
  },

  saveLog() {
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  clearLog() {
    wx.showModal({
      title: '清空体重记录',
      content: '清空双周体重 / 腰围记录？此操作不可撤销。',
      success: (r) => {
        if (r.confirm) {
          try { wx.removeStorageSync(LOG_KEY); } catch (e) {}
          this.loadLog();
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  },

  /* ===== 运动训练记录（按周几归类 + 时长趋势） ===== */
  loadTrain() {
    const arr = util.loadTrainLog();
    const groups = util.WD_ORDER.map(wd => ({ wd: wd, items: [] }));
    arr.forEach((rec, i) => {
      const g = groups.find(g => g.wd === rec.wd);
      if (g) g.items.push(Object.assign({}, rec, { idx: i }));
    });
    groups.forEach(g => {
      // 升序：左旧 → 右新，便于看趋势是否变少
      g.items.sort((a, b) => a.ts - b.ts);
      const mins = g.items.map(it => it.min);
      const max = Math.max.apply(null, mins.concat([1]));
      const sum = mins.reduce((s, v) => s + v, 0);
      g.max = max;
      g.avg = Math.round(sum / g.items.length);
      g.items.forEach(it => { it.pct = Math.max(8, Math.round(it.min / max * 100)); });
    });
    this.setData({
      trainGroups: groups.filter(g => g.items.length),
      trainTotal: arr.length
    });
  },

  onAddOpen() {
    const d = new Date();
    const ds = d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
    this.setData({ showAdd: true, addDate: ds, addMin: '' });
  },
  onAddCancel() {
    this.setData({ showAdd: false, addMin: '' });
  },
  onAddDate(e) {
    this.setData({ addDate: e.detail.value });
  },
  onAddMin(e) {
    this.setData({ addMin: e.detail.value });
  },
  onAddSave() {
    const v = this.data.addDate;
    const m = parseInt(this.data.addMin, 10);
    if (!v || !m || m <= 0) {
      wx.showToast({ title: '请填日期和分钟', icon: 'none' });
      return;
    }
    const p = v.split('-');
    const d = new Date(+p[0], +p[1] - 1, +p[2]);
    const wd = util.weekdayOf(d);
    const ds = util.dateStr(d);
    util.saveTrainRecord({ date: ds, wd: wd, min: m });
    this.setData({ showAdd: false, addMin: '' });
    this.loadTrain();
    wx.showToast({ title: '已记录', icon: 'success' });
  },

  onDelTrain(e) {
    const idx = +e.currentTarget.dataset.idx;
    const self = this;
    wx.showModal({
      title: '删除记录',
      content: '确定删除这条训练记录？',
      success: (r) => {
        if (r.confirm) {
          const arr = util.loadTrainLog();
          if (idx >= 0 && idx < arr.length) arr.splice(idx, 1);
          try { wx.setStorageSync(util.TRAIN_KEY, arr); } catch (e) {}
          self.loadTrain();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  onToggleTheme() { util.toggleTheme(this); }
});

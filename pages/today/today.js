const plan = require('../../utils/plan.js');
const util = require('../../utils/util.js');

function parseSet(s) {
  var m = String(s).match(/^(\d+)\s*[×x]\s*(.+)$/);
  if (!m) return { sets: 1, reps: String(s) };
  return { sets: parseInt(m[1], 10), reps: m[2] };
}
function repsText(r) {
  if (/秒$/.test(r)) return r;
  if (/侧$/.test(r)) return r.replace('侧', ' 个/侧').replace('/', '');
  return r + ' 个';
}
function fmtTime(s) {
  var m = Math.floor(s / 60), ss = s % 60;
  return (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss;
}
// 解析计划里的休息时长（如 "90秒" / "120"），缺省 180 秒
function parseRest(r) {
  if (r == null) return 180;
  var m = String(r).match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 180;
}

// 时段圆点色（用于饮食网格卡）
const SLOT_COLOR = {
  '早': 'orange', '午': 'yellow', '晚': 'blue',
  '练前': 'red', '练后': 'green', '加餐': 'teal',
  '骑行前': 'purple', '骑行后': 'green', '补脂': 'brown'
};
function slotColor(t) {
  return SLOT_COLOR[t] || 'gray';
}

// 运动项目图标（骑行日方案用）
function actIcon(a) {
  if (/骑/.test(a)) return '🚴';
  if (/慢跑|跑步/.test(a)) return '🏃';
  if (/走|散步/.test(a)) return '🚶';
  if (/核心|平板|死虫|鸟狗/.test(a)) return '💪';
  if (/拉伸/.test(a)) return '🤸';
  if (/游泳/.test(a)) return '🏊';
  return '🏃';
}

Page({
  data: {
    theme: 'light',
    currentKey: 'mon',
    day: null,
    weekChips: [],
    extra: plan.extra,
    supp: {},
    picked: 0,
    modalOpen: false,
    exName: '', exProg: '', exWeight: '', exSet: '', exReps: '', exTip: '',
    exTimerLabel: '', exTimerVal: '', exTotalText: '', timerCls: '',
    exNext: { show: false, isNext: false, label: '', text: '' },
    exDoneText: '完成本组', showSkip: false
  },

  onLoad() {
    const app = getApp();
    const chips = plan.order.map(k => ({
      key: k, label: plan.label[k], sub: plan.days[k].sub, type: plan.days[k].type
    }));
    const jsDay = new Date().getDay();
    const todayKey = plan.order[jsDay === 0 ? 6 : jsDay - 1];
    this.setData({
      theme: app.globalData.theme,
      weekChips: chips,
      supp: plan.SUPP,
      currentKey: todayKey
    });
    this.renderDay(todayKey);
  },

  onShow() {
    const app = getApp();
    if (app.globalData.pendingDay) {
      const k = app.globalData.pendingDay;
      app.globalData.pendingDay = null;
      this.setData({ currentKey: k });
      this.renderDay(k);
    } else if (this.data.theme !== app.globalData.theme) {
      this.setData({ theme: app.globalData.theme });
    }
  },

  onUnload() {
    this.clearTimers();
    try { wx.setKeepScreenOn({ keepScreenOn: false }); } catch (e) {}
  },

  onToggleTheme() { util.toggleTheme(this); },
  noop() {},

  renderDay(key) {
    const d = plan.days[key];
    const diet = (d.diet || []).map(m => Object.assign({}, m, { clr: slotColor(m.m) }));
    const suppList = Object.keys(plan.SUPP).sort((a, b) => { const pa = a.split(':'), pb = b.split(':'); return (pa[0] - pb[0]) || (pa[1] - pb[1]); }).map(t => ({ t: t, text: plan.SUPP[t] }));
    // 骑行日方案：给每个活动补图标
    let plans = [];
    if (d.ex && d.ex.plans) {
      plans = d.ex.plans.map(p => Object.assign({}, p, {
        items: p.items.map(it => Object.assign({}, it, { ic: actIcon(it.act) }))
      }));
    }
    const picked = this.loadPick(key);
    this.setData({
      currentKey: key,
      day: Object.assign({}, d, { diet: diet, ex: Object.assign({}, d.ex, { plans: plans }) }),
      suppList: suppList,
      picked: picked
    });
  },
  onWeekTap(e) {
    this.renderDay(e.currentTarget.dataset.key);
  },

  // 骑行日方案选择（按日期记忆）
  loadPick(key) {
    try {
      const v = wx.getStorageSync('jf_actpick_' + key);
      return (typeof v === 'number') ? v : 0;
    } catch (e) { return 0; }
  },
  onPickPlan(e) {
    const i = e.currentTarget.dataset.i;
    const key = this.data.currentKey;
    try { wx.setStorageSync('jf_actpick_' + key, i); } catch (e) {}
    this.setData({ picked: i });
  },

  /* ===== 训练器 ===== */
  onOpenEx() { this.openEx(this.data.currentKey); },

  openEx(key) {
    const d = plan.days[key];
    const self = this;
    this.clearTimers();
    // 训练时保持亮屏，关弹窗再恢复
    try { wx.setKeepScreenOn({ keepScreenOn: true }); } catch (e) {}
    const now = Date.now();
    this.exState = { key: key, startTs: now };
    if (!d.ex.rows) {
      const plans = (d.ex && d.ex.plans) || [];
      const pi = this.loadPick(key);
      const pl = plans[pi] || plans[0];
      let tip = (d.ex && d.ex.note) || (d.type === 'rs' ? '休息日，轻拉伸 / 散步' : '骑行有氧，见下方方案');
      if (pl) {
        tip = pl.name + '：' + pl.items.map(it => it.act + ' ' + it.dur).join('；');
      }
      this.setData({
        modalOpen: true,
        exName: d.name + ' · 今日运动',
        exProg: '本日有氧方案',
        exWeight: '', exSet: '', exReps: '',
        exTip: tip,
        exTotalText: '', exTimerLabel: '', exTimerVal: '', timerCls: '',
        exNext: { show: false, isNext: false, label: '', text: '' },
        exDoneText: '关闭', showSkip: false
      });
      return;
    }
    this.exState.rows = d.ex.rows;
    this.exState.ei = 0; this.exState.si = 0;
    this.exState.phase = 'work';
    this.exState.setWorkStartTs = now;
    this.setData({ modalOpen: true, exTotalText: fmtTime(0), exDoneText: '完成本组' });
    this.startTick();
    this.renderStep();
  },

  // 单个计时器驱动全部（本组 / 休息 / 总时长），用时间戳回算，息屏不掉秒、不会叠加
  startTick() {
    const self = this;
    this.clearTimers();
    this._timer = setInterval(function () {
      const st = self.exState;
      if (!st) return;
      const now = Date.now();
      const total = Math.floor((now - st.startTs) / 1000);
      if (st.phase === 'work') {
        const we = Math.floor((now - st.setWorkStartTs) / 1000);
        self.setData({
          exTotalText: fmtTime(total),
          exTimerLabel: '本组计时', exTimerVal: fmtTime(we)
        });
      } else if (st.phase === 'rest') {
        const left = Math.max(0, Math.round((st.restEndTs - now) / 1000));
        self.setData({
          exTotalText: fmtTime(total),
          exTimerLabel: '休息中', exTimerVal: fmtTime(left)
        });
        if (left <= 0) {
          self.setData({ showSkip: false });
          self.advance();
        }
      }
    }, 1000);
  },

  renderStep() {
    const st = this.exState;
    const r = st.rows[st.ei];
    const total = st.rows.length;
    st.phase = 'work';
    st.setWorkStartTs = Date.now();
    st.rest = parseRest(r.rest);
    this.setData({
      exName: r.name,
      exProg: '动作 ' + (st.ei + 1) + ' / ' + total,
      exWeight: r.weight,
      exSet: '第 ' + (st.si + 1) + ' 组',
      exReps: repsText(parseSet(r.sets).reps),
      exTip: r.tip || '',
      timerCls: 'work',
      exTimerLabel: '本组计时', exTimerVal: fmtTime(0),
      exDoneText: '完成本组',
      showSkip: false
    });
    if (!this._timer) this.startTick();
  },

  renderNext() {
    const n = this.nextExInfo();
    if (!n) {
      this.setData({ exNext: { show: false, isNext: false, label: '', text: '' } });
      return;
    }
    this.setData({
      exNext: {
        show: true,
        isNext: !n.same,
        label: n.same ? '下一组' : '下一动作',
        text: n.same ? (n.name + ' · 第 ' + n.set + ' 组') : n.name
      }
    });
  },

  nextExInfo() {
    if (!this.exState || !this.exState.rows) return null;
    const rows = this.exState.rows, total = rows.length;
    const p = parseSet(rows[this.exState.ei].sets);
    if (this.exState.si + 1 < p.sets) return { name: rows[this.exState.ei].name, set: this.exState.si + 2, same: true };
    if (this.exState.ei + 1 < total) return { name: rows[this.exState.ei + 1].name, set: 1, same: false };
    return null;
  },

  onDoneTap() {
    if (this.data.exDoneText === '关闭') { this.closeEx(); return; }
    // 休息中，主按钮即「跳过休息」
    if (this.data.exDoneText === '跳过休息') { this.onSkip(); return; }
    // 每组完成震动反馈
    try { wx.vibrateShort({ type: 'medium' }); } catch (e) {}
    this.startRest();
  },

  startRest() {
    const st = this.exState;
    st.phase = 'rest';
    st.restEndTs = Date.now() + st.rest * 1000;
    this.setData({
      timerCls: 'run',
      exTimerLabel: '休息中', exTimerVal: fmtTime(st.rest),
      showSkip: true, exDoneText: '跳过休息'
    });
    if (!this._timer) this.startTick();
  },

  onSkip() {
    this.setData({ showSkip: false });
    this.advance();
  },

  advance() {
    const rows = this.exState.rows, total = rows.length;
    const p = parseSet(rows[this.exState.ei].sets);
    if (this.exState.si + 1 < p.sets) {
      this.exState.si++;
    } else if (this.exState.ei + 1 < total) {
      this.exState.ei++; this.exState.si = 0;
    } else {
      this.finish(); return;
    }
    this.renderStep();
  },

  finish() {
    this.clearTimers();
    try { wx.vibrateShort({ type: 'heavy' }); } catch (e) {}
    const durMs = Date.now() - this.exState.startTs;
    const min = Math.floor(durMs / 60000);
    const totalSec = Math.floor(durMs / 1000);
    this.setData({
      exName: '全部完成 🎉',
      exProg: '今日力量训练已结束 · 总时长 ' + fmtTime(totalSec),
      exWeight: '', exSet: '干得漂亮', exReps: '',
      exTip: '记得 21:00 练后餐：乳清蛋白粉 60 克、麦片 2 勺、黄瓜 1 根。',
      exNext: { show: false, isNext: false, label: '', text: '' },
      timerCls: '', exTimerLabel: '', exTimerVal: '',
      exDoneText: '关闭', showSkip: false
    });
    // 训练完成 ≥30 分钟，询问是否记录
    if (durMs >= 1800000) {
      const d = new Date();
      const wd = util.weekdayOf(d);
      const ds = util.dateStr(d);
      const self = this;
      wx.showModal({
        title: '记录本次训练',
        content: ds + wd + '，运动时间 ' + min + ' 分钟',
        confirmText: '记录',
        cancelText: '不记录',
        success: function (r) {
          if (r.confirm) {
            util.saveTrainRecord({ date: ds, wd: wd, min: min });
            wx.showToast({ title: '已记录', icon: 'success' });
          }
        }
      });
    }
  },

  closeEx() {
    this.clearTimers();
    try { wx.setKeepScreenOn({ keepScreenOn: false }); } catch (e) {}
    this.setData({ modalOpen: false });
  },
  onMaskTap() { this.closeEx(); },
  onCloseEx() { this.closeEx(); },

  clearTimers() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  }
});

const plan = require('../../utils/plan.js');
const util = require('../../utils/util.js');

Page({
  data: {
    theme: 'light',
    days: []
  },

  onShow() {
    const app = getApp();
    const list = plan.order.map(k => {
      const d = plan.days[k];
      const exText = d.ex.rows
        ? ('运动：' + d.ex.rows.length + ' 个动作')
        : (d.type === 'rs' ? '运动：休息' : '运动：骑行有氧');
      return {
        key: k, name: d.name, kcal: d.kcal, type: d.type,
        sub: d.sub, exText: exText
      };
    });
    this.setData({ theme: app.globalData.theme, days: list });
  },

  onTapDay(e) {
    const app = getApp();
    app.globalData.pendingDay = e.currentTarget.dataset.key;
    wx.switchTab({ url: '/pages/today/today' });
  },

  onToggleTheme() { util.toggleTheme(this); }
});

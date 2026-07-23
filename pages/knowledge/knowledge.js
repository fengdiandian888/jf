const util = require('../../utils/util.js');

Page({
  data: {
    theme: 'light',
    seg: 'method',
    segs: [
      { key: 'method', label: '方法论' },
      { key: 'nutri', label: '营养' },
      { key: 'train', label: '训练' }
    ],
    scrollTo: 'cat-method'
  },
  onShow() {
    const app = getApp();
    if (this.data.theme !== app.globalData.theme) {
      this.setData({ theme: app.globalData.theme });
    }
  },
  onSeg(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ seg: key, scrollTo: 'cat-' + key });
  },
  onToggleTheme() { util.toggleTheme(this); }
});

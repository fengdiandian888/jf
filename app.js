const util = require('./utils/util.js');

App({
  globalData: {
    theme: 'light',
    pendingDay: null
  },
  onLaunch() {
    this.globalData.theme = util.getTheme();
  }
});

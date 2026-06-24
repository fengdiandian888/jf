/**
 * 减脂App · GitHub Gist 云端存储模块
 * 
 * 架构：所有减脂页面共享同一个 Gist 文件（fitness-data.json）
 * Token 存储在 localStorage，每台设备只需输入一次
 * 
 * API：GistDB.init() → GistDB.readAll() → ... → GistDB.saveDay()
 */
(function(global) {
  'use strict';

  const TOKEN_KEY = 'fit_gist_token';
  const GIST_ID_KEY = 'fit_gist_id';
  const FILENAME = 'fitness-data.json';
  const API_BASE = 'https://api.github.com';
  const DESCRIPTIONS = {
    en: '💪 Weight loss & fitness log',
    zh: '减脂健身记录'
  };

  // ========== Token 管理 ==========
  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
  function setToken(t) {
    localStorage.setItem(TOKEN_KEY, t);
  }
  function getGistId() {
    return localStorage.getItem(GIST_ID_KEY);
  }
  function setGistId(id) {
    localStorage.setItem(GIST_ID_KEY, id);
  }

  // ========== 通用 fetch wrapper ==========
  async function ghFetch(url, opts) {
    opts = opts || {};
    opts.headers = opts.headers || {};
    opts.headers['Authorization'] = 'token ' + getToken();
    if (!opts.headers['Content-Type'] && opts.body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(opts.body);
    }
    const res = await fetch(url, opts);
    if (!res.ok) {
      const txt = await res.text();
      let msg = 'GitHub API ' + res.status;
      try { const j = JSON.parse(txt); msg += ': ' + j.message; } catch(e) {}
      throw new Error(msg);
    }
    return res.json();
  }

  // ========== 寻找或创建 Gist ==========
  async function findOrCreateGist() {
    let gid = getGistId();
    // 如果已知 Gist ID，验证一下
    if (gid) {
      try {
        const g = await ghFetch(API_BASE + '/gists/' + gid);
        return gid; // 仍然存在，继续用
      } catch(e) {
        // 被删了或不可用，重新创建
        console.warn('Gist lost, creating new one...');
      }
    }
    // 搜索已有的 Gist（方便多设备共享）
    try {
      const list = await ghFetch(API_BASE + '/gists?per_page=50');
      const found = list.find(g => g.files && g.files[FILENAME]);
      if (found) {
        setGistId(found.id);
        return found.id;
      }
    } catch(e) {
      console.warn('Cannot list gists:', e.message);
    }
    // 创建新 Gist
    const data = {
      description: DESCRIPTIONS.zh,
      public: false,  // 私有 Gist
      files: {}
    };
    data.files[FILENAME] = { content: JSON.stringify({ v: 1, updated: new Date().toISOString(), logs: {} }) };
    const created = await ghFetch(API_BASE + '/gists', { method: 'POST', body: data });
    setGistId(created.id);
    return created.id;
  }

  // ========== 显示 Token 设置界面 ==========
  function showTokenModal(callback) {
    // 移除已有 modal
    const old = document.getElementById('gist-token-modal');
    if (old) old.remove();

    const el = document.createElement('div');
    el.id = 'gist-token-modal';
    el.innerHTML = `
      <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.85);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px">
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:16px;padding:24px;max-width:380px;width:100%;color:#e0e0e0;font-family:system-ui,sans-serif;font-size:14px">
          <div style="font-size:28px;text-align:center;margin-bottom:8px">🔑</div>
          <div style="font-size:16px;font-weight:700;text-align:center;margin-bottom:6px">连接云端存储</div>
          <div style="font-size:12px;color:#888;text-align:center;margin-bottom:16px;line-height:1.6">
            输入 GitHub Token 以启用跨设备数据同步<br>
            <a href="https://github.com/settings/tokens" target="_blank" style="color:#60a5fa;text-decoration:underline">→ 获取 Token（勾选 gist 权限）</a>
          </div>
          <input id="gist-token-input" type="password" placeholder="ghp_xxxxxxxxxxxx..." 
            style="width:100%;padding:10px 12px;font-size:14px;font-family:monospace;background:#0f0f0f;border:2px solid #333;border-radius:8px;color:#e0e0e0;outline:none;margin-bottom:12px"
            autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
          <div id="gist-token-err" style="font-size:11px;color:#f87171;margin-bottom:12px;display:none"></div>
          <button id="gist-token-btn" style="width:100%;padding:10px;font-size:14px;font-weight:700;background:#e07040;color:#fff;border:none;border-radius:8px;cursor:pointer">
            连接云端
          </button>
          <button id="gist-token-skip" style="width:100%;padding:8px;font-size:12px;color:#666;background:transparent;border:none;cursor:pointer;margin-top:8px">
            跳过（仅本地存储）
          </button>
        </div>
      </div>`;
    document.body.appendChild(el);

    const input = document.getElementById('gist-token-input');
    const btn = document.getElementById('gist-token-btn');
    const errEl = document.getElementById('gist-token-err');
    const skip = document.getElementById('gist-token-skip');

    btn.onclick = async function() {
      const token = input.value.trim();
      if (!token) { showErr('请输入 Token'); return; }
      btn.disabled = true;
      btn.textContent = '验证中...';
      try {
        const resp = await fetch(API_BASE + '/user', {
          headers: { 'Authorization': 'token ' + token }
        });
        if (!resp.ok) throw new Error('Token 无效');
        setToken(token);
        el.remove();
        callback(true);
      } catch(e) {
        showErr('Token 无效或网络不通，请检查');
        btn.disabled = false;
        btn.textContent = '连接云端';
      }
    };
    skip.onclick = function() {
      el.remove();
      callback(false);
    };
    function showErr(msg) {
      errEl.textContent = msg;
      errEl.style.display = 'block';
    }
    input.focus();
  }

  // ========== 公开 API ==========
  const GistDB = {
    _data: null,
    _ready: false,
    _online: false,

    /**
     * 初始化：确保 Token 有效，找到或创建 Gist，加载数据
     * 返回 true 表示已连接云端，false 表示仅本地模式
     */
    async init() {
      if (this._ready) return this._online;

      const token = getToken();
      if (!token) {
        return new Promise(resolve => {
          showTokenModal(async (connected) => {
            if (connected) {
              try {
                await findOrCreateGist();
                this._online = true;
                this._ready = true;
                resolve(true);
              } catch(e) {
                console.error('Gist init failed:', e);
                this._ready = true;
                resolve(false);
              }
            } else {
              this._ready = true;
              resolve(false);
            }
          });
        });
      }

      try {
        await findOrCreateGist();
        this._online = true;
      } catch(e) {
        console.error('Gist init failed:', e);
      }
      this._ready = true;
      return this._online;
    },

    /** 是否已连接云端 */
    isOnline() {
      return this._online;
    },

    /** 重新设置 Token（例如换了设备） */
    resetToken() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(GIST_ID_KEY);
      this._ready = false;
      this._online = false;
      this._data = null;
    },

    /** 读取全部数据 */
    async readAll() {
      if (!this._online) return { logs: {} };
      try {
        const gid = getGistId();
        const gist = await ghFetch(API_BASE + '/gists/' + gid);
        const content = gist.files[FILENAME].content;
        if (gist.files[FILENAME].truncated) {
          // 内容太大被截断，需要从 raw URL 获取
          const rawResp = await fetch(gist.files[FILENAME].raw_url);
          const raw = await rawResp.text();
          this._data = JSON.parse(raw);
        } else {
          this._data = JSON.parse(content);
        }
        return this._data;
      } catch(e) {
        console.error('readAll failed:', e);
        return { logs: {} };
      }
    },

    /** 保存某一天的记录 */
    async saveDay(date, record) {
      // 确保内存中有最新数据
      if (!this._data || !Object.keys(this._data.logs || {}).length) {
        try { await this.readAll(); } catch(e) {}
      }
      if (!this._data) this._data = { v: 1, logs: {} };
      if (!this._data.logs) this._data.logs = {};

      record.updated = new Date().toISOString();
      this._data.logs[date] = Object.assign(this._data.logs[date] || {}, record);
      this._data.updated = new Date().toISOString();

      if (!this._online) {
        // 离线模式：存本地
        localStorage.setItem('fit_local_log', JSON.stringify(this._data));
        return false;
      }

      try {
        const gid = getGistId();
        const body = {
          description: DESCRIPTIONS.zh,
          files: {}
        };
        body.files[FILENAME] = { content: JSON.stringify(this._data, null, 2) };
        await ghFetch(API_BASE + '/gists/' + gid, { method: 'PATCH', body: body });
        return true;
      } catch(e) {
        console.error('saveDay failed:', e);
        // 失败时存本地兜底
        localStorage.setItem('fit_local_log', JSON.stringify(this._data));
        throw e;
      }
    },

    /** 获取某一天的记录 */
    async getDay(date) {
      await this.readAll();
      return (this._data && this._data.logs) ? (this._data.logs[date] || null) : null;
    },

    /** 导出全部数据为 JSON 字符串（用于备份） */
    async exportString() {
      await this.readAll();
      return JSON.stringify(this._data || { logs: {} }, null, 2);
    },

    /** 连接状态信息 */
    getStatus() {
      return {
        online: this._online,
        ready: this._ready,
        hasToken: !!getToken(),
        gistId: getGistId()
      };
    }
  };

  global.GistDB = GistDB;
})(window);

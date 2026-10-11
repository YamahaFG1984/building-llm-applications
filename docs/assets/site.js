/* ================================================================
   AI Agents 与 LLM 应用教程 · 共享脚本
   侧边栏、章节目录、三语言标签页、代码高亮、主题切换
   ================================================================ */
(function () {
  'use strict';

  var CHAPTERS = [
    { n: 1,  t: 'AI 智能体与应用导论',        d: '引擎、聊天机器人、智能体，以及 LangChain 的对象模型', part: '第一部分 · 认识 LLM' },
    { n: 2,  t: '用代码执行提示词',           d: '调用 API、提示词模板、少样本学习与提示词结构' },
    { n: 3,  t: '用 LangChain 做文本摘要',    d: 'Map-Reduce 与 Refine：处理超出上下文窗口的文档', part: '第二部分 · 摘要' },
    { n: 4,  t: '构建研究摘要引擎',           d: '搜索 → 抓取 → 摘要 → 报告，再用 LCEL 重写' },
    { n: 5,  t: '用 LangGraph 构建智能体工作流', d: '状态、节点、边与条件分支，让流程能「回头重来」' },
    { n: 6,  t: 'RAG 基础与 ChromaDB',        d: '语义搜索、向量库，从零实现检索增强生成', part: '第三部分 · 问答机器人' },
    { n: 7,  t: '问答机器人与 LangSmith',     d: '加载器、切分器、检索器、对话记忆与链路追踪' },
    { n: 8,  t: '高级索引',                   d: '切分策略、父子块、摘要与假设问题嵌入', part: '第四部分 · 高级 RAG' },
    { n: 9,  t: '问题改写',                   d: '查询重写、多查询、后退一步、HyDE 与问题分解' },
    { n: 10, t: '查询生成、路由与检索后处理', d: '自查询、Text-to-SQL、路由链与 RAG Fusion' },
    { n: 11, t: '基于工具的智能体',           d: '工具调用、ReAct 循环与 LangGraph 预置组件', part: '第五部分 · AI 智能体' },
    { n: 12, t: '多智能体系统',               d: '路由器模式与 Supervisor 模式' },
    { n: 13, t: '构建与使用 MCP 服务器',      d: '模型上下文协议：把工具变成可插拔的服务' },
    { n: 14, t: '走向生产：记忆与护栏',       d: '检查点、会话线程、输入护栏及后续路线' },
    { n: 15, t: '附录',                       d: '环境搭建、如何选模型、在本地运行开源 LLM', part: '附录', f: 'appendix.html', label: '附' }
  ];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fileOf(c) { return c.f || ('ch' + pad(c.n) + '.html'); }
  function nameOf(c) { return c.label ? c.t : '第 ' + c.n + ' 章 · ' + c.t; }

  var cur = parseInt(document.body.dataset.chapter || '0', 10);

  /* ---------- 侧边栏 ---------- */
  var side = document.getElementById('sidebar');
  if (side) {
    var html = '<a class="brand" href="index.html"><span class="logo">&#129436;</span>' +
      '<span>AI 智能体与应用<small>LangChain · LangGraph · MCP</small></span></a>';
    CHAPTERS.forEach(function (c) {
      if (c.part) html += '<div class="part">' + c.part + '</div>';
      html += '<a class="ch' + (c.n === cur ? ' active' : '') + '" href="' + fileOf(c) +
        '"><span class="n">' + (c.label || c.n) + '</span><span>' + c.t + '</span></a>';
    });
    side.innerHTML = html;
    var active = side.querySelector('a.ch.active');
    if (active) setTimeout(function () { active.scrollIntoView({ block: 'center' }); }, 0);
  }

  /* ---------- 移动端菜单 ---------- */
  var btn = document.createElement('button');
  btn.id = 'menu-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', '目录');
  btn.innerHTML = '&#9776;';
  btn.onclick = function () { document.body.classList.toggle('nav-open'); };
  document.body.appendChild(btn);
  document.addEventListener('click', function (e) {
    if (document.body.classList.contains('nav-open') &&
        side && !side.contains(e.target) && e.target !== btn) {
      document.body.classList.remove('nav-open');
    }
  });

  /* ---------- 主题切换 ---------- */
  var tbtn = document.createElement('button');
  tbtn.id = 'theme-btn';
  tbtn.type = 'button';
  tbtn.setAttribute('aria-label', '切换深浅色');
  tbtn.innerHTML = '&#9789;';
  tbtn.onclick = function () {
    var root = document.documentElement;
    var now = root.getAttribute('data-theme');
    var dark = now ? now === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', dark ? 'light' : 'dark');
    try { localStorage.setItem('llm-doc-theme', dark ? 'light' : 'dark'); } catch (e) {}
  };
  document.body.appendChild(tbtn);
  try {
    var saved = localStorage.getItem('llm-doc-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {}

  /* ---------- 箭头 marker（全局一次） ---------- */
  // SVG marker 的内容不会从引用它的元素继承 color，所以直接用 CSS 变量填色。
  var defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
  defs.setAttribute('style', 'position:absolute');
  var mk = '<defs>';
  [['ar', '--fg-faint'], ['ar-a', '--accent'], ['ar-b', '--blue'], ['ar-g', '--green'],
   ['ar-r', '--red'], ['ar-p', '--purple']].forEach(function (m) {
    mk += '<marker id="' + m[0] + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0,0 L10,5 L0,10 z" fill="var(' + m[1] + ')"/></marker>';
  });
  defs.innerHTML = mk + '</defs>';
  document.body.appendChild(defs);

  /* ---------- 章节内目录 ---------- */
  var main = document.querySelector('main');
  var slot = document.getElementById('chapter-toc');
  if (slot && main) {
    var hs = main.querySelectorAll('h2');
    if (hs.length > 2) {
      var t = '<div class="h">本章目录</div><ol>';
      hs.forEach(function (h, i) {
        if (!h.id) h.id = 'sec-' + (i + 1);
        t += '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>';
      });
      slot.className = 'toc';
      slot.innerHTML = t + '</ol>';
    }
  }

  /* ---------- 代码高亮 ---------- */
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function words(s) { return '\\b(' + s.split(' ').join('|') + ')\\b'; }

  var KW_JS = 'const let var function return if else await async import from export default new class ' +
    'extends implements for while of in do try catch finally throw switch case break continue type ' +
    'interface enum as satisfies typeof instanceof delete void yield public private readonly null ' +
    'undefined true false this super static declare namespace';
  var KW_PY = 'def class return if elif else for while in not and or is import from as with try except ' +
    'finally raise pass break continue lambda yield async await global nonlocal assert del None True False self';
  var KW_JAVA = 'package import public private protected static final class interface enum record extends ' +
    'implements new return if else for while do switch case default break continue try catch finally ' +
    'throw throws void int long double float boolean char byte short var null true false this super ' +
    'instanceof synchronized abstract';
  var KW_SQL = 'SELECT FROM WHERE JOIN INNER LEFT RIGHT ON AND OR NOT AS ORDER BY GROUP LIMIT INSERT INTO ' +
    'VALUES CREATE TABLE PRIMARY KEY FOREIGN REFERENCES INTEGER TEXT REAL DEFAULT NULL LIKE IN UPDATE SET ' +
    'DELETE DISTINCT COUNT AUTOINCREMENT DESC ASC';

  var STR_DQ = '"(?:\\\\[\\s\\S]|[^\\\\"\\n])*"';
  var STR_SQ = "'(?:\\\\[\\s\\S]|[^\\\\'\\n])*'";
  var TAIL = '|\\b([A-Z][A-Za-z0-9_]*)\\b|\\b(\\d+(?:\\.\\d+)?)\\b|\\b([a-zA-Z_$][\\w$]*)(?=\\()';

  var LANGS = {
    js: {
      re: new RegExp('(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)|(`(?:\\\\[\\s\\S]|[^\\\\`])*`|' + STR_SQ + '|' + STR_DQ + ')|' +
        words(KW_JS) + TAIL, 'g'),
      cls: ['tk-cm', 'tk-st', 'tk-kw', 'tk-tp', 'tk-nm', 'tk-fn']
    },
    python: {
      re: new RegExp('(#[^\\n]*)|((?:\\b[fFrRbB]{1,2})?(?:"""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|' + STR_DQ + '|' + STR_SQ + '))|' +
        '(@[\\w.]+)|' + words(KW_PY) + TAIL, 'g'),
      cls: ['tk-cm', 'tk-st', 'tk-dc', 'tk-kw', 'tk-tp', 'tk-nm', 'tk-fn']
    },
    java: {
      re: new RegExp('(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)|("""[\\s\\S]*?"""|' + STR_DQ + '|' + STR_SQ + ')|' +
        '(@\\w+)|' + words(KW_JAVA) + TAIL, 'g'),
      cls: ['tk-cm', 'tk-st', 'tk-dc', 'tk-kw', 'tk-tp', 'tk-nm', 'tk-fn']
    },
    sh: {
      re: /(#[^\n]*)|('(?:\\[\s\S]|[^\\'])*'|"(?:\\[\s\S]|[^\\"])*")|\b(npm|npx|pnpm|pip|python|uv|node|git|cd|mkdir|curl|export|set|docker|java|mvn|gradle|ollama|sqlite3|jupyter|source|tsx)\b/g,
      cls: ['tk-cm', 'tk-st', 'tk-kw']
    },
    sql: {
      re: new RegExp('(--[^\\n]*)|(' + STR_SQ + ')|' + words(KW_SQL) + '|\\b(\\d+(?:\\.\\d+)?)\\b', 'gi'),
      cls: ['tk-cm', 'tk-st', 'tk-kw', 'tk-nm']
    },
    json: {
      re: new RegExp('(\\/\\/[^\\n]*)|(' + STR_DQ + ')|\\b(true|false|null)\\b|\\b(-?\\d+(?:\\.\\d+)?)\\b', 'g'),
      cls: ['tk-cm', 'tk-st', 'tk-kw', 'tk-nm']
    }
  };
  var ALIAS = { ts: 'js', tsx: 'js', javascript: 'js', typescript: 'js', py: 'python',
    bash: 'sh', shell: 'sh', env: 'sh', toml: 'sh', yaml: 'sh', xml: null, text: null, prompt: null };
  var LABEL = { python: 'Python', ts: 'TypeScript', java: 'Java', bash: 'Shell', sh: 'Shell',
    sql: 'SQL', json: 'JSON', text: '输出', prompt: '提示词', xml: 'XML', env: '.env' };

  function paint(src, lang) {
    var key = ALIAS.hasOwnProperty(lang) ? ALIAS[lang] : lang;
    var def = key && LANGS[key];
    if (!def) return esc(src);
    var re = def.re, out = '', last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(src)) !== null) {
      out += esc(src.slice(last, m.index));
      for (var g = 1; g < m.length; g++) {
        if (m[g] !== undefined) { out += '<span class="' + def.cls[g - 1] + '">' + esc(m[g]) + '</span>'; break; }
      }
      last = m.index + m[0].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    return out + esc(src.slice(last));
  }

  document.querySelectorAll('.code').forEach(function (box) {
    var pre = box.querySelector('pre');
    if (!pre) return;
    var lang = box.dataset.lang || '';
    var file = box.dataset.file || '';
    var bar = document.createElement('div');
    bar.className = 'bar';
    bar.innerHTML = '<span class="tag">' + esc(file || LABEL[lang] || lang || 'code') + '</span>';
    var cp = document.createElement('button');
    cp.className = 'copy'; cp.type = 'button'; cp.textContent = '复制';
    cp.onclick = function () {
      if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent);
      cp.textContent = '已复制'; setTimeout(function () { cp.textContent = '复制'; }, 1400);
    };
    bar.appendChild(cp);
    box.insertBefore(bar, pre);
    var code = pre.textContent.replace(/^\n/, '').replace(/\s+$/, '');
    pre.innerHTML = paint(code, lang);
  });

  /* ---------- 三语言标签页：选一次，全站同步 ---------- */
  var ORDER = ['python', 'ts', 'java'];
  var pref = 'python';
  try { pref = localStorage.getItem('llm-doc-lang') || 'python'; } catch (e) {}
  var groups = Array.prototype.slice.call(document.querySelectorAll('.tabs'));

  function show(lang) {
    groups.forEach(function (g) {
      var panes = g.querySelectorAll(':scope > .code');
      var has = false;
      panes.forEach(function (p) { if (p.dataset.lang === lang) has = true; });
      var use = has ? lang : panes[0].dataset.lang;
      panes.forEach(function (p) { p.classList.toggle('on', p.dataset.lang === use); });
      g.querySelectorAll(':scope > .tabbar button').forEach(function (b) {
        b.classList.toggle('on', b.dataset.l === use);
      });
    });
  }

  groups.forEach(function (g) {
    var bar = document.createElement('div');
    bar.className = 'tabbar';
    var panes = Array.prototype.slice.call(g.querySelectorAll(':scope > .code'));
    panes.sort(function (a, b) { return ORDER.indexOf(a.dataset.lang) - ORDER.indexOf(b.dataset.lang); });
    panes.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.l = p.dataset.lang;
      b.innerHTML = '<span class="dot"></span>' + (LABEL[p.dataset.lang] || p.dataset.lang);
      b.onclick = function () {
        var y = g.getBoundingClientRect().top;          // 切换后保持当前代码块在视口中的位置
        pref = p.dataset.lang;
        try { localStorage.setItem('llm-doc-lang', pref); } catch (e) {}
        show(pref);
        window.scrollBy(0, g.getBoundingClientRect().top - y);
      };
      bar.appendChild(b);
    });
    g.insertBefore(bar, g.firstChild);
  });
  if (groups.length) show(pref);

  /* ---------- 上一章 / 下一章 ---------- */
  var pager = document.getElementById('pager');
  if (pager && cur) {
    var prev = CHAPTERS.find(function (c) { return c.n === cur - 1; });
    var next = CHAPTERS.find(function (c) { return c.n === cur + 1; });
    var h = '';
    h += prev ? '<a class="prev" href="' + fileOf(prev) + '"><span>&larr; 上一章</span>' + nameOf(prev) + '</a>'
              : '<a class="prev" href="index.html"><span>&larr; 返回</span>课程首页</a>';
    h += next ? '<a class="next" href="' + fileOf(next) + '"><span>下一章 &rarr;</span>' + nameOf(next) + '</a>'
              : '<a class="next" href="index.html"><span>完结 &rarr;</span>回到课程首页</a>';
    pager.className = 'pager';
    pager.innerHTML = h;
  }

  /* ---------- 首页目录 ---------- */
  var grid = document.getElementById('toc-grid');
  if (grid) {
    var g = '';
    CHAPTERS.forEach(function (c) {
      if (c.part) g += '<div class="toc-part">' + c.part + '</div>';
      g += '<a class="toc-card" href="' + fileOf(c) + '">' +
        '<div class="n">' + (c.label ? '附录 A–E' : '第 ' + c.n + ' 章') + '</div>' +
        '<div class="t">' + c.t + '</div>' +
        '<div class="d">' + c.d + '</div></a>';
    });
    grid.className = 'toc-grid';
    grid.innerHTML = g;
  }
})();

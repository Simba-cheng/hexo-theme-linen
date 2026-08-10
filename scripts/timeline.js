"use strict";

const fs = require("fs");
const path = require("path");

/**
 * hexo-theme-linen 旅行时间轴组件
 *
 * 用法（写法 A，一行一条，用 | 分隔）：
 *   {% timeline 2 %} ... {% endtimeline %}        多列按天排程（2 / 3 / 4 列）
 *   {% timeline vertical %} ... {% endtimeline }  单列纵向时间轴（不写参数同效果）
 *
 * 内容语法：
 *   # 名称 | 日期      新的一天（日期可省，第 3 段起忽略）
 *   - 时间 | 正文 | 备注 | 类别  当天项目（备注、类别可省；
 *                                 类别：trans 交通 / eat 用餐 / hotel 住宿 / sight 游玩 / other 其他）
 *   > 备注                    当天级备注（可省）
 *
 * 时间字段：写精确时刻（08:00）渲染为等宽数字；写时段（上午/下午/晚上）自动渲染为胶囊标签，
 *           适合只知先后、没有确切时间的日程。连续相同的时段自动合并为一个胶囊（后续行留空对齐）。
 *
 * 注意事项：
 *   - 正文里想用竖线，写成 \| 转义（或全角 ｜）
 *   - 不要写 {% 或 {{（会被当作 Hexo 模板语法）
 *   - 样式由本文件底部的 after_render:html 过滤器按需注入，
 *     页面里出现 class="tl" 时才会加载 timeline.css
 */

const DAY_RE = /^#\s+(.*)$/;
const ITEM_RE = /^-\s+(.*)$/;
const NOTE_RE = /^>\s*(.*)$/;
const CATS = ["trans", "eat", "hotel", "sight", "other"];

/* 转义用户文本，防止注入 / 破版 */
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/*
 * 按 | 切分字段：先保护 \| 转义，再按 | 切，最后还原并去空白。
 */
function splitFields(s) {
  const guard = "\u0000";
  const protectedStr = s.replace(/\s*\\\|\s*/g, guard);
  return protectedStr.split("|").map(f => f.replace(new RegExp(guard, "g"), "|").trim());
}

/*
 * 把 tag 内容（原始字符串）解析成：
 *   [{ name, date, note, items: [{ time, text, note, cat }] }]
 */
function parse(content) {
  const days = [];
  let cur = null;
  content.split("\n").forEach(rawLine => {
    const line = rawLine.trim();
    if (!line) return;

    let m = line.match(DAY_RE);
    if (m) {
      const [name, date] = splitFields(m[1]);
      cur = { name, date, note: "", items: [] };
      days.push(cur);
      return;
    }

    m = line.match(ITEM_RE);
    if (m) {
      if (!cur) return;
      const [time, text, note, cat] = splitFields(m[1]);
      cur.items.push({ time, text, note, cat });
      return;
    }

    m = line.match(NOTE_RE);
    if (m) {
      if (cur) cur.note = m[1];
    }
  });
  return days;
}

function catClass(cat) {
  return CATS.includes(cat) ? `tl-ev--${cat}` : "tl-ev--other";
}

/* 取名称里第一个数字做圆点序号（如「DAY 2」→ 2、「D3」→ 3），没有数字则按第 N 天 */
function dotNumber(name, index) {
  const m = String(name).match(/(\d+)/);
  return m ? m[1] : String(index + 1);
}

/* ---------- 多列按天排程 ---------- */
function renderColumns(days, cols) {
  const colCls = cols >= 2 && cols <= 4 ? ` tl--${cols}` : "";
  const extraStyle =
    cols > 4 ? ` style="display:grid;grid-template-columns:repeat(${cols}, minmax(0,1fr));gap:26px"` : "";

  const body = days
    .map(d => {
      const items = d.items
        .map(it => {
          const sub = it.note ? `<div class="tl-ev-sub">${esc(it.note)}</div>` : "";
          return `<div class="tl-ev ${catClass(it.cat)}"><time>${esc(it.time)}</time><div class="tl-ev-main"><div class="tl-ev-title">${esc(it.text)}</div>${sub}</div></div>`;
        })
        .join("");
      const note = d.note ? `<div class="tl-note">${esc(d.note)}</div>` : "";
      const head = [
        `<div class="tl-day-head">`,
        `<span class="tl-day-num">${esc(d.name)}</span>`,
        d.date ? `<span class="tl-day-date">${esc(d.date)}</span>` : "",
        `</div>`,
      ].join("");
      return `<div class="tl-day">${head}${items}${note}</div>`;
    })
    .join("");

  return `<div class="tl${colCls}"${extraStyle}>${body}</div>`;
}

/* ---------- 单列纵向时间轴 ---------- */
function renderVertical(days) {
  const body = days
    .map((d, i) => {
      const title = d.date ? `${esc(d.name)} · ${esc(d.date)}` : esc(d.name);
      const rows = d.items
        .map((it, idx) => {
          const note = it.note ? `<em>${esc(it.note)}</em>` : "";
          const isPeriod = it.time && !/^\d/.test(it.time);
          // 连续相同的时段合并为一个胶囊：后续行时间列留空，正文对齐到胶囊右侧。
          // 只并"连续且相同"（上午→下午→上午 是三个独立块，各自保留）；精确时刻不并。
          const merged = isPeriod && idx > 0 && d.items[idx - 1].time === it.time;
          const timeHtml = merged
            ? "<time></time>"
            : `<time${isPeriod ? ' class="tl-time--period"' : ""}>${esc(it.time)}</time>`;
          return `<li>${timeHtml}<span>${esc(it.text)}</span>${note}</li>`;
        })
        .join("");
      const note = d.note ? `<div class="tl-note">${esc(d.note)}</div>` : "";
      return `<div class="tl-item"><div class="tl-dot">${dotNumber(d.name, i)}</div><div class="tl-card"><div class="tl-card-head"><span class="tl-date">${title}</span></div><ul class="tl-schedule">${rows}</ul>${note}</div></div>`;
    })
    .join("");
  return `<div class="tl">${body}</div>`;
}

hexo.extend.tag.register(
  "timeline",
  function (args, content) {
    const arg0 = String(args[0] || "").toLowerCase();
    const cols = parseInt(arg0, 10);
    const days = parse(content);
    if (days.length === 0) return "";

    // 数字 >=2 → 多列；vertical / 无参数 / 1 → 单列
    if (arg0 === "vertical" || isNaN(cols) || cols < 2) {
      return renderVertical(days);
    }
    return renderColumns(days, cols);
  },
  { ends: true }
);

/*
 * CSS 按需注入：整页渲染完成后，若出现 .tl 就补一个 <link> 到 </head> 前。
 * 依赖 hexo 自动加载 themes/<name>/scripts/ 下所有 js（load_plugins.js 的 loadScripts）。
 */
hexo.extend.filter.register("after_render:html", function (html) {
  if (!html || html.indexOf('class="tl') === -1) return html;
  if (html.indexOf("/linen-theme/css/timeline.css") !== -1) return html; // 已注入过

  // 缓存版本号 = timeline.scss 的修改时间：CSS 一改 URL 就变，浏览器不会沿用旧样式
  let version = "1";
  try {
    const themeDir = hexo.theme_dir || path.join(hexo.base_dir, "themes", hexo.config.theme || "");
    const scss = path.join(themeDir, "source", "linen-theme", "css", "timeline.scss");
    version = String(fs.statSync(scss).mtimeMs);
  } catch (e) {
    version = (hexo.theme && hexo.theme.config && hexo.theme.config.version) || "1";
  }
  const href =
    (hexo.config.root || "/") + "linen-theme/css/timeline.css?v=" + version;
  const link = `<link rel="stylesheet" href="${href}">`;

  if (html.indexOf("</head>") !== -1) {
    return html.replace("</head>", link + "</head>");
  }
  return html; // 没有 </head>（非整页）就不动
});

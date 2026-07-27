"use strict";

const fs = require("hexo-fs");
const path = require("path");

// ── 图片尺寸缓存 ──
const sizeCache = new Map();
const MAX_DIM = 500; // 长边最大像素

function getImageSize(filePath) {
  if (sizeCache.has(filePath)) return sizeCache.get(filePath);

  try {
    const buf = Buffer.alloc(32);
    const fd = fs.openSync(filePath, "r");
    const bytesRead = fs.readSync(fd, buf, 0, 32, 0);
    fs.closeSync(fd);

    if (bytesRead < 24) return setCache(null);

    // JPEG
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let offset = 2;
      while (offset + 8 < bytesRead) {
        if (buf[offset] !== 0xff) return setCache(null);
        const marker = buf[offset + 1];
        if ((marker >= 0xc0 && marker <= 0xc2) || (marker >= 0xc4 && marker <= 0xc7)) {
          return setCache({
            width: buf.readUInt16BE(offset + 7),
            height: buf.readUInt16BE(offset + 5)
          });
        }
        const segLen = buf.readUInt16BE(offset + 2);
        offset += 2 + segLen;
      }
      return setCache(null);
    }

    // PNG
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
      return setCache({
        width: buf.readUInt32BE(16),
        height: buf.readUInt32BE(20)
      });
    }

    return setCache(null);
  } catch (e) {
    return setCache(null);
  }

  function setCache(v) { sizeCache.set(filePath, v); return v; }
}

function calcDisplayWidth(naturalW, naturalH, maxDim) {
  const longer = Math.max(naturalW, naturalH);
  const scale = Math.min(maxDim / longer, 1);
  return Math.round(naturalW * scale);
}

// ── Tag: {% livephoto photo video [key:value ...] %} ──
// Options (all optional):
//   width:400           CSS width (number = px)
//   autoplay:false      关闭自动播放 (默认 true)
//   lazyLoad:false      关闭延迟加载 (默认 true)
//   enableVibration:false  关闭触觉反馈
hexo.extend.tag.register("livephoto", function (args) {
  const [photo, video, ...rest] = args;
  const root = hexo.config.root || "/";

  // 解析 key:value 选项
  const opts = {};
  for (const arg of rest) {
    const idx = arg.indexOf(":");
    if (idx === -1) {
      if (!opts.width && /^\d+$/.test(arg)) opts.width = arg;
      continue;
    }
    const key = arg.slice(0, idx);
    const val = arg.slice(idx + 1);
    if (val === "true") opts[key] = true;
    else if (val === "false") opts[key] = false;
    else opts[key] = val;
  }

  const resolveAsset = (filename) => {
    if (!filename) return "";
    if (/^(https?:)?\/\//.test(filename)) return filename;

    const PostAsset = hexo.model("PostAsset");
    if (this.page && this.page.source) {
      const sourceDir = this.page.source.replace(/\.md$/, "");
      const asset = PostAsset.findById(`${sourceDir}/${filename}`);
      if (asset) return root + asset.path;
    }
    const postPath = ((this.page && this.page.path) || this.path || "").replace(/\/$/, "");
    return root + postPath + "/" + filename;
  };

  const photoUrl = resolveAsset(photo);
  const videoUrl = resolveAsset(video);

  // 计算显示宽度：根据图片实际尺寸动态计算，长边不超过 MAX_DIM
  let displayWidth = opts.width || 375; // 默认兜底
  if (!opts.width && photo && this.page && this.page.source) {
    const sourceDir = path.dirname(this.page.source);
    const imagePath = path.join(hexo.source_dir, sourceDir, photo);
    if (fs.existsSync(imagePath)) {
      const size = getImageSize(imagePath);
      if (size && size.width && size.height) {
        displayWidth = calcDisplayWidth(size.width, size.height, MAX_DIM);
      }
    }
  }

  const parts = [];
  if (opts.width) {
    parts.push(`width:${isNaN(opts.width) ? opts.width : opts.width + "px"};max-width:100%;`);
  } else {
    parts.push(`width:${displayWidth}px;max-width:100%;`);
  }
  parts.push("position:relative;overflow:hidden;");
  const style = parts.join("");

  // 非样式选项 → data 属性
  const dataAttrs = [];
  if (opts.autoplay !== undefined) dataAttrs.push(`data-autoplay="${opts.autoplay}"`);
  if (opts.lazyLoad !== undefined) dataAttrs.push(`data-lazy-load="${opts.lazyLoad}"`);
  if (opts.enableVibration !== undefined) dataAttrs.push(`data-enable-vibration="${opts.enableVibration}"`);

  return (
    `<div class="live-photo-wrap" data-photo-src="${photoUrl}" data-video-src="${videoUrl}"` +
    (dataAttrs.length ? " " + dataAttrs.join(" ") : "") +
    ` style="${style}">` +
    "</div>"
  );
});

// ── Filter: 复制 JS/CSS 到主题 source 目录，并在有 live photo 的页面注入引用 ──
let filesCopied = false;

hexo.extend.filter.register("after_render:html", function (htmlContent, data) {
  const version = hexo.theme.config?.version || Date.now();
  const root = hexo.config.root || "/";

  if (!filesCopied) {
    filesCopied = true;
    const jsSrc = path.join(hexo.base_dir, "node_modules/live-photo/dist/LivePhotoViewer.esm.js");
    const jsDest = path.join(hexo.theme_dir, "source/linen-theme/js/live-photo.esm.js");
    const cssSrc = path.join(hexo.base_dir, "node_modules/live-photo/dist/LivePhotoViewer.css");
    const cssDest = path.join(hexo.theme_dir, "source/linen-theme/css/live-photo.css");

    if (fs.exists(jsSrc)) {
      fs.writeFileSync(jsDest, fs.readFileSync(jsSrc));
    }
    if (fs.exists(cssSrc)) {
      fs.writeFileSync(cssDest, fs.readFileSync(cssSrc));
    }
  }

  if (!/live-photo-wrap/.test(htmlContent)) return htmlContent;

  const injection = [
    `<link rel="stylesheet" href="${root}linen-theme/css/live-photo.css?v=${version}">`,
    `<style>`,
    `.live-photo-wrap .live-photo-container{width:100%;height:100%}`,
    `.dropdown-menu{display:none!important}`,
    `</style>`,
    `<script>navigator.vibrate&&(navigator.vibrate=function(){try{return navigator.vibrate.apply(this,arguments)}catch(e){return!1}})</script>`,
    `<script type="module">`,
    `import { LivePhotoViewer } from "${root}linen-theme/js/live-photo.esm.js?v=${version}";`,
    `document.querySelectorAll('.live-photo-wrap').forEach(function(el,i){`,
    `var opts={photoSrc:el.dataset.photoSrc,videoSrc:el.dataset.videoSrc,container:el,width:parseInt(el.style.width)||375,autoplay:el.dataset.autoplay!=='false',lazyLoadVideo:el.dataset.lazyLoad!=='false',enableVibration:el.dataset.enableVibration!=='false'};`,
    `try{new LivePhotoViewer(opts)}catch(e){console.error('[live-photo] error #'+i,e)}`,
    `});`,
    `</script>`,
  ].join("");

  const lastHeadIndex = htmlContent.lastIndexOf("</head>");
  if (lastHeadIndex === -1) return htmlContent;
  return (
    htmlContent.substring(0, lastHeadIndex) +
    injection +
    htmlContent.substring(lastHeadIndex)
  );
});

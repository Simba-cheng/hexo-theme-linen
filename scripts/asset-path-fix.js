"use strict";

const path = require("path");

hexo.extend.filter.register(
  "before_post_render",
  function (data) {
    const slug = path.basename(data.source, ".md");
    if (!slug) return data;

    // 文章 URL 目录，encodeURI 处理空格和中文等字符，避免 markdown 解析 URL 时出错
    const postDir = encodeURI(data.path.replace(/index\.html$/, ""));

    // 1. Typora 友好写法 → 剥离 ./文章slug/ 前缀
    const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const typoraPattern = new RegExp(
      `!\\[([^\\]]*)\\]\\(\\.\\/${escaped}/([^)]+)\\)`,
      "g"
    );
    data.content = data.content.replace(typoraPattern, "![$1]($2)");

    // 2. :::image-grid 块内的相对路径 → 补全文章 URL 路径
    //    因为 image-grid 用 renderSync 独立渲染，拿不到 postAsset 解析上下文
    data.content = data.content.replace(
      /:::image-grid(?:\s+[\w-]+)?([\s\S]*?):::/g,
      function (match) {
        return match.replace(
          /!\[([^\]]*)\]\(((?!\/|http|\/\/|\.\/)[^)]+)\)/g,
          `![$1](/${postDir}$2)`
        );
      }
    );

    return data;
  },
  0
);
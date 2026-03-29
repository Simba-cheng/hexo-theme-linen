const { url_for } = require("hexo-util");

if (hexo?.config?.theme_config?.feed === false) {
  return;
}

function escape(value) {
  if (value == null) return "";
  const str = String(value);

  const re = /[&<>"'`]/g;

  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;",
  };

  return str.replace(re, (ch) => map[ch]);
}

hexo.extend.generator.register("rss", function (locals) {
  const themeConfig = hexo.theme.config;
  const posts = locals.posts.sort("-date").limit(themeConfig?.feed?.limit ?? 10);
  const config = hexo.config;
  const language = config.language || "";
  const getPostDate = hexo.extend.helper.get("getPostDate");

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<?xml-stylesheet type="text/xsl" href="/css/rss-${language.startsWith("zh") ? "zh" : "en"}.xsl"?>
<rss version="2.0">
<channel>
  <title>${escape(config.title)}</title>
  <link>${config.url}</link>
  <description>${escape(config.description || "")}</description>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <image>
      <url>${/http/.test(themeConfig?.feed?.icon) ? themeConfig?.feed?.icon : `${config.url}${themeConfig?.feed?.icon}`}</url>
      <title>${escape(config.title)}</title>
      <link>${config.url}</link>
    </image>
  ${posts
    .map((post) => {
      let postContent = post._content
        .replace(
          /:::image-grid(?:\s+([\w-]+))?([\s\S]*?):::/g,
          (match, grid, content) => {
            const gridClass = grid ? ` ${grid}` : "";
            return `<span class="image-grid${gridClass}">${hexo.render
              .renderSync({
                text: content,
                engine: "markdown",
              })
              .replace(/<p>/g, '<span class="grid-item">')
              .replace(/<\/p>/g, "</span>")}</span>`;
          },
        )
        .replace(/\s*data-placeholderimg="[^"]*"/g, "");
      const rawHtml = hexo.render
        .renderSync({
          text: postContent,
          engine: "markdown",
        })
        .replace(
          /<img\b(?![^>]*\bloading=)([^>]*)>/gi,
          '<img loading="lazy"$1>',
        )
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, "");

      return `
    <item>
      <title>${escape(`${post.title}${post?.subTitle ? `(${post.subTitle})` : ""}`)}</title>
      <link>${config.url + url_for.bind(hexo)(post.path)}</link>
      <guid>${config.url + url_for.bind(hexo)(post.path)}</guid>
      <pubDate>${getPostDate(post, language)}</pubDate>
      <description><![CDATA[${rawHtml}]]></description>
    </item>`;
    })
    .join("")}
</channel>
</rss>`;

  return {
    path: themeConfig?.feed?.path ?? '/feed.xml',
    data: feed,
  };
});

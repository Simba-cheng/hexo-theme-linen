function processCodeBlock(content) {
  return content.replace(
    /<\/figure>/g,
    '<div class="copy-btn"></div></figure>',
  );
}

function process(content) {
  if (!content) return "";
  const h2Regex = /(<h2[^>]*>.*?<\/h2>)/g;
  let match,
    count = 0,
    lastIndex = 0;
  let updatedContent = content;

  while ((match = h2Regex.exec(content)) !== null) {
    count++;
    if (count === 3) {
      lastIndex = match.index + match[0].length;
      updatedContent =
        content.slice(0, lastIndex) +
        '<div id="gitalk-initiator"></div>' +
        content.slice(lastIndex);
      return updatedContent;
    }
  }

  return updatedContent + '<div id="gitalk-initiator"></div>';
}

hexo.extend.filter.register(
  "after_post_render",
  function (data) {
    data.content = processCodeBlock(data.content);
    data.content = process.call(this, data.content);
    return data;
  },
  2,
);

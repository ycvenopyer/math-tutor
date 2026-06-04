(function () {
  'use strict';

  var mt = window.MathTutor;
  if (!mt) return;

  var prevMarkdown = window.$docsify && window.$docsify.markdown;

  window.$docsify.markdown = function (marked, renderer) {
    if (typeof prevMarkdown === 'function') {
      marked = prevMarkdown(marked, renderer) || marked;
    }

    var originCode = renderer.code.bind(renderer);
    renderer.code = function () {
      var arg = arguments[0];
      var text = arg && typeof arg === 'object' ? arg.text : arguments[0];
      var lang = arg && typeof arg === 'object' ? arg.lang : arguments[1];

      if (lang === 'tikz') {
        return (
          '<div class="' + mt.TIKZ_PENDING + '">' +
          '<pre style="display:none">' + mt.escapeHtml(text) + '</pre>' +
          '</div>'
        );
      }

      return originCode.apply(this, arguments);
    };

    return marked;
  };
})();

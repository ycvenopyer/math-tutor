(function () {
  'use strict';

  var TIKZ_PENDING = 'tikz-pending';

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getBasePath() {
    var base = (window.$docsify && window.$docsify.basePath) || '/';
    return base.charAt(base.length - 1) === '/' ? base : base + '/';
  }

  function resolveAsset(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return getBasePath() + path.replace(/^\//, '');
  }

  function processTikzBlocks(root) {
    if (!root) return;

    root.querySelectorAll('.' + TIKZ_PENDING).forEach(function (el) {
      insertTikzScript(el, readHiddenPre(el));
    });

    root.querySelectorAll('pre code.lang-tikz, pre code.language-tikz').forEach(function (codeEl) {
      var pre = codeEl.closest('pre');
      if (!pre || pre.dataset.tikzProcessed === 'true') return;
      pre.dataset.tikzProcessed = 'true';
      insertTikzScript(pre, codeEl.textContent);
    });
  }

  function readHiddenPre(el) {
    var pre = el.querySelector('pre');
    return pre ? pre.textContent : '';
  }

  function insertTikzScript(target, source) {
    if (!source) return;

    var container = document.createElement('div');
    container.className = 'tikzjax-container';

    var script = document.createElement('script');
    script.type = 'text/tikz';
    script.textContent = source;
    container.appendChild(script);

    target.replaceWith(container);
  }

  function fixPdfPaths(root) {
    if (!root) return;

    root.querySelectorAll('[data-pdf]').forEach(function (node) {
      node.src = resolveAsset(node.getAttribute('data-pdf'));
    });

    root.querySelectorAll('[data-pdf-download]').forEach(function (node) {
      node.href = resolveAsset(node.getAttribute('data-pdf-download'));
    });
  }

  function initPdfToggle(root) {
    if (!root) return;

    var toggle = root.querySelector('#pdf-toggle');
    var wrap = root.querySelector('#pdf-frame-wrap');
    if (!toggle || !wrap || toggle.dataset.bound === 'true') return;

    toggle.dataset.bound = 'true';
    toggle.addEventListener('click', function () {
      var collapsed = wrap.classList.toggle('is-collapsed');
      toggle.textContent = collapsed ? '展开预览' : '收起预览';
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
  }

  function afterRoute() {
    var root = document.querySelector('section.content');
    if (!root) return;

    processTikzBlocks(root);
    fixPdfPaths(root);
    initPdfToggle(root);
  }

  window.$docsify = window.$docsify || {};
  var plugins = window.$docsify.plugins || [];
  plugins.push(function (hook) {
    hook.doneEach(afterRoute);
  });
  window.$docsify.plugins = plugins;

  window.MathTutor = {
    afterRoute: afterRoute,
    resolveAsset: resolveAsset,
    TIKZ_PENDING: TIKZ_PENDING,
    escapeHtml: escapeHtml
  };
})();

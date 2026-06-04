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

  function safeTikzSource(text) {
    return String(text).replace(/<\/script/gi, '<\\/script');
  }

  function buildTikzSrcdoc(source) {
    return (
      '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<link rel="stylesheet" href="https://tikzjax.com/v1/fonts.css">' +
      '<style>html,body{margin:0;padding:8px;overflow:hidden;background:transparent;text-align:center}</style>' +
      '</head><body>' +
      '<script type="text/tikz">' + safeTikzSource(source) + '<\/script>' +
      '<script src="https://tikzjax.com/v1/tikzjax.js"><\/script>' +
      '</body></html>'
    );
  }

  function fitTikzIframe(iframe) {
    var doc = iframe.contentDocument;
    if (!doc) return;

    var svg = doc.querySelector('svg');
    var height = svg
      ? Math.ceil(svg.getBoundingClientRect().height) + 16
      : doc.body.scrollHeight;

    if (height > 0) {
      iframe.style.height = height + 'px';
    }
  }

  function bindTikzIframe(iframe) {
    iframe.addEventListener('load', function () {
      var doc = iframe.contentDocument;
      if (!doc) return;

      doc.addEventListener('tikzjax-load-finished', function () {
        fitTikzIframe(iframe);
      });

      var tries = 0;
      var timer = setInterval(function () {
        fitTikzIframe(iframe);
        if (doc.querySelector('svg') || ++tries > 120) {
          clearInterval(timer);
        }
      }, 500);
    });
  }

  /** TikZJax only runs on window.onload; Docsify injects content later, so render in an iframe. */
  function insertTikzScript(target, source) {
    if (!source || !String(source).trim()) return;

    var container = document.createElement('div');
    container.className = 'tikzjax-container';

    var iframe = document.createElement('iframe');
    iframe.className = 'tikzjax-frame';
    iframe.title = 'TikZ 图形';
    iframe.loading = 'lazy';
    iframe.setAttribute('referrerpolicy', 'no-referrer');
    iframe.srcdoc = buildTikzSrcdoc(source);
    bindTikzIframe(iframe);

    container.appendChild(iframe);
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

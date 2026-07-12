# 公式与讲义示例

本页演示站点支持的两种能力：**数学公式**、**PDF 预览与下载**。

## LaTeX 公式

行内公式：勾股定理 $a^2 + b^2 = c^2$，一元二次方程求根公式 $x = \dfrac{-b \pm \sqrt{b^2-4ac}}{2a}$。

块级公式（韦达定理）：

$$
x_1 + x_2 = -\frac{b}{a}, \qquad x_1 x_2 = \frac{c}{a}
$$


## PDF 讲义

<div class="pdf-panel" id="pdf-panel">
  <div class="pdf-toolbar">
    <h2 class="pdf-title">全等三角形7大模型</h2>
    <div class="pdf-actions">
      <button type="button" class="btn" id="pdf-toggle" aria-expanded="true" aria-controls="pdf-frame-wrap">收起预览</button>
      <a class="btn btn-primary" data-pdf-download="pdf/sample-lesson.pdf" download>下载 PDF</a>
    </div>
  </div>
  <div class="pdf-frame-wrap" id="pdf-frame-wrap">
    <iframe class="pdf-frame" data-pdf="pdf/全等三角形7大模型.pdf" title="全等三角形7大模型" loading="lazy"></iframe>
  </div>
</div>

将讲义放在 `docs/pdf/`，在 Markdown 中按上例嵌入 iframe；路径会通过 `basePath` 自动适配本地与 GitHub Pages。


# 公式与图形示例

本页演示站点支持的三种能力：**数学公式**、**TikZ 图形**、**PDF 预览与下载**。

## LaTeX 公式

行内公式：勾股定理 $a^2 + b^2 = c^2$，一元二次方程求根公式 $x = \dfrac{-b \pm \sqrt{b^2-4ac}}{2a}$。

块级公式（韦达定理）：

$$
x_1 + x_2 = -\frac{b}{a}, \qquad x_1 x_2 = \frac{c}{a}
$$

三角恒等式：

$$
\sin^2\theta + \cos^2\theta = 1
$$

## TikZ 几何图

下面是一个直角三角形示意图（由 TikZJax 在浏览器中渲染）：

```tikz
\begin{tikzpicture}[scale=1.2]
  \draw[thick] (0,0) -- (3,0) -- (3,2) -- cycle;
  \draw (2.7,0) -- (2.7,0.3) -- (3,0.3);
  \node at (1.5,-0.35) {$a$};
  \node at (3.35,1) {$b$};
  \node at (1.2,1.15) {$c$};
\end{tikzpicture}
```

坐标系中的抛物线草图：

```tikz
\begin{tikzpicture}[scale=0.9]
  \draw[->] (-2.2,0) -- (2.5,0) node[right] {$x$};
  \draw[->] (0,-0.5) -- (0,3.2) node[above] {$y$};
  \draw[domain=-1.5:1.5, smooth, thick, blue] plot (\x, {2*\x*\x});
  \node[blue] at (1.2,2.5) {$y=2x^2$};
\end{tikzpicture}
```

## PDF 讲义

<div class="pdf-panel" id="pdf-panel">
  <div class="pdf-toolbar">
    <h2 class="pdf-title">示例讲义（可替换为你的 PDF）</h2>
    <div class="pdf-actions">
      <button type="button" class="btn" id="pdf-toggle" aria-expanded="true" aria-controls="pdf-frame-wrap">收起预览</button>
      <a class="btn btn-primary" data-pdf-download="pdf/sample-lesson.pdf" download>下载 PDF</a>
    </div>
  </div>
  <div class="pdf-frame-wrap" id="pdf-frame-wrap">
    <iframe class="pdf-frame" data-pdf="pdf/sample-lesson.pdf" title="示例讲义 PDF" loading="lazy"></iframe>
  </div>
</div>

将讲义放在 `docs/pdf/`，在 Markdown 中按上例嵌入 iframe；路径会通过 `basePath` 自动适配本地与 GitHub Pages。

## 编写新章节

1. 在对应编号目录下新建 `*.md`（如 `01.课内知识体系/新章节.md`）
2. 在 `_sidebar.md` 增加链接

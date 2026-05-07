# 15_前端样式Token_JSON与CSS变量清单

## 1. 文档目的

本文件把业主端视觉重构稿继续向前落一层，沉淀为前端可直接消费的：

- `JSON token`
- `CSS 变量`

交付基准来源：

- [12_业主端APP设计规范_视觉与交互系统.md](</C:/Users/14894/Documents/New project 3/12_业主端APP设计规范_视觉与交互系统.md>)
- [13_业主端APP组件拆解清单_基于优化稿.md](</C:/Users/14894/Documents/New project 3/13_业主端APP组件拆解清单_基于优化稿.md>)
- [14_前端交接文档_业主端APP视觉重构开发说明.md](</C:/Users/14894/Documents/New project 3/14_前端交接文档_业主端APP视觉重构开发说明.md>)
- [ChatGPT Image 2026年5月5日 22_43_32 (1).png](</C:/Users/14894/Downloads/ChatGPT Image 2026年5月5日 22_43_32 (1).png>)
- [ChatGPT Image 2026年5月5日 22_43_33 (2).png](</C:/Users/14894/Downloads/ChatGPT Image 2026年5月5日 22_43_33 (2).png>)

---

## 2. 本次新增交付文件

- [tokens/resident-app.tokens.json](</C:/Users/14894/Documents/New project 3/tokens/resident-app.tokens.json>)
- [tokens/resident-app.tokens.css](</C:/Users/14894/Documents/New project 3/tokens/resident-app.tokens.css>)

说明：

1. `JSON` 适合后续接 `Style Dictionary / 自定义构建脚本 / TS theme object`
2. `CSS` 适合静态原型或直接在前端主题层中引入
3. 本次只沉淀 token，不强制改动现有页面结构

---

## 3. Token 命名原则

### 3.1 基础 token

用于原子值，不带业务语义：

- `color`
- `font-family`
- `font-size`
- `font-weight`
- `radius`
- `space`
- `shadow`
- `motion`

### 3.2 语义 token

用于页面和组件场景：

- `page`
- `surface`
- `button`
- `chip`
- `tab-bar`
- `card`
- `asset`
- `drawer`
- `toast`

---

## 4. 前端落地建议

### 4.1 静态原型阶段

直接在 `resident.html` 或 `styles.css` 顶部引入：

```html
<link rel="stylesheet" href="./tokens/resident-app.tokens.css" />
```

### 4.2 正式组件化阶段

建议拆为：

1. `foundation tokens`
2. `semantic tokens`
3. `component tokens`

可映射到：

- `Button`
- `Chip`
- `HeroCard`
- `SolutionCard`
- `TaskCard`
- `MessageCard`
- `AssetCard`
- `BottomTabBar`

### 4.3 使用优先级

1. 先统一颜色、字号、圆角、阴影
2. 再统一按钮、卡片、导航
3. 最后再补动效、红点、空状态细节

---

## 5. 关键值说明

### 5.1 页面底色

- `--color-bg-page: #FFF9F3`
- `--color-bg-soft: #FFE7C8`

对应视觉稿里的奶油白底和暖杏色柔光底。

### 5.2 主行动色

- `--color-brand-primary: #FF8A3D`
- `--color-brand-primary-press: #F07B2E`

只用于首页主 CTA、选中态和高关注行动。

### 5.3 正向色

- `--color-brand-secondary: #6BA26B`
- `--color-brand-secondary-press: #5D925D`

用于回收、推荐、互助、完成态。

### 5.4 主文字色

- `--color-text-primary: #5A3E2B`

这轮故意不用冷黑，目的是保留居家感和温暖感。

### 5.5 主卡圆角

- `--radius-card-xl: 20px`

用于首页英雄卡、推荐方案卡、资产总览卡。

### 5.6 阴影

- `--shadow-ambient`
- `--shadow-contact`

保留“浮起但不硬”的轻拟物关系。

---

## 6. 组件映射建议

### 首页

- 顶部问候区：`page / surface / text / space`
- 地址胶囊：`chip / button / border`
- 问题状态大卡：`card.hero / card.surface / state`
- 推荐方案卡：`card.recommend / button.primary / chip`
- 其他方案卡：`card.option / button.outline`

### 志愿页

- 任务大厅 banner：`card.hero`
- 任务筛选：`chip.filter`
- 任务卡：`card.task / button.primary / button.secondary`

### 消息页

- 筛选栏：`chip.filter`
- 消息卡：`card.list`
- 未读点：`state.danger`

### 家人页

- 关系卡：`card.hero / state.info`
- 代办清单：`card.list`

### 我的页

- 资产总览卡：`asset.hero`
- 双账户卡：`asset.account`
- 流水项：`asset.ledger`
- 徽章架：`asset.badge`

---

## 7. 验收口径

前端接入 token 后，应该能至少保证：

1. 首页、消息、家人、我的页颜色关系统一
2. 所有主按钮、次按钮、线框按钮的高度、圆角、阴影一致
3. 所有主卡片具备同一套圆角和层级阴影
4. 页面不会再出现“一个组件一个颜色体系”的问题
5. 后续新增页面也能沿用这套 theme 层继续扩展

---

## 8. 结论

这一步的意义不是“多写两份文件”，而是把视觉稿真正翻译成：

- 前端能复用的值
- 组件能继承的规则
- 后续能持续维护的主题层

做到这里之后，前端就不需要再一边看图一边手抄颜色和圆角了。

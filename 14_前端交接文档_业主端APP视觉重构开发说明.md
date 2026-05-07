# 14_前端交接文档_业主端APP视觉重构开发说明

## 1. 交接目标

本交接文档面向前端开发，目标是把新的视觉稿与设计规范转化为可执行的开发清单。

本轮交接范围：

- `业主客户端伪 App`
- 仅限 `UI / UX 视觉重构`
- 不变更既有业务闭环
- 不删需求点
- 只重组页面层级、组件样式、交互表达方式

设计基准文件：

- [12_业主端APP设计规范_视觉与交互系统.md](</C:/Users/14894/Documents/New project 3/12_业主端APP设计规范_视觉与交互系统.md>)
- [13_业主端APP组件拆解清单_基于优化稿.md](</C:/Users/14894/Documents/New project 3/13_业主端APP组件拆解清单_基于优化稿.md>)
- [ChatGPT Image 2026年5月5日 22_43_32 (1).png](</C:/Users/14894/Downloads/ChatGPT Image 2026年5月5日 22_43_32 (1).png>)
- [ChatGPT Image 2026年5月5日 22_43_33 (2).png](</C:/Users/14894/Downloads/ChatGPT Image 2026年5月5日 22_43_33 (2).png>)

---

## 2. 本轮开发原则

### 2.1 不允许做的事

1. 不要删掉既有业务模块
2. 不要为了好看改掉业务逻辑
3. 不要把页面重新做回“信息总览页”
4. 不要做成后台感 H5
5. 不要把页面做成说明文档拼贴

### 2.2 必须做到的事

1. 首页必须像任务处理首页
2. 我的页必须像资产页
3. 志愿页必须像任务大厅
4. 消息页必须像消息中心
5. 家人页必须像关系与代办页
6. 所有页面必须符合移动端 App 交互习惯

---

## 3. 页面信息架构

底部导航固定 5 个入口：

1. `首页`
2. `邻里互助`
3. `消息`
4. `活动`
5. `我的`

说明：

- 当前视觉稿中底部第四项显示为 `活动`
- 如果现有业务里第四项仍承接 `志愿 / 成果 / 社区参与`，可先保留产品文案为“活动”，内部逻辑映射到既有志愿内容
- 最终命名以产品确认稿为准，但视觉布局按 5 Tab 结构实现

---

## 4. 页面开发拆解

### 4.1 首页

#### 目标

用户一打开就知道：

1. 发生了什么
2. 为什么先处理
3. 最推荐怎么处理
4. 点下去会发生什么

#### 首屏顺序

1. 顶部问候区
2. 地址胶囊
3. 问题状态大卡
4. 优先原因卡
5. 推荐方案大卡

#### 第二屏顺序

1. 其他解决方式
2. 决策辅助卡
3. 底部导航

#### 首页必须保留的业务内容

- 当前事件
- 风险等级
- 推荐方案
- 其他解决方式
- 奖励导向
- 邻里互助导向

#### 前端要求

1. 首页模块不是平均平铺
2. 推荐方案卡必须是视觉主卡
3. 其他方案卡必须是可点击卡片，不是纯按钮列表
4. 风险与收益要同屏出现

---

### 4.2 志愿 / 邻里互助页

#### 目标

让用户觉得“这是我顺手能做的小任务”，而不是“社区宣传页”。

#### 页面结构

1. 顶部轻引导 Banner
2. 推荐任务区
3. 就近任务区
4. 已参与 / 已完成任务区
5. 成果墙入口

#### 每张任务卡必须展示

- 任务标题
- 任务类型
- 预计时长
- 完成收益
- 适合谁
- 完成后结果会被看见
- CTA 按钮

#### 前端要求

1. 卡片必须有报名冲动
2. 不要做成朴素列表
3. 已报名与已完成状态必须明显区分

---

### 4.3 消息页

#### 目标

像 App 通知中心，不像文案列表。

#### 页面结构

1. 页面标题
2. 全部已读入口
3. 分段筛选
4. 消息卡列表

#### 消息分类

- 办理提醒
- 奖励动态
- 志愿 / 成果动态

#### 前端要求

1. 支持高优先级消息高亮
2. 支持分组筛选
3. 支持空状态
4. 不允许“无代办人”场景仍显示错误同步文案

---

### 4.4 家人页

#### 目标

建立“关系感”和“安心感”。

#### 页面分两种状态

1. `有代办人`
2. `无代办人`

#### 前端要求

1. 两种状态要做成成立的页面，不是 if/else 换一句文案
2. 有代办人时要展示：
   - 代办人是谁
   - 已同步什么
   - 对方能帮我做什么
3. 无代办人时要展示：
   - 这单可自己处理
   - 当前流程已简化
   - 回首页继续处理 CTA

---

### 4.5 我的页

#### 目标

做成资产页，不是规则说明页。

#### 页面首屏必须出现

1. 账户总览
2. 当前等级
3. 双积分账户
4. 等级进度

#### 页面第二层

1. 待到账
2. 已到账
3. 可用权益
4. 已使用
5. 最近到账记录
6. 徽章与成就

#### 前端要求

1. 数值必须有层级感
2. 已到账 / 待到账 / 已使用 / 已解锁 必须明显分层
3. 最近到账记录要做成流水感
4. 权益与券包不能埋在说明文案里

---

## 5. 组件与页面映射

| 页面 | 必须组件 |
|---|---|
| 首页 | GreetingHero / LocationPill / IssueStatusHeroCard / ReasonExplainCard / RecommendedSolutionCard / AlternativeSolutionSection / DecisionHelperCard / BottomTabBar |
| 志愿页 | VolunteerHeroBanner / TaskFilterBar / VolunteerTaskCard / ResultWallEntryCard |
| 消息页 | MessageFilterTabs / MessageCard / UnreadDot / EmptyStateBlock |
| 家人页 | FamilyDelegateHeroCard / DelegateStatusCard / ActionListCard / EmptyStateBlock |
| 我的页 | AssetHeroCard / DualPointAccountCard / AssetStatusGrid / CouponCard / LedgerListItem / BadgeShelf |

---

## 6. 前端目录建议

如果继续走静态原型结构，建议至少按组件拆文件：

```text
resident.html
resident.js
styles.css

components/
  app-header.js
  bottom-tab-bar.js
  hero-cards.js
  solution-cards.js
  chips.js
  buttons.js
  asset-cards.js
  message-cards.js
  volunteer-cards.js
  family-cards.js
```

如果当前阶段不拆文件，也至少在 JS 中按模块分区：

1. Tokens
2. Shared UI helpers
3. Home render
4. Volunteer render
5. Message render
6. Family render
7. Mine render
8. Overlay / Drawer / Toast

---

## 7. 样式 Token 落地建议

### 7.1 颜色 Token

```css
--brand-primary: #FF8A3D;
--brand-secondary: #6BA26B;
--bg-page: #FFF9F3;
--bg-soft: #FFE7C8;
--text-primary: #5A3E2B;
--text-secondary: #8E96A3;
--state-danger: #E15D4D;
```

### 7.2 圆角 Token

```css
--radius-card-xl: 20px;
--radius-card-lg: 16px;
--radius-card-md: 12px;
--radius-pill: 999px;
```

### 7.3 阴影 Token

```css
--shadow-ambient: 0 8px 24px rgba(90, 62, 43, 0.08);
--shadow-contact: 0 2px 8px rgba(90, 62, 43, 0.06);
```

### 7.4 字体 Token

```css
--font-h1: 700 28px/1.25 "HarmonyOS Sans", "PingFang SC", sans-serif;
--font-h2: 600 22px/1.35 "HarmonyOS Sans", "PingFang SC", sans-serif;
--font-title: 500 18px/1.4 "HarmonyOS Sans", "PingFang SC", sans-serif;
--font-body: 400 14px/1.6 "HarmonyOS Sans", "PingFang SC", sans-serif;
--font-caption: 400 12px/1.5 "HarmonyOS Sans", "PingFang SC", sans-serif;
--font-button: 500 16px/1 "HarmonyOS Sans", "PingFang SC", sans-serif;
```

---

## 8. 状态与交互要求

### 8.1 需要实现的状态

1. 默认态
2. Hover / Press 态
3. 选中态
4. 禁用态
5. 成功态
6. 空状态
7. 未读态

### 8.2 需要实现的反馈

1. 点击按钮后的按压反馈
2. 主 CTA 成功反馈
3. 方案确认后的轻提示
4. 底部抽屉展开 / 关闭
5. 底部导航切换反馈

---

## 9. 视觉验收标准

前端完成后，验收不只看“像不像图”，还要看：

1. 首页首屏是否真正突出“当前问题 + 推荐方案”
2. 用户是不是不用读长文也知道点哪个
3. 我的页是不是一眼有账户感
4. 志愿页是不是像任务大厅
5. 消息页是不是像消息中心
6. 家人页是不是像真实关系页
7. 页面是否保持统一色系、圆角、阴影、图标风格

---

## 10. 开发优先级

### P0

1. 设计 Token
2. 顶部标题栏
3. 首页全部组件
4. 底部导航
5. 我的页核心资产区

### P1

1. 志愿任务卡与任务大厅
2. 消息中心
3. 家人页
4. 成果墙卡片

### P2

1. 红点
2. 成就弹层
3. 微动效
4. 空状态插图

---

## 11. 交接结论

前端本轮不需要自己再“理解产品想做什么”，而是直接按下面三层实现：

1. 按 [12_业主端APP设计规范_视觉与交互系统.md](</C:/Users/14894/Documents/New project 3/12_业主端APP设计规范_视觉与交互系统.md>) 建立视觉 token
2. 按 [13_业主端APP组件拆解清单_基于优化稿.md](</C:/Users/14894/Documents/New project 3/13_业主端APP组件拆解清单_基于优化稿.md>) 拆组件
3. 按本文件完成页面装配和开发优先级安排

最终目标不是“把图画出来”，而是让 `业主端真的像一个愿意被居民打开和继续使用的 App`。


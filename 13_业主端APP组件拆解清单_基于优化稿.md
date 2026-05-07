# 13_业主端APP组件拆解清单_基于优化稿

## 1. 文档目的

本文件用于把优化稿中的视觉组件拆成前端可开发的组件清单。

基准稿来源：

- [ChatGPT Image 2026年5月5日 22_43_32 (1).png](</C:/Users/14894/Downloads/ChatGPT Image 2026年5月5日 22_43_32 (1).png>)
- [ChatGPT Image 2026年5月5日 22_43_33 (2).png](</C:/Users/14894/Downloads/ChatGPT Image 2026年5月5日 22_43_33 (2).png>)

拆解目标：

1. 前端明确有哪些组件要做
2. 每个组件有哪些状态
3. 每个组件承载什么业务内容
4. 哪些组件应该复用，哪些是页面专属

---

## 2. 组件分层

建议按 4 层拆：

1. `基础层`
   - 颜色
   - 字体
   - 圆角
   - 阴影
   - 图标
   - 按钮
   - 标签

2. `通用组件层`
   - 顶部标题栏
   - 地址胶囊
   - 大卡
   - 小卡
   - 芯片
   - 列表卡
   - 底部导航

3. `业务组件层`
   - 问题状态卡
   - 优先原因卡组
   - 推荐方案卡
   - 其他方案卡组
   - 决策辅助卡
   - 资产总览卡
   - 志愿任务卡
   - 成果墙卡

4. `页面模板层`
   - 首页模板
   - 志愿页模板
   - 消息页模板
   - 家人页模板
   - 我的页模板

---

## 3. 基础组件

### 3.1 App 顶部标题栏

#### 用途

- 页面身份识别
- 问候
- 右上角提醒入口

#### 结构

- 头像
- 主标题
- 副标题
- 右上角通知图标
- 角标红点

#### 状态

- 默认
- 有未读消息

#### 前端备注

- 标题支持动态问候词
- 副标题用于承接“整洁楼道，守护共同的家”这类品牌句

---

### 3.2 地址胶囊组件

#### 用途

- 展示当前楼栋 / 单元 / 房号

#### 结构

- 左侧位置图标
- 中间地址文本
- 右侧箭头

#### 状态

- 默认
- 可点击

---

### 3.3 按钮组件

#### 类型

1. 主按钮
2. 次按钮
3. 线框按钮
4. 文本按钮

#### 前端字段建议

```ts
type AppButtonProps = {
  variant: "primary" | "secondary" | "outline" | "text";
  size: "md" | "lg";
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  label: string;
};
```

---

### 3.4 Chip / Tag 组件

#### 用途

- 推荐标签
- 风险标签
- 优势标签
- 筛选标签

#### 类型

- 实心强调
- 浅底描边
- 功能状态

---

## 4. 首页组件拆解

### 4.1 顶部情境问候区

#### 视觉内容

- 用户头像
- “李阿姨，您好”
- 温暖副文案
- 居家场景插画
- 消息铃铛

#### 组件建议

- `ResidentGreetingHero`

#### 组成子件

- `AvatarCard`
- `GreetingTextBlock`
- `SceneIllustration`
- `NotificationBell`

---

### 4.2 问题状态大卡

#### 视觉内容

- 标题：楼道杂物问题
- 紧急标签：需尽快处理
- 问题说明
- 盾牌图形
- 4 个功能选项小卡

#### 组件建议

- `IssueStatusHeroCard`

#### 子组件

1. `IssueTitleBlock`
2. `UrgencyBadge`
3. `IssueIllustrationBadge`
4. `IssueFeatureGrid`

#### Feature Item 4 个

- 24 小时内响应处理
- 智能方案推荐
- 共建整洁楼道 / 邻里互助
- 居民参与 / 共建家园

#### 状态

- 红 / 黄 / 蓝风险
- 有插画 / 无插画

---

### 4.3 优先处理原因卡

#### 视觉内容

- 标题：为什么要优先处理这个问题？
- 3 个原因芯片

#### 原因项

1. 影响通行与消防，存在安全隐患
2. 居住体验下降，环境脏乱差
3. 邻里关系更和谐，共建美好家园

#### 组件建议

- `ReasonExplainCard`

#### 子组件

- `ReasonChip`

---

### 4.4 推荐方案大卡

#### 视觉内容

- 标题：优选解决方式：邻里互助清理
- 推荐标签
- 一行说明
- 4 个优势芯片
- 右侧邻里搬箱插画

#### 组件建议

- `RecommendedSolutionCard`

#### 子组件

- `SolutionHeader`
- `RecommendBadge`
- `BenefitChipGroup`
- `SideIllustration`

#### 优势芯片

- 邻里互助
- 工具支持
- 时间灵活
- 环保处理

---

### 4.5 其他解决方式卡组

#### 视觉内容

- 区块标题：其他解决方式
- 右侧“更多方案”
- 3 张并列方案卡

#### 方案卡

1. 预约清洁
2. 现场回收
3. 自行处理

#### 每张卡必须包含

- 图标
- 标题
- 副文案
- CTA 按钮

#### 组件建议

- `AlternativeSolutionSection`
- `SolutionOptionCard`

#### 按钮映射

- 去预约
- 去回收
- 去处理

---

### 4.6 决策辅助卡

#### 视觉内容

- 标题：做个简单选择，下一步更顺利
- 说明文案
- 4 个筛选选项
- 右侧清单插画

#### 选项

- 时间充裕
- 希望省心
- 想要省钱
- 尽快解决

#### 组件建议

- `DecisionHelperCard`

#### 子组件

- `DecisionChoiceChip`

---

### 4.7 底部导航

#### 视觉内容

- 首页
- 邻里互助
- 消息
- 活动
- 我的

#### 组件建议

- `BottomTabBar`

#### Tab Item 结构

- 图标
- 文案
- 选中态底板 / 颜色变化

---

## 5. 规范图中显式展示的通用组件

### 5.1 主按钮

- 视觉样式：暖橙填充
- 示例文案：去处理

### 5.2 次按钮

- 视觉样式：绿色填充
- 示例文案：去回收

### 5.3 线框按钮

- 视觉样式：橙色描边
- 示例文案：去预约

### 5.4 胶囊筛选

- 视觉样式：浅底描边胶囊
- 示例文案：邻里互助

### 5.5 底部导航选中态

- 图标 + 文案变橙
- 外层带浅卡底

### 5.6 英雄信息卡

- 大圆角
- 左信息右插画
- 柔和暖色底

### 5.7 功能选项卡

- 小卡
- 图标上置
- 两行内文案

### 5.8 信息芯片

- 小标签
- 高亮重点利益点

### 5.9 列表项卡片

- 左图标
- 中间标题副文案
- 右箭头或按钮

---

## 6. 页面级组件映射建议

### 首页

- `ResidentGreetingHero`
- `LocationPill`
- `IssueStatusHeroCard`
- `ReasonExplainCard`
- `RecommendedSolutionCard`
- `AlternativeSolutionSection`
- `DecisionHelperCard`
- `BottomTabBar`

### 志愿页

- `VolunteerHeroBanner`
- `TaskFilterBar`
- `VolunteerTaskCard`
- `ResultWallEntryCard`

### 消息页

- `MessageFilterTabs`
- `MessageCard`
- `UnreadDot`
- `EmptyStateBlock`

### 家人页

- `FamilyDelegateHeroCard`
- `DelegateStatusCard`
- `ActionListCard`
- `EmptyStateBlock`

### 我的页

- `AssetHeroCard`
- `DualPointAccountCard`
- `AssetStatusGrid`
- `CouponCard`
- `LedgerListItem`
- `BadgeShelf`

---

## 7. 组件开发优先级

### P0

1. 顶部标题栏
2. 地址胶囊
3. 问题状态大卡
4. 推荐方案大卡
5. 其他解决方式卡
6. 决策辅助卡
7. 底部导航
8. 主按钮 / 次按钮 / 线框按钮 / Chip

### P1

1. 志愿任务卡
2. 消息卡
3. 家人代办卡
4. 资产卡
5. 流水记录卡
6. 成果卡

### P2

1. 成就弹层
2. 轻动效
3. 红点系统
4. 空状态插图

---

## 8. 前端实现提醒

1. 不要把这些组件做成“只有一个页面能用”的死结构。
2. 优先抽成：
   - `Button`
   - `Chip`
   - `FeatureCard`
   - `HeroCard`
   - `ListCard`
   - `TabBar`
3. 插画区域建议留成 `slot / prop`，不要写死。
4. 卡片里的文案区和插图区必须可伸缩。
5. 组件 first，不要 page first。


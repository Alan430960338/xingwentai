# AGENTS.md

本文件面向会在这个仓库内工作的任意智能体，目标是让后续改动尽量贴合当前项目，而不是套用通用前端模板。

## 1. 项目概览

- 项目类型：`uni-app` + `Vue 3` + `Vite`。
- 包管理痕迹：仓库包含 `pnpm-lock.yaml`，默认优先使用 `pnpm`。
- 默认运行平台：`h5`，由 `unh.config.js` 指定。
- 当前项目更接近“多角色业务原型/前台壳层”，页面数据大量来自本地 `ref([])` 模拟数据，真实接口层尚未全面接入。
- 代码中角色分为三套端：`客户(user)`、`工程师(engineer)`、`服务商(serviceProvider)`。

关键文件：

- `package.json`：脚本与依赖。
- `src/pages.json`：页面注册、easycom 配置、全局导航配置。
- `src/manifest.json`：平台能力与主题配置。
- `src/main.js`：应用入口，当前非常轻。
- `src/App.vue`：全局样式入口，内容很少。
- `src/api/config/request.js`：统一请求封装。
- `src/api/config/config.js`：接口基础地址。

## 2. 运行与构建

优先使用下面这些命令：

- `pnpm dev`：启动 H5 开发。
- `pnpm build`：构建 H5。
- `pnpm dev:mp-weixin`：启动微信小程序开发。
- `pnpm build:mp-weixin`：构建微信小程序。
- `pnpm about`：查看 `unh` 环境信息。

补充说明：

- `package.json` 中没有配置 lint、test 脚本，不要假设仓库已有 ESLint/Prettier/单测流程。
- 如果只是改文档或静态页面，通常不需要补充额外工程化设施。
- 如果做了较大交互修改，至少应自行检查 H5 页面能否正常启动、跳转和输入。

## 3. 目录结构

仓库核心代码都在 `src/`：

- `src/pages/`：业务页面，按角色分目录。
- `src/components/`：共享组件。
- `src/api/`：请求封装与接口模块。
- `src/mixins/`：全局数据、安全区、分享等混入。
- `src/static/`：静态资源。
- `src/uni.scss`：uni-app 全局样式变量入口。
- `src/theme.json`：明暗主题配置。

页面分布规律：

- `src/pages/index.vue`：统一入口页/登录选择页。
- `src/pages/user/**`：客户端页面。
- `src/pages/engineer/**`：工程师端页面。
- `src/pages/serviceProvider/**`：服务商端页面。

共享组件重点看这里：

- `src/components/header.vue`：主头部组件，项目内使用频率高。
- `src/components/header2.vue`：另一套头部样式，使用较少。
- `src/components/button/btmBtn.vue`：项目自定义按钮。
- `src/components/tabBer/index.vue`：客户端底部导航。
- `src/components/tabBer/engineer.vue`：工程师端底部导航。
- `src/components/tabBer/service.vue`：服务商端底部导航。

## 4. 当前代码风格和组织方式

这个仓库不是单一风格，智能体改动时要遵循“就近一致”：

- 页面组件大多使用 `<script setup>` + Composition API。
- 共享组件和 mixin 多使用 Options API。
- 不要为了统一风格而顺手把现有页面整体改写成另一种写法。
- 优先做小改动，尽量在原文件原结构上补齐逻辑。
- 当前没有 Pinia / Vuex，也没有全局 store 体系；除非用户明确要求，不要额外引入状态管理框架。

项目里很常见的写法：

- 页面内直接定义 `ref` 模拟列表数据。
- 用 `computed` 做搜索筛选。
- 用 `uni.navigateTo` 做详情页跳转。
- 用自定义底部栏组件配合 `uni.redirectTo` 切换“tab”页面。

这意味着：

- 不要假设这是一个已经完全接口化的数据驱动项目。
- 新增功能时，先判断当前页面是“静态原型页”还是“已经接接口的页”，再决定改动粒度。

## 5. 路由与导航约定

页面全部注册在 `src/pages.json`。

重要事实：

- 当前项目没有使用 uni-app 原生 `tabBar` 配置。
- 三套底部导航都是自定义组件，不是 `switchTab` 模式。
- 底部导航组件内部当前使用 `uni.redirectTo`，目的是避免页面栈堆积。
- 大多数页面设置了 `navigationStyle: custom`，说明页面头部通常由自定义组件自行实现。

因此新增页面时：

- 必须同步登记到 `src/pages.json`。
- 如果是“底部主页面”，要同时检查对应 `tabBer/*.vue` 是否需要加入口。
- 如果只是普通详情页，继续沿用 `uni.navigateTo` 即可。
- 不要贸然改成原生 `tabBar`，这会影响当前整套导航结构。

## 6. UI 组件与 easycom 约定

当前仓库明显依赖 `uni-ui`，项目里大量使用 `uni-icons`。

`src/pages.json` 中还配置了 easycom 映射：

- `uni-*` -> `@dcloudio/uni-ui`
- `wd-*` -> `@wot-ui/ui`
- `z-paging*` -> `z-paging`
- `fg-*` -> 本地 `components/fg-*`

但要注意：

- `package.json` 里当前只明确安装了 `@dcloudio/uni-ui`。
- 没看到 `@wot-ui/ui` 和 `z-paging` 出现在现有依赖里。
- 所以如果要使用 `wd-*` 或 `z-paging` 组件，先核对依赖是否真实存在，不要只因为 easycom 映射在就直接开写。

## 7. 样式与布局约定

这个项目有较明显的视觉与布局习惯：

- 页面外层常用 `.page-wrap`。
- 许多页面直接把内容宽度固定为 `750rpx`。
- 底部有自定义 tab 时，页面通常会预留 `padding-bottom: 120rpx` 左右的空间。
- 颜色倾向蓝色系业务风格，头图使用 `src/static/header/1.png`、`src/static/header/2.png`。
- 头部一般复用 `AppHeader`，不要无故重做另一套导航条。

修改样式时优先遵守这些原则：

- 先复用现有 `header`、`tabBer`、`btmBtn` 组件。
- 保持 `rpx` 为主的尺寸体系，不要局部突然切成纯 `px` 布局。
- 不要使用 `gap` 属性，`gap` 在部分机型上存在兼容性/适配问题，间距优先使用 `margin` / `padding` 处理。
- 保持三端角色页面的风格连续性，尤其是卡片、标签、统计块和底部操作区。

## 8. 命名与文件组织建议

这个仓库已经存在一批既有命名，新增代码时优先“贴着现有命名方式走”：

- 页面文件普遍使用小驼峰命名，如 `sendOrder.vue`、`serviceCenter.vue`、`orderDetail.vue`。
- 组件文件也以现有命名为准，不要为了“统一”顺手批量重命名旧文件。
- 页面跳转路径必须与 `src/pages.json` 完全一致，哪怕现有路径名里有历史拼写问题，也不要擅自修正。
- 新增 API 模块时，按业务域拆分到 `src/api/` 下，不要把不同角色、不同业务线的接口混在一个超大文件里。
- 如果只是单页局部逻辑，优先留在页面内部；只有当多页复用已经明确出现时，再考虑抽离组件或工具函数。

特别注意：

- 当前项目存在历史命名如 `tabBer`、`invoceManagement`、`withDrawal`，这些名字不够标准，但已经被页面引用或路由注册。
- 除非任务就是“统一重命名并全量修复引用”，否则不要主动修这些命名，以免引入跳转或引用错误。

## 9. uni-app / H5 已知坑

这是本项目必须特别遵守的约束：

- 不要给 `input`、`textarea` 设置 `box-sizing: border-box`。
- 这个限制既包括全局样式，也包括局部类名、单页样式和内联样式。
- 在 uni-app 的 H5 端，这会导致输入框无法聚焦或无法正常输入。

另外还要注意：

- 页面里已经混用了 `view` / `text` 和少量 `div` / `span`，新增代码时优先延续当前文件已有写法，不要在同一次改动里大面积清洗标签体系。
- 底部安全区适配目前主要通过 `globalDataMixin` 和自定义 tabbar 的 spacer 处理，修改 tabbar 高度时要一并检查安全区留白。

## 10. 接口层与鉴权约定

统一请求封装在 `src/api/config/request.js`，这是后续接接口的首选入口。

当前约定：

- 基础地址定义在 `src/api/config/config.js`。
- `token` 存储键名就是 `token`。
- 鉴权失败会清理本地 `token`，并跳回 `/pages/index`。
- `Request` 已封装 `get/post/put/delete/uploadImage`。
- `POST` 默认走表单头，非 POST 默认走 JSON 头，改接口前先确认后端要求。

智能体新增接口代码时建议：

- 不要在页面里直接复制粘贴 `uni.request`。
- 优先基于现有 `request.js` 增加业务 API 模块。
- 不要随意改动 `token` 失效后的跳转逻辑，除非任务明确要求。
- `src/api/config/config.js` 里当前是局域网地址，属于环境敏感项；不要在无明确要求时把它改成另一台机器的地址并提交。

## 11. 修改策略与协作边界

任意智能体在这个仓库里都应优先遵守“小改动、就近改、少抽象”原则：

- 先理解目标页面和关联组件，再动手改，不要看见相似页面就直接复制整页覆盖。
- 如果用户只要求修一个 bug，就不要顺手做大规模重构、换风格、换目录结构。
- 如果发现多个页面有相同问题，先判断是不是同一组件或同一 mixin 引起，再决定修公共层还是局部修复。
- 能在原文件中补齐逻辑，就不要急着新增一层 hooks、composables、store 或 util 抽象。
- 涉及用户已修改的文件时，要在原有基础上兼容式修改，不要为了省事回退或覆盖现有改动。

优先复用的现有能力：

- 头部：`src/components/header.vue`
- 底部导航：`src/components/tabBer/*.vue`
- 按钮：`src/components/button/btmBtn.vue`
- 安全区数据：`src/mixins/globalData.js`、`src/mixins/safeArea.js`
- 分享逻辑：`src/mixins/share.js`
- 请求封装：`src/api/config/request.js`

## 12. 业务认知

从页面结构看，当前业务大致是“运维派单/接单平台”：

- 客户端：报修、订单管理、发票、地址、客服。
- 工程师端：认证、接单大厅、订单执行、服务案例、钱包、技能标签。
- 服务商端：工作台、派工、工程师管理、公司审核。

很多页面当前仍是演示数据或半静态交互，因此：

- 如果用户要求“接接口”，不要默认整仓都已联调完成。
- 如果用户要求“修 bug”，先确认问题发生在静态交互层、导航层还是接口层。

## 13. 智能体改动建议

在这个仓库里工作时，优先遵循下面的做法：

- 先读目标页面及其关联组件，再下手改。
- 小步修改，避免一次性重构整个角色端。
- 优先复用本仓库已有组件、配色和交互结构。
- 修改页面跳转时，同时核对 `src/pages.json` 中是否已注册目标页面。
- 修改底部导航页时，检查是否需要补 `padding-bottom` 和安全区占位。
- 接口改动优先放进 `src/api/`，不要散落在页面里，根据业务模块可以新建 js 文件。
- 如果只是补数据展示或简单交互，优先留在页面本地状态，别过度抽象。

## 14. 验证与回归建议

这个仓库暂时没有现成的 lint / test 流程，因此验证主要依赖运行和人工回归：

- 页面或交互改动后，优先尝试 `pnpm dev` 进行 H5 自测。
- 如果改动涉及微信小程序特性，再考虑使用 `pnpm dev:mp-weixin` 做针对性验证。
- 至少检查目标页面能否进入、返回、跳转到相关详情页。
- 涉及搜索、筛选、弹窗、表单输入、底部按钮时，要实际走一遍关键交互。
- 改动公共组件后，要抽查至少一个客户端页、一个工程师端页、一个服务商端页，避免三端表现不一致。

如果无法本地启动或当前任务不适合运行，也应至少做静态自查：

- 新增页面是否已写入 `src/pages.json`。
- 新增组件引用路径是否正确，别只写了 easycom 名称却没有真实依赖。
- 页面底部是否被 tabbar 挡住。
- 输入框样式是否触发了 H5 兼容性问题。
- 新增跳转路径是否和真实页面路径完全一致。

## 15. 提交前自查

如果智能体做了代码改动，至少做这些检查：

- 目标页面是否仍能正常进入。
- 相关跳转路径是否和 `src/pages.json` 一致。
- 自定义 header / tabbar 是否被遮挡，底部是否留白足够。
- 涉及输入框时，是否误加了 `box-sizing: border-box`。
- 新引入组件是否真的安装了依赖，而不是只有 easycom 映射。
- 如果接了鉴权接口，是否遵守现有 `token` 存储与失效处理逻辑。

## 16. 智能体速查清单

如果你是第一次进入这个仓库，优先按这个顺序理解：

1. 看 `package.json`，确认命令和依赖。
2. 看 `src/pages.json`，确认页面注册和 easycom 映射。
3. 看目标页面所在角色目录，再看它引用的 `header` / `tabBer` / `btmBtn`。
4. 如果涉及接口，再看 `src/api/config/request.js` 和 `src/api/config/config.js`。
5. 如果涉及安全区、头部遮挡、底部留白，再看 `src/mixins/globalData.js` 与相关 tabbar 组件。

做改动时记住：

- 先复用，再新增。
- 先局部修，再考虑抽公共层。
- 先保证路由和交互不坏，再考虑代码“更优雅”。
- 不要把这个项目当成标准后台管理模板或完整接口项目。

## 17. 不建议做的事

除非用户明确要求，否则不建议在这个仓库里主动做以下事情：

- 引入新的状态管理方案。
- 把自定义 tabbar 整体迁移为原生 `tabBar`。
- 重写全部页面为统一框架模板。
- 顺手替换全局配色或重做整站视觉。
- 随意改动 `src/api/config/config.js` 的基础地址。
- 给 `input` / `textarea` 加 `box-sizing: border-box`。

## 18. 一句话原则

这是一个以 `src/pages` 三角色业务页为核心、以自定义头部和自定义底部导航为主的 uni-app 项目。任何改动都应优先服从现有页面结构、路由组织、组件复用方式和 uni-app/H5 的兼容性边界。

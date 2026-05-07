(function () {
  const uiStore = window.ChangLouStore.createPageStore("console", {
    tab: "dashboard",
    severityFilter: "all",
    statusFilter: "all",
    selectedEventId: "EVT-1024"
  });

  const elements = {
    navButtons: Array.from(document.querySelectorAll("[data-console-tab]")),
    reset: document.getElementById("console-reset"),
    toolbarCommunity: document.getElementById("toolbar-community"),
    toolbarFocus: document.getElementById("toolbar-focus"),
    toolbarRisk: document.getElementById("toolbar-risk"),
    toolbarActions: document.getElementById("toolbar-actions"),
    metrics: document.getElementById("dashboard-metrics"),
    buildings: document.getElementById("dashboard-buildings"),
    insights: document.getElementById("dashboard-insights"),
    actions: document.getElementById("dashboard-actions"),
    outcomes: document.getElementById("dashboard-outcomes"),
    eventList: document.getElementById("event-list"),
    eventDetail: document.getElementById("event-detail"),
    eventSidePanel: document.getElementById("event-side-panel"),
    severityFilter: document.getElementById("event-severity-filter"),
    statusFilter: document.getElementById("event-status-filter"),
    residentList: document.getElementById("resident-list"),
    residentStrategies: document.getElementById("resident-strategies"),
    storageSlots: document.getElementById("storage-slots"),
    storageTimeline: document.getElementById("storage-timeline"),
    rewardGrid: document.getElementById("reward-grid"),
    rewardReview: document.getElementById("reward-review"),
    governanceMetrics: document.getElementById("governance-metrics"),
    volunteerList: document.getElementById("volunteer-list"),
    cognitionList: document.getElementById("cognition-list"),
    volunteerTaskList: document.getElementById("volunteer-task-list"),
    buildingResultWall: document.getElementById("building-result-wall"),
    governancePlaybook: document.getElementById("governance-playbook"),
    pointsRuleList: document.getElementById("points-rule-list"),
    operationModules: document.getElementById("operation-modules"),
    tabs: Array.from(document.querySelectorAll(".console-tab"))
  };

  let pageData = null;

  bootstrap();

  async function bootstrap() {
    pageData = await window.ChangLouStore.loadConsolePageData();
    bindEvents();
    render();
    window.addEventListener("storage", handleStorageSync);
  }

  function bindEvents() {
    elements.navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        uiStore.set({ tab: button.dataset.consoleTab });
        renderTabs();
      });
    });

    elements.severityFilter.addEventListener("change", () => {
      uiStore.set({ severityFilter: elements.severityFilter.value });
      renderEvents();
    });

    elements.statusFilter.addEventListener("change", () => {
      uiStore.set({ statusFilter: elements.statusFilter.value });
      renderEvents();
    });

    elements.reset.addEventListener("click", () => {
      window.ChangLouStore.resetSharedState();
      render();
    });
  }

  function handleStorageSync(event) {
    if (event.key !== window.ChangLouStore.SHARED_KEY) {
      return;
    }
    render();
  }

  function render() {
    renderToolbar();
    renderTabs();
    renderDashboard();
    renderEvents();
    renderResidents();
    renderStorage();
    renderRewards();
    renderGovernance();
    renderOperations();
  }

  function renderToolbar() {
    const shared = window.ChangLouStore.getSharedState();
    const redCount = shared.incidents.filter((item) => item.severity === "red" && item.status !== "completed").length;
    const blockedCount = shared.incidents.filter((item) => item.status === "pending").length;
    const openTasks = shared.volunteerTasks.filter((item) => item.status === "open").length;
    const topBuilding = pageData.buildings[0];

    elements.toolbarCommunity.innerHTML = `
      <p class="eyebrow">当前项目</p>
      <h3>${shared.meta.communityName}</h3>
      <p>${shared.meta.sprintLabel}</p>
    `;

    elements.toolbarFocus.innerHTML = `
      <p class="eyebrow">今日重点</p>
      <h3>${topBuilding.name}</h3>
      <p>${topBuilding.focus} · ${topBuilding.note}</p>
    `;

    elements.toolbarRisk.innerHTML = `
      <p class="eyebrow">风险状态</p>
      <h3>${redCount ? `${redCount} 个红色风险待推进` : "红色风险已清空"}</h3>
      <p>待处理工单 ${blockedCount} 个 · 开放志愿任务 ${openTasks} 个</p>
    `;

    elements.toolbarActions.innerHTML = `
      <p class="eyebrow">快捷动作</p>
      <div class="toolbar-chip-row">
        <span class="tag tag-strong">发提醒</span>
        <span class="tag">派周转位</span>
        <span class="tag">建协助单</span>
      </div>
    `;
  }

  function renderTabs() {
    const tab = uiStore.get().tab;
    elements.navButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.consoleTab === tab);
    });
    elements.tabs.forEach((panel) => {
      panel.classList.toggle("is-visible", panel.id === `console-${tab}`);
    });
  }

  function renderDashboard() {
    const shared = window.ChangLouStore.getSharedState();
    const severityCounts = countBySeverity(shared.incidents);
    const processingCount = shared.incidents.filter((item) => item.status === "in_progress").length;
    const closedCount = shared.incidents.filter((item) => item.status === "completed").length;
    const responseRate = Math.round(
      (shared.incidents.filter((item) => item.status !== "pending").length / shared.incidents.length) * 100
    );
    const volunteerRunning = shared.volunteerTasks.filter((item) => item.status === "claimed").length;
    const metrics = [
      { title: "总事件", value: shared.incidents.length, note: `${shared.meta.communityName} 当前样本池` },
      { title: "红色风险", value: severityCounts.red, note: "优先推 24h 闭环" },
      { title: "黄色风险", value: severityCounts.yellow, note: "重点看履约和提醒" },
      { title: "处理中", value: processingCount, note: "含预约、协助与周转位" },
      { title: "闭环率", value: `${Math.round((closedCount / shared.incidents.length) * 100)}%`, note: `响应率 ${responseRate}%` },
      { title: "志愿执行中", value: volunteerRunning, note: "等待确认完成与沉淀成果" }
    ];

    elements.metrics.innerHTML = metrics.map(renderMetricTile).join("");
    elements.buildings.innerHTML = pageData.buildings.map(renderBuildingItem).join("");
    elements.insights.innerHTML = pageData.insights.map(renderTimelineItem).join("");
    elements.actions.innerHTML = buildDashboardActions(shared).map(renderActionItem).join("");
    elements.outcomes.innerHTML = pageData.outcomes.map(renderInsightItem).join("");
  }

  function renderEvents() {
    const shared = window.ChangLouStore.getSharedState();
    const ui = uiStore.get();
    elements.severityFilter.value = ui.severityFilter;
    elements.statusFilter.value = ui.statusFilter;

    const filtered = shared.incidents.filter((incident) => {
      const severityMatch = ui.severityFilter === "all" || incident.severity === ui.severityFilter;
      const statusMatch = ui.statusFilter === "all" || incident.status === ui.statusFilter;
      return severityMatch && statusMatch;
    });

    let selectedId = ui.selectedEventId;
    if (!filtered.some((incident) => incident.id === selectedId)) {
      selectedId = filtered[0] ? filtered[0].id : "";
      uiStore.set({ selectedEventId: selectedId });
    }

    elements.eventList.innerHTML = filtered.length
      ? filtered.map((incident) => renderEventListItem(incident, incident.id === selectedId)).join("")
      : '<div class="empty-state">当前筛选条件下没有事件。</div>';

    elements.eventList.querySelectorAll("[data-event-id]").forEach((button) => {
      button.addEventListener("click", () => {
        uiStore.set({ selectedEventId: button.dataset.eventId });
        renderEvents();
      });
    });

    const incident = filtered.find((item) => item.id === selectedId) || null;
    renderEventWorkbench(incident, shared);
  }

  function renderEventWorkbench(incident, shared) {
    if (!incident) {
      elements.eventDetail.innerHTML = '<div class="empty-state">请选择左侧事件查看详情。</div>';
      elements.eventSidePanel.innerHTML = '<div class="empty-state">当前没有可执行动作。</div>';
      return;
    }

    const resident = shared.residents.find((item) => item.id === incident.residentId);
    const level = resident ? window.ChangLouStore.getLevelSnapshot(resident) : null;
    const account = resident ? window.ChangLouStore.getResidentAccountState(resident) : null;
    const selectedPathMap = {
      storage: "申请周转位",
      recycle: "预约回收",
      cleanup: "预约清运",
      self_clear: "自行处理"
    };

    elements.eventDetail.innerHTML = `
      <div class="section-heading">
        <div>
          <p class="kicker">工单详情</p>
          <h2>${incident.title}</h2>
        </div>
        ${window.ChangLouStore.renderSeverityPill(incident.severity)}
      </div>
      <div class="detail-block">
        <div class="detail-grid">
          <div><div class="helper-text">位置</div><div class="detail-value">${incident.building}</div></div>
          <div><div class="helper-text">住户</div><div class="detail-value">${incident.residentName}</div></div>
          <div><div class="helper-text">当前阶段</div><div class="detail-value">${incident.currentStage}</div></div>
          <div><div class="helper-text">处理时效</div><div class="detail-value">${incident.deadlineText}</div></div>
        </div>
      </div>
      <div class="detail-block">
        <p class="kicker">当前路径</p>
        <div class="profile-inline-card">
          <div class="row-between">
            <strong>${selectedPathMap[incident.selectedPath] || "暂未选择"}</strong>
            ${window.ChangLouStore.renderStatusTag(incident.status)}
          </div>
          <p class="helper-text">${incident.recommendation}</p>
        </div>
      </div>
      <div class="detail-block">
        <p class="kicker">时间线</p>
        <div class="timeline-list">${incident.timeline.map(renderTimelineItem).join("")}</div>
      </div>
    `;

    elements.eventSidePanel.innerHTML = `
      <div class="event-action-stack">
        <div class="section-heading">
          <div>
            <p class="kicker">下一步动作</p>
            <h2>现在就推进</h2>
          </div>
        </div>
        <div class="action-column">
          ${incident.consoleActions
            .map(
              (action) =>
                `<button class="action-button action-button-wide" data-console-action="${action.id}" type="button">${action.label}</button>`
            )
            .join("")}
        </div>
      </div>

      <div class="event-side-section">
        <p class="kicker">住户画像</p>
        <article class="profile-inline-card">
          <div class="row-between">
            <strong>${resident ? resident.identity : "未命中档案"}</strong>
            <span class="tag">${level ? level.title : "无等级"}</span>
          </div>
          <p class="helper-text">${resident ? resident.challenge : "暂无更多住户信息"}</p>
          <div class="tag-row">
            ${(resident ? resident.tags : []).map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
        </article>
      </div>

      <div class="event-side-section">
        <p class="kicker">账户状态</p>
        <article class="profile-inline-card">
          ${
            account
              ? `
                <div class="inline-metric-row">
                  <span class="inline-metric">住户已到账 ${account.resident.available}</span>
                  <span class="inline-metric">住户待到账 ${account.resident.pending}</span>
                </div>
                <div class="inline-metric-row">
                  <span class="inline-metric">贡献已到账 ${account.volunteer.available}</span>
                  <span class="inline-metric">贡献待到账 ${account.volunteer.pending}</span>
                </div>
                <div class="timeline-list" style="margin-top:12px;">
                  ${[
                    `已到账 ${account.creditedEntries.length} 条`,
                    `待到账 ${account.pendingEntries.length} 条`,
                    `已使用 ${account.usedEntries.length} 条`,
                    `已解锁 ${account.unlockedEntries.length} 条`
                  ]
                    .map(renderTimelineItem)
                    .join("")}
                </div>
              `
              : '<p class="helper-text">暂无住户账户信息</p>'
          }
        </article>
      </div>

      <div class="event-side-section">
        <p class="kicker">奖励建议</p>
        <article class="profile-inline-card">
          <strong>${incident.rewardSuggestion}</strong>
          <p class="helper-text">
            ${account ? `当前可用权益 ${account.availableBenefits.length} 项，待到账账目 ${account.pendingEntries.length} 条。` : "把奖励讲成“处理后能得到什么”，比单纯讲规则更容易推进。"}
          </p>
        </article>
      </div>
    `;

    elements.eventSidePanel.querySelectorAll("[data-console-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextState = window.ChangLouStore.applyConsoleAction(incident.id, button.dataset.consoleAction);
        window.ChangLouStore.setSharedState(nextState);
        render();
      });
    });
  }

  function renderResidents() {
    const shared = window.ChangLouStore.getSharedState();
    elements.residentList.innerHTML = shared.residents
      .map((resident) => {
        const level = window.ChangLouStore.getLevelSnapshot(resident);
        const account = window.ChangLouStore.getResidentAccountState(resident);
        return `
          <article class="resident-item resident-item-rich">
            <div class="row-between">
              <h3>${resident.name}</h3>
              <span class="tag">${resident.room}</span>
            </div>
            <p class="helper-text">${resident.profile}</p>
            <div class="tag-row">${resident.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
            <p class="helper-text">当前难点：${resident.challenge}</p>
            <div class="inline-metric-row">
              <span class="inline-metric">住户积分 ${account.resident.available}</span>
              <span class="inline-metric">贡献积分 ${account.volunteer.available}</span>
              <span class="inline-metric">${level.title}</span>
            </div>
            <div class="inline-metric-row">
              <span class="inline-metric">待到账 ${account.pendingEntries.length}</span>
              <span class="inline-metric">已使用 ${account.usedEntries.length}</span>
              <span class="inline-metric">已解锁 ${account.unlockedEntries.length}</span>
            </div>
          </article>
        `;
      })
      .join("");

    elements.residentStrategies.innerHTML = shared.residents
      .map((resident) => {
        const level = window.ChangLouStore.getLevelSnapshot(resident);
        return `
          <article class="strategy-item strategy-item-rich">
            <div class="row-between">
              <h3>${resident.name}</h3>
              <span class="tag">${level.title}</span>
            </div>
            <p class="helper-text">${resident.rewardSummary}</p>
            <div class="timeline-list" style="margin-top:12px;">
              ${resident.recommendedStrategy.map(renderTimelineItem).join("")}
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderStorage() {
    const shared = window.ChangLouStore.getSharedState();
    elements.storageSlots.innerHTML = shared.storageSlots
      .map((slot) => {
        const pillClass =
          slot.status === "occupied" ? "pill-yellow" : slot.status === "available" ? "pill-green" : "pill-blue";
        const statusText =
          slot.status === "occupied" ? "已占用" : slot.status === "available" ? "空位可分配" : "整理中";
        return `
          <article class="slot-item">
            <div class="row-between">
              <h3>${slot.name}</h3>
              <span class="pill ${pillClass}">${statusText}</span>
            </div>
            <p class="helper-text">${slot.area}</p>
            <p class="helper-text">${slot.residentLabel}</p>
            <p class="helper-text">${slot.deadlineText}</p>
          </article>
        `;
      })
      .join("");

    elements.storageTimeline.innerHTML = shared.storageSlots
      .filter((slot) => slot.status !== "available")
      .map((slot) => `${slot.name} · ${slot.residentLabel} · ${slot.deadlineText}`)
      .map(renderTimelineItem)
      .join("");
  }

  function renderRewards() {
    const shared = window.ChangLouStore.getSharedState();
    elements.rewardGrid.innerHTML = shared.rewards.map(renderRewardItem).join("");
    elements.rewardReview.innerHTML = pageData.rewardReview.map(renderTimelineItem).join("");
  }

  function renderGovernance() {
    const shared = window.ChangLouStore.getSharedState();
    const openTasks = shared.volunteerTasks.filter((item) => item.status === "open").length;
    const claimedTasks = shared.volunteerTasks.filter((item) => item.status === "claimed").length;
    const completedTasks = shared.volunteerTasks.filter((item) => item.status === "completed").length;
    const activeResidents = shared.residents.filter(
      (resident) => window.ChangLouStore.getResidentAccountState(resident).volunteer.available > 0
    ).length;
    const totalVolunteerPoints = shared.residents.reduce(
      (sum, resident) => sum + window.ChangLouStore.getResidentAccountState(resident).volunteer.available,
      0
    );
    const residentActionRate = Math.round(
      (shared.incidents.filter((item) => item.selectedPath).length / shared.incidents.length) * 100
    );

    elements.governanceMetrics.innerHTML = [
      { title: "任务总量", value: shared.volunteerTasks.length, note: "轻任务、协助任务、组织任务并存" },
      { title: "开放报名", value: openTasks, note: "客户端任务大厅可直接看到" },
      { title: "执行中", value: claimedTasks, note: "等待中台确认完成" },
      { title: "已完成", value: completedTasks, note: "会回流成果卡和等级反馈" },
      { title: "活跃志愿者", value: activeResidents, note: "贡献积分大于 0 的住户" },
      { title: "住户主动选择率", value: `${residentActionRate}%`, note: `贡献积分累计 ${totalVolunteerPoints}` }
    ]
      .map(renderMetricTile)
      .join("");

    elements.volunteerTaskList.innerHTML = shared.volunteerTasks.map(renderTaskCard).join("");
    elements.volunteerTaskList.querySelectorAll("[data-task-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextState = window.ChangLouStore.applyVolunteerTaskAction(
          button.dataset.taskId,
          button.dataset.taskAction
        );
        window.ChangLouStore.setSharedState(nextState);
        render();
      });
    });

    elements.buildingResultWall.innerHTML = shared.buildingResults.map(renderResultCard).join("");

    elements.volunteerList.innerHTML = shared.residents
      .filter((resident) => {
        const account = window.ChangLouStore.getResidentAccountState(resident);
        return account.volunteer.available > 0 || resident.tags.includes("可参与志愿");
      })
      .map((resident) => {
        const account = window.ChangLouStore.getResidentAccountState(resident);
        const level = window.ChangLouStore.getLevelSnapshot(resident);
        const rank =
          account.volunteer.available >= 60 ? "高完成率" : account.volunteer.available >= 30 ? "稳定参与" : "可培养";
        return `
          <article class="volunteer-card volunteer-card-rich">
            <div class="row-between">
              <h3>${resident.name}</h3>
              <span class="tag">${rank}</span>
            </div>
            <p class="helper-text">${resident.profile}</p>
            <div class="inline-metric-row">
              <span class="inline-metric">住户积分 ${account.resident.available}</span>
              <span class="inline-metric">贡献积分 ${account.volunteer.available}</span>
              <span class="inline-metric">${level.title}</span>
            </div>
            <div class="tag-row">${account.unlockedBadges.map((badge) => `<span class="tag">${badge.title}</span>`).join("")}</div>
            <p class="helper-text">优先适配：${resident.recommendedStrategy[0]}</p>
          </article>
        `;
      })
      .join("");

    elements.governancePlaybook.innerHTML = pageData.governancePlaybook
      .map(
        (item) => `
          <article class="playbook-item">
            <h3>${item.title}</h3>
            <p class="helper-text">${item.note}</p>
          </article>
        `
      )
      .join("");

    elements.cognitionList.innerHTML = [...shared.cognitionCards, ...pageData.governanceInsights.map(toCardFromText)]
      .map(renderCognitionCard)
      .join("");

    elements.pointsRuleList.innerHTML = buildPointsOperations(shared);
  }

  function renderOperations() {
    elements.operationModules.innerHTML = pageData.operationModules
      .map(
        (item) => `
          <article class="module-item">
            <p class="kicker">${item.kicker}</p>
            <h3>${item.title}</h3>
            <p class="helper-text">${item.note}</p>
          </article>
        `
      )
      .join("");
  }

  function buildDashboardActions(shared) {
    const redIncident = shared.incidents.find((item) => item.severity === "red" && item.status !== "completed");
    const pendingTasks = shared.volunteerTasks.filter((item) => item.status === "draft").length;
    const blockedIncident = shared.incidents.find((item) => item.status === "pending");
    return [
      {
        title: "优先推进红色风险",
        note: redIncident
          ? `${redIncident.residentName} 的事件仍需跟进，建议优先安排周转位与家属代办。`
          : "当前没有待推进的红色风险事件。"
      },
      {
        title: "清掉最卡的待办",
        note: blockedIncident
          ? `${blockedIncident.residentName} 还没有选路径，先把“住户愿不愿意动起来”解决。`
          : "当前所有事件都已进入推进或闭环阶段。"
      },
      {
        title: "发布草稿任务",
        note: pendingTasks
          ? `还有 ${pendingTasks} 个草稿任务未发布，发布后客户端任务大厅会同步出现。`
          : "当前没有待发布的草稿任务。"
      }
    ];
  }

  function buildPointsOperations(shared) {
    const totals = shared.residents.reduce(
      (summary, resident) => {
        const account = window.ChangLouStore.getResidentAccountState(resident);
        summary.residentCredited += account.resident.available;
        summary.residentPending += account.resident.pending;
        summary.volunteerCredited += account.volunteer.available;
        summary.volunteerPending += account.volunteer.pending;
        summary.creditedEntries += account.creditedEntries.length;
        summary.pendingEntries += account.pendingEntries.length;
        summary.usedEntries += account.usedEntries.length;
        summary.unlockedEntries += account.unlockedEntries.length;
        summary.availableBenefits += account.availableBenefits.length;
        summary.usedBenefits += account.usedBenefits.length;
        summary.unlockedBadges += account.unlockedBadges.length;
        summary.unlockedLevels += account.unlockedLevels.length;
        return summary;
      },
      {
        residentCredited: 0,
        residentPending: 0,
        volunteerCredited: 0,
        volunteerPending: 0,
        creditedEntries: 0,
        pendingEntries: 0,
        usedEntries: 0,
        unlockedEntries: 0,
        availableBenefits: 0,
        usedBenefits: 0,
        unlockedBadges: 0,
        unlockedLevels: 0
      }
    );

    return [
      {
        title: "住户积分账户",
        body: shared.pointsRules.resident,
        foot: "强调主动处理、自助预约和配合闭环。"
      },
      {
        title: "贡献积分账户",
        body: shared.pointsRules.volunteer,
        foot: "强调帮助他人、协助执行和楼栋组织。"
      },
      {
        title: "账户状态",
        body: [
          `已到账：${totals.creditedEntries} 条账目，住户积分 ${totals.residentCredited} 分，贡献积分 ${totals.volunteerCredited} 分`,
          `待到账：${totals.pendingEntries} 条账目，住户积分 ${totals.residentPending} 分，贡献积分 ${totals.volunteerPending} 分`,
          `已使用：权益与券包 ${totals.usedBenefits} 项`,
          `已解锁：徽章 ${totals.unlockedBadges} 枚，等级 ${totals.unlockedLevels} 次，可用权益 ${totals.availableBenefits} 项`
        ],
        foot: "中台与客户端共用同一套账本状态，不再靠文案和正则去猜。"
      }
    ]
      .map(
        (group) => `
          <article class="rule-card rule-card-rich">
            <h3>${group.title}</h3>
            <div class="timeline-list" style="margin-top:12px;">
              ${group.body.map(renderTimelineItem).join("")}
            </div>
            <p class="helper-text">${group.foot}</p>
          </article>
        `
      )
      .join("");
  }

  function countBySeverity(incidents) {
    return incidents.reduce(
      (acc, incident) => {
        acc[incident.severity] += 1;
        return acc;
      },
      { red: 0, yellow: 0, blue: 0 }
    );
  }

  function renderMetricTile(item) {
    return `
      <article class="metric-tile">
        <h3>${item.title}</h3>
        <p class="metric-value">${item.value}</p>
        <p class="metric-note">${item.note}</p>
      </article>
    `;
  }

  function renderBuildingItem(item) {
    return `
      <article class="building-item">
        <div class="building-head">
          <h3>${item.name}</h3>
          <strong>${item.score}</strong>
        </div>
        <div class="tag-row">
          <span class="tag">${item.focus}</span>
        </div>
        <p class="helper-text">${item.note}</p>
        <div class="building-bar"><span style="width:${item.score}%"></span></div>
      </article>
    `;
  }

  function renderActionItem(item) {
    return `
      <article class="action-item action-item-rich">
        <h3>${item.title}</h3>
        <p class="helper-text">${item.note}</p>
      </article>
    `;
  }

  function renderInsightItem(item) {
    return `
      <article class="insight-item">
        <h3>${item.title}</h3>
        <p class="helper-text">${item.note}</p>
      </article>
    `;
  }

  function renderTimelineItem(text) {
    return `<article class="timeline-item"><p>${text}</p></article>`;
  }

  function renderRewardItem(item) {
    return `
      <article class="reward-item reward-item-rich">
        <h3>${item.title}</h3>
        <p class="helper-text">${item.note}</p>
        <p class="metric-value reward-metric">${item.stat}</p>
        <p class="helper-text">${item.impact}</p>
      </article>
    `;
  }

  function renderTaskCard(task) {
    const statusClass =
      task.status === "completed" ? "is-completed" : task.status === "claimed" ? "is-claimed" : "";
    const statusText =
      task.status === "draft" ? "待发布" : task.status === "open" ? "开放报名" : task.status === "claimed" ? "执行中" : "已完成";
    const actionButton =
      task.status === "draft"
        ? `<button class="primary-button" data-task-id="${task.id}" data-task-action="publish" type="button">发布任务</button>`
        : task.status === "claimed"
        ? `<button class="primary-button" data-task-id="${task.id}" data-task-action="complete" type="button">确认完成</button>`
        : `<span class="tag">${statusText}</span>`;

    return `
      <article class="task-card ${statusClass}">
        <div class="row-between">
          <h3>${task.title}</h3>
          <span class="pill ${
            task.status === "completed" ? "pill-green" : task.status === "claimed" ? "pill-blue" : "pill-navy"
          }">${statusText}</span>
        </div>
        <div class="tag-row">
          <span class="tag">${task.type}</span>
          <span class="tag">${task.duration}</span>
          <span class="tag">+${task.rewardPoints} 贡献积分</span>
        </div>
        <div class="task-meta-list">
          <article class="timeline-item"><p>服务对象：${task.targetResidentName}</p></article>
          <article class="timeline-item"><p>所在楼栋：${task.building}</p></article>
          <article class="timeline-item"><p>完成标准：${task.criteria}</p></article>
          <article class="timeline-item"><p>当前说明：${task.note}</p></article>
          ${task.assigneeName ? `<article class="timeline-item"><p>当前志愿者：${task.assigneeName}</p></article>` : ""}
        </div>
        ${actionButton}
      </article>
    `;
  }

  function renderResultCard(item) {
    return `
      <article class="result-card result-card-rich">
        <div class="row-between">
          <h3>${item.title}</h3>
          <span class="tag">${item.metric}</span>
        </div>
        <p class="helper-text">${item.summary}</p>
        <div class="tag-row">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        <p class="helper-text">更新：${item.updatedAt} · 来源：${item.owner}</p>
      </article>
    `;
  }

  function renderCognitionCard(item) {
    return `
      <article class="cognition-card">
        <div class="row-between">
          <h3>${item.title}</h3>
          <span class="tag">${item.owner}</span>
        </div>
        <p class="helper-text">${item.body}</p>
        <p class="cognition-metric">${item.metric}</p>
      </article>
    `;
  }

  function renderEventListItem(incident, active) {
    return `
      <button class="event-item event-item-rich ${active ? "is-active" : ""}" data-event-id="${incident.id}" type="button">
        <div class="event-head">
          <h3>${incident.title}</h3>
          ${window.ChangLouStore.renderSeverityPill(incident.severity)}
        </div>
        <p class="event-meta">${incident.building} · ${incident.room} · ${incident.residentName}</p>
        <p class="helper-text">${incident.currentStage}</p>
        <div class="tag-row">
          ${window.ChangLouStore.renderStatusTag(incident.status)}
          <span class="tag">${incident.source}</span>
        </div>
      </button>
    `;
  }

  function toCardFromText(text) {
    return {
      title: "运营原则",
      body: text,
      metric: "叙事规范",
      owner: "运营策略"
    };
  }
})();

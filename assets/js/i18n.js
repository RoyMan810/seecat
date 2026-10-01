/* SEECAT — lightweight, dependency-free language switching. */
(function () {
  "use strict";

  const translations = {
    en: {
      "meta.title": "SEECAT — the cat that lives in your Seeker",
      "meta.description": "$SEECAT is the Solana Mobile mascot cat. Hold it in the wallet you already carry and collect $SKR — no staking screens, no lock-ups, no homework.",
      "skip": "Skip to content", "brand.home": "SEECAT, home", "brand.top": "SEECAT, back to top",
      "nav.aria": "Main", "nav.how": "How it works", "nav.what": "What you get", "nav.community": "Community", "nav.chart": "Chart", "nav.buy": "Buy $SEECAT", "language.label": "Language", "menu.open": "Open menu", "menu.close": "Close menu",
      "hero.selfCustody": "Self-custody", "hero.lede": "<b>Solana Mobile Mascot Cat.</b> Showed up in a cap, pocketed a Seeker, and started handing out rewards. Hold $SEECAT in the wallet you already carry and collect $SKR — no staking screens, no lock-ups, no homework.",
      "hero.subhead.line1": "The cat that lives", "hero.subhead.line2": "in your <span class=\"gradient-text\">Seeker</span>.", "copy": "COPY", "copied": "COPIED", "select": "SELECT IT", "hero.buy": "Buy $SEECAT", "dot.rewards": "Rewards in $SKR", "dot.holders": "Straight to holders", "dot.stake": "Nothing to stake",
      "stats.rewardsPaid": "Rewards paid", "stats.holders": "Holders", "stats.supply": "Total supply", "stats.rewardToken": "Reward token",
      "how.eyebrow": "How it works", "how.title": "Three Cat Steps", "how.cta": "Start holding", "step.buy.title": "Buy $SEECAT", "step.buy.body": "Paste the contract into any Solana DEX or the wallet you already use, check it twice, swap.", "step.hold.title": "Hold the cat", "step.hold.body": "Leave him where he lands. Holding is the entire strategy and there is nothing to sign.", "step.collect.title": "Collect $SKR", "step.collect.body": "Rewards arrive on their own. Check the wallet, or don't — they land either way.",
      "what.eyebrow": "SEECAT token", "what.title": "What holding gets you.", "what.aside": "There is no protocol to understand here. A cat, a wallet you already own, and rewards that turn up by themselves.",
      "card.rewards.title": "Rewards in $SKR", "card.rewards.body": "A 3% transfer tax on every transfer of $SEECAT — on any venue — is paid out to holders in SKR, pro-rata. An approx 2.5% fee is deducted to cover the network costs of distributing and supporting operations. Tax collects until they are worth distributing, then go to wallets holding at least $20 of $SEECAT at that moment.", "card.solana.title": "Built on Solana", "card.solana.fast": "<b>Sub-second settlement.</b> Fees small enough to ignore entirely.", "card.solana.mobile": "<b>A mobile-first crowd.</b> Made for the people already carrying the phone.",
      "footer.aria": "Footer", "footer.buy": "Buy", "footer.chart": "Chart", "footer.community": "Community", "footer.legal": "$SEECAT is a community meme coin. It has no intrinsic value, no roadmap of promises, and no expectation of financial return. Not affiliated with, endorsed by, or connected to Solana Labs, Solana Mobile or Seeker. Crypto is risky — only bring what you can afford to lose, and always do your own research."
    },
    "zh-CN": {
      "meta.title": "SEECAT — 住在你的 Seeker 里的猫", "meta.description": "$SEECAT 是 Solana Mobile 的吉祥物猫。把它放在你已有的钱包里，领取 $SKR 奖励——无需质押页面、无需锁仓、无需做功课。",
      "skip": "跳至主要内容", "brand.home": "SEECAT，首页", "brand.top": "SEECAT，返回顶部", "nav.aria": "主导航", "nav.how": "运作方式", "nav.what": "持有所得", "nav.community": "社区", "nav.chart": "图表", "nav.buy": "购买 $SEECAT", "language.label": "语言", "menu.open": "打开菜单", "menu.close": "关闭菜单",
      "hero.selfCustody": "自托管", "hero.lede": "<b>Solana Mobile 吉祥物猫。</b>戴着帽子出现，带走了一台 Seeker，并开始发放奖励。将 $SEECAT 放在你已有的钱包中，即可领取 $SKR——无需质押页面、无需锁仓、无需做功课。", "hero.subhead.line1": "住在你的", "hero.subhead.line2": "<span class=\"gradient-text\">Seeker</span> 里的猫。", "copy": "复制", "copied": "已复制", "select": "请选择", "hero.buy": "购买 $SEECAT", "dot.rewards": "$SKR 奖励", "dot.holders": "直接发给持有人", "dot.stake": "无需质押",
      "stats.rewardsPaid": "已发放奖励", "stats.holders": "持有人", "stats.supply": "总供应量", "stats.rewardToken": "奖励代币",
      "how.eyebrow": "运作方式", "how.title": "猫咪三步走", "how.cta": "开始持有", "step.buy.title": "购买 $SEECAT", "step.buy.body": "将合约地址粘贴到任意 Solana DEX 或你常用的钱包中，仔细核对后完成兑换。", "step.hold.title": "持有这只猫", "step.hold.body": "让它待在原处。持有就是全部策略，无需签署任何内容。", "step.collect.title": "领取 $SKR", "step.collect.body": "奖励会自行到账。查看钱包也好、不看也行——它们都会到账。",
      "what.eyebrow": "SEECAT 代币", "what.title": "持有能获得什么。", "what.aside": "这里没有需要理解的协议。只需一只猫、你已有的钱包，以及自动到账的奖励。",
      "card.rewards.title": "$SKR 奖励", "card.rewards.body": "每次转移 $SEECAT（无论在哪个交易场所）收取的 3% 转账税，都会按持仓比例以 SKR 形式发放给持有人。约 2.5% 的费用会用于覆盖分发和运营支持的网络成本。税款累积至适合分发时，将发给当时持有至少 20 美元等值 $SEECAT 的钱包。", "card.solana.title": "构建于 Solana", "card.solana.fast": "<b>亚秒级结算。</b>手续费低到几乎可以忽略。", "card.solana.mobile": "<b>移动优先的社区。</b>为已经随身携带手机的人而生。",
      "footer.aria": "页脚导航", "footer.buy": "购买", "footer.chart": "图表", "footer.community": "社区", "footer.legal": "$SEECAT 是一枚社区迷因币。它没有内在价值、没有任何承诺的路线图，也不应被视为可带来财务回报。它与 Solana Labs、Solana Mobile 或 Seeker 没有隶属、背书或关联关系。加密资产有风险——仅投入你可以承受损失的金额，并始终自行研究。"
    }
  };

  const get = (language, key) => translations[language][key] || translations.en[key] || "";
  const applyLanguage = (language) => {
    const locale = translations[language] ? language : "en";
    document.documentElement.lang = locale;
    document.querySelectorAll("[data-i18n]").forEach((element) => { element.innerHTML = get(locale, element.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => { element.setAttribute("aria-label", get(locale, element.dataset.i18nAriaLabel)); });
    document.querySelectorAll("[data-i18n-content]").forEach((element) => { element.setAttribute("content", get(locale, element.dataset.i18nContent)); });
    document.querySelectorAll("[data-i18n-open-aria-label]").forEach((element) => {
      const key = element.getAttribute("aria-expanded") === "true" ? element.dataset.i18nCloseAriaLabel : element.dataset.i18nOpenAriaLabel;
      element.setAttribute("aria-label", get(locale, key));
    });
    window.seecatI18n = { language: locale, get: (key) => get(locale, key) };
    localStorage.setItem("seecat-language", locale);
  };

  const select = document.getElementById("language-select");
  const saved = localStorage.getItem("seecat-language");
  const browserLanguage = navigator.language && navigator.language.toLowerCase().startsWith("zh") ? "zh-CN" : "en";
  const initial = translations[saved] ? saved : browserLanguage;
  select.value = initial;
  applyLanguage(initial);
  select.addEventListener("change", () => applyLanguage(select.value));
})();

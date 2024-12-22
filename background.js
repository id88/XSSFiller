// background.js

// 创建右键菜单项
browser.contextMenus.create({
    id: "XSSFiller",
    title: "填充/清除XSS",
    contexts: ["all"]
});

// 监听右键菜单项的点击事件
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "XSSFiller") {
        // 向当前选项卡发送消息
        browser.tabs.sendMessage(tab.id, { action: "toggleXSS" });
    }
});

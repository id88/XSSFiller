// 获取单选按钮元素
let xssOption = document.getElementById("xss");
let sqlOption = document.getElementById("sql");

// 默认使用 XSS
let statusValue = 'xss';

xssOption.addEventListener("click", function() {
    console.log("XSS被选择");
    statusValue = 'xss';

    storageLocal(statusValue);
    // sendToContent(statusValue);
});

sqlOption.addEventListener("click", function() {
    console.log("SQL被选择");
    statusValue = 'sql';

    storageLocal(statusValue);
    // sendToContent(statusValue);
});


// 每次打开popup.html都需要查询 选择是是什么模式
browser.storage.local.get(['statusValue'], function (res) {
    if (browser.runtime.lastError) {
        console.error("获取状态值失败：", browser.runtime.lastError);
    } else {
        if (res.statusValue === 'xss') {
            console.log("选择的是XSS")
            // 将"XSS"单选按钮设为选中状态
            sqlOption.checked = false;
            xssOption.checked = true;
        } else {
            console.log("选择的是SQL")
            // 将"SQL"单选按钮设为选中状态
            xssOption.checked = false;
            sqlOption.checked = true;
        }
    }
});


function storageLocal(statusValue) {
    browser.storage.local.set({ statusValue }, function () {
        if (browser.runtime.lastError) {
            console.error("设置状态值失败：", browser.runtime.lastError);
        } else {
            console.log("已将状态值设置为：", statusValue);
        }
    });
}
// content.js

// 定义一个变量来跟踪当前的状态（填充或清空），并根据收到的消息执行相应的操作。
let isFilled = false;

// 监听来自 background.js 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleXSS") {
        if (isFilled) {
            clearInputs();
        } else {
            fillInputs();
        }
        isFilled = !isFilled;
    }
});

// 获取页面中所有输入框，包括 Shadow DOM 和 iframe
function getAllInputs() {
    const inputsTextarea = [];
    function collectInputs(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.shadowRoot) {
                node.shadowRoot.querySelectorAll('input[type="text"], textarea, select').forEach(input => {
                    inputsTextarea.push(input);
                });
            }
            node.querySelectorAll('input[type="text"], textarea, select').forEach(input => {
                inputsTextarea.push(input);
            });
            node.querySelectorAll('iframe').forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    collectInputs(iframeDoc.documentElement);
                } catch (e) {
                    console.error('无法访问iframe内容', e);
                }
            });
        }
        node.childNodes.forEach(child => collectInputs(child));
    }
    collectInputs(document.documentElement);
    return inputsTextarea;
}


// 生成3位随机字符串，字符包括大小写字母和数字
function generateRandomString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomStr = '';
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomStr += chars[randomIndex];
    }
    return randomStr;
}


// 填充所有文本输入框
function fillInputs() {
    const inputsTextarea = getAllInputs();
    console.log(`页面中共有 ${inputsTextarea.length} 个输入框`);
    inputsTextarea.forEach((input, index) => {
        // console.log(`输入框 ${index + 1}:`, input);
    });
    inputsTextarea.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = true; // 对于复选框和单选按钮，设置为选中状态
        } else if (input.tagName === 'SELECT') {
            input.selectedIndex = 1; // 对于下拉框，选择第二个选项
        } else {
            // 生成随机字符串，并将其插入到XSS脚本中
            const randomStr = generateRandomString();
            input.value = `<script>alert('${randomStr}');</script>`;
            // input.style.borderColor = 'red'; // 修改边框颜色为红色
        }
    });
}

// 清空所有文本输入框
function clearInputs() {
    const inputsTextarea = getAllInputs();
    inputsTextarea.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false; // 对于复选框和单选按钮，设置为未选中状态
        } else if (input.tagName === 'SELECT') {
            input.selectedIndex = -1; // 对于下拉框，取消选择
        } else {
            input.value = ""; // 其他类型的输入框，清空value值
        }
    });
}

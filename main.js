// 打开开发者模式的console,等到播放器成功载入后粘贴以下代码：

silent = true; // 默认静默，除非报错不弹出 alert
arr = window.location.href.split("id=");
const currentId = Number(arr[1]);

// 定义需要跳过的论坛页面 ID 列表，每一年可能不一样
// 请根据你当前课程的实际情况修改此列表，以确保跳过正确的非视频页面
const skipIds = [2089960, 2089977, 2089993, 2090010, 2090022];

// 生成随机播放时间（12分钟 ± 2分钟，即10到14分钟之间，单位秒）
const randomPlaybackTime = Math.floor(Math.random() * (14 * 60 - 10 * 60 + 1)) + 10 * 60;

var data = [{
    'index': 0,
    'methodname': 'mod_fsresource_set_time',
    'args': {
        'fsresourceid': playerdata.fsresourceid,
        'time': randomPlaybackTime,  // 使用随机生成的播放时长
        'finish': 1,    // 强制设置为已完成
        'progress': 100 // 进度强制设为100%
    }
}];

$.ajax({
    url: playerdata.siteUrl + "/lib/ajax/service.php?timestamp=" + new Date().getTime() + "&sesskey=" + playerdata.sesskey,
    method: 'POST',
    data: JSON.stringify(data),
    success: function(response) {
        console.log('强制完成请求成功', response);
        if (response[0] && response[0].data) {
            updateTableData(response[0].data);
        }

        let nextId = currentId + 1; // 默认下一个 ID

        // 检查计算出的 nextId 是否在 skipIds 列表中
        if (skipIds.includes(nextId)) {
            console.log(`检测到下一个 ID (${nextId}) 为论坛页面，正在跳过该页面。`);
            nextId += 1; // 如果下一个 ID 是论坛，则再加 1，跳过它
            if(!silent){alert(`下一个 ID (${nextId - 1}) 为论坛页面，已跳过，自动跳转至 ${nextId}。`);}
        } else {
            console.log(`下一个 ID 为 ${nextId}，正常跳转。`);
        }

        // 执行跳转
        window.location.replace(arr[0] + "id=" + nextId);
    },
    error: function(xhr, status, error) {
        console.error('请求失败', error);
        alert('强制完成请求失败，请检查控制台');
    }
});
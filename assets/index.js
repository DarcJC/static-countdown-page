'use strict';

function parseDate(date_text) {
    const d = new Date(date_text);
    if (d.getFullYear() === new Date("1/1").getUTCFullYear()) {
        d.setFullYear(new Date().getFullYear());
    }
    if (new Date() - d > 1000 * 60 * 60) d.setFullYear(new Date().getFullYear() + 1);
    return d;
}

const data = {};
const a = getQueryVariable("a");
const _default_load_config = () => {
    // loading data from url param
    data["title"] = getQueryVariable("t") ? getQueryVariable("t") : "Darc的倒计时";
    data["background"] = {
        blur: getQueryVariable("blur") ? parseInt(getQueryVariable("blur")) : 0,
        origin_type: getQueryVariable("origin_type") ? getQueryVariable("origin_type") : "picsum",
        grayscale: getQueryVariable("gray") ? Boolean(getQueryVariable("gray")) : false,
        img_url: getQueryVariable("img_url") ? getQueryVariable("img_url") : null,
    }
    data["header_text"] = getQueryVariable("header_text") ? getQueryVariable("header_text") : "一个奇怪的⏳";
    data["small_text"] = getQueryVariable("small_text") ? getQueryVariable("small_text") : "猜猜看怎么用?";
    data["date"] = getQueryVariable("date") ? parseDate(getQueryVariable("date")) : new Date();
}
if (a && _global_config.static_data[a]) {
    // loading data from _global_config
    Object.assign(data, _global_config.static_data[a]);
    data["date"] = parseDate(data["date"]);
} else {
    _default_load_config();
}
data["countdown_text"] = "";

const html = template("main_content", data);
document.getElementById("main_box").innerHTML = html;

setInterval(()=>{
    let res = Math.round((data["date"] - new Date()) / 1000);
    data["countdown_text"] = `${Math.round(3600 / 24 / res)} 天 ${Math.round(res/3600%24)} 时 ${Math.round(res/60%60)} 分 ${Math.round(res%60)} 秒`;
    document.getElementById("countdown_text").innerText = data["countdown_text"];
}, 1000);

getBackgroundImageFactory(data.background).setBackground("background");

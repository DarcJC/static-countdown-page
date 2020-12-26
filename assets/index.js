'use strict';

function parseDate(date_text) {
    const d = new Date(date_text);
    if (d.getFullYear() === new Date("1/1").getFullYear()) {
        d.setFullYear(new Date().getFullYear());
        if (d - new Date()  < 1000 * 60) d.setFullYear(new Date().getFullYear() + 1)
    }
    return d;
}

const animateCSS = (element, animation, prefix = 'animate__') => {
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element);

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd() {
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });
}

const _page_data = {};

document.addEventListener('readystatechange', (event) => {
    if (document.readyState === "complete") {
        const a = getQueryVariable("a");
        const _default_load_config = () => {
            // loading data from url param
            _page_data["title"] = getQueryVariable("t") ? getQueryVariable("t") : "Darc的倒计时";
            _page_data["background"] = {
                blur: getQueryVariable("blur") ? parseInt(getQueryVariable("blur")) : 0,
                origin_type: getQueryVariable("origin_type") ? getQueryVariable("origin_type") : "picsum",
                grayscale: getQueryVariable("gray") ? Boolean(getQueryVariable("gray")) : false,
                img_url: getQueryVariable("img_url") ? getQueryVariable("img_url") : null,
            }
            _page_data["header_text"] = getQueryVariable("header_text") ? getQueryVariable("header_text") : "一个奇怪的⏳";
            _page_data["small_text"] = getQueryVariable("small_text") ? getQueryVariable("small_text") : "猜猜看怎么用?";
            _page_data["date"] = getQueryVariable("date") ? parseDate(getQueryVariable("date")) : new Date();
        }
        if (a && _global_config.static_data[a]) {
            // loading data from _global_config
            Object.assign(_page_data, _global_config.static_data[a]);
            _page_data["date"] = parseDate(_page_data["date"]);
        } else {
            _default_load_config();
        }
        _page_data["countdown_text"] = "";

        document.getElementById("main_box").innerHTML = template("main_content", _page_data);

        setInterval(() => {
            let res = Math.round((_page_data["date"] - new Date()) / 1000);
            _page_data["countdown_text"] = `${Math.abs(Math.round(res / 3600 / 24 ))} 天 ${Math.abs(Math.round(res / 3600 % 24))} 时 ${Math.abs(Math.round(res / 60 % 60))} 分 ${Math.abs(Math.round(res % 60))} 秒`;
            const elem = document.getElementById("countdown_text");
            elem.innerText = _page_data["countdown_text"];
            setTimeout(()=>{
                animateCSS("#countdown_text", "rubberBand").then(console.log);
            });
        }, 1000);

        setInterval(() => {
            document.getElementById("title").innerText = (_page_data["title"]);
            document.getElementById("header_text").innerText = (_page_data["header_text"]);
            document.getElementById("small_text").innerText = (_page_data["small_text"]);
        }, 1000);


        getBackgroundImageFactory(_page_data.background).setBackground("background");
    }
});


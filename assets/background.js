'use strict';

if (!Object.hasOwnProperty("freeze")) Object.prototype["freeze"] = i => {
    return i
};  // polyfill

/**
 * 从url param获取参数
 * 不存在返回null
 * 复制自网络 不明作者(一堆转载)
 * @param variable
 * @returns {string|null}
 */
function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return null;
}

const BackgroundApiOriginType = Object.freeze({
    "dujin_bing": "https://api.dujin.org/bing/1920.php",
    "ixiaowai_e": "https://api.ixiaowai.cn/api/api.php",
    "ixiaowai_menhera": "https://api.ixiaowai.cn/mcapi/mcapi.php",
    "ixiaowai_landscape": "https://api.ixiaowai.cn/gqapi/gqapi.php",
    "unsplash": "https://unsplash.it/1920/1080?random",
    "picsum": "https://picsum.photos/1920/1080/",
    "getlove_bing": "http://bing.getlove.cn/bingImage",
});

const _global_background = {
    getBackgroundImageFactory: (params = {}) => {
        let tmp = new function () {
            this.blur = params["blur"] ? parseFloat(params["blur"]) : 0;
            this.origin_type = params["origin_type"] && BackgroundApiOriginType[params["origin_type"]]
                ? BackgroundApiOriginType[params["origin_type"]] : BackgroundApiOriginType.picsum;
            this.grayscale = params["grayscale"] ? params["grayscale"] : false;
            this.img_url = params["img_url"] ? params["img_url"] : null;
            if (this.img_url) this.origin_type = this.img_url;

            this.setBackground = (target_id) => {
                const elem = document.getElementById(target_id);
                if (!elem) return;
                elem.style.cssText += `background: url("${this.origin_type}") fixed no-repeat center center; background-color:#CCCCCC;`;
                elem.style.cssText += "filter:\"progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')\";" +
                    "-moz-background-size:100% 100%;" +
                    "background-size:100% 100%;"
                if (this.blur && this.grayscale) {
                    elem.style.cssText += `filter: blur(${this.blur}px) grayscale(100%);`;
                    elem.classList.add("gray");
                } else if (this.blur) {
                    elem.style.cssText += `filter: blur(${this.blur}px)`;
                } else if (this.grayscale) {
                    elem.classList.add("gray");
                }
            }
        }
        return _global_background._ = tmp;
    },
};


const getBackgroundImageFactory = _global_background.getBackgroundImageFactory;


function showMenu(is_show) {
    if (typeof(is_show) == "undefined") {
        if (hasClass(g("menu"), "sort_on"))
            removeClass(g("menu"), "sort_on");
        else
            addClass(g("menu"), "sort_on");
    } else {
        if (is_show) {
            addClass(g("menu"), "sort_on");
        } else {
            removeClass(g("menu"), "sort_on");
        }
    }
}

function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}
window.onload = function () {
// cart.categories = {"1":"\u5ddd\u83dc","2":"\u767d\u83dc","3":"\u82a5\u83dc","1325":"\u82e6\u8336"};
    cart.total = 40;
    cart.getFromCache();
    cart.showCartInfo();
}
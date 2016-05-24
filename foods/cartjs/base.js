function renderList(arr, parent) {
    var li,
        count = 0,
        total = 0,
        html;
    for (var i = 0; i < arr.length; i++) {
        html = "";
        li = document.createElement("li");
        li.className = "ccbg2";
        html = '<div class="orderdish"><span class="name">' + arr[i].name + '</span><span class="price"> ' + arr[i].number + '份</span><span class="price"> 每份' + arr[i].price + '元</span></div>';
        li.innerHTML = html;
        parent.appendChild(li);
        count += arr[i].number;
        total += arr[i].number * arr[i].price;
    }
    li = document.createElement("li");
    li.className = "ccbg2";
    html = '<div class="orderdish"><span class="price">共计' + count + '份</span><span class="price"> ￥' + total + '元</span></div>';
    li.innerHTML = html;
    parent.appendChild(li);
}
window.onload = function () {
    var ullist = document.getElementById("ullist");
    renderList(window.opener.cart._products, ullist);
};
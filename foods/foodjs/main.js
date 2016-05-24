function toCart() {
    location.href = "/cart?wxuserid=o25KXjmh2NgsebTMJoZdDMfDAf9k";
}
function g(id) {
    return document.getElementById(id);
}
function addProduct(productId, specId, name, price, categoryId, addnum) {
    cart.addProduct(OAK.Shop.Product({
        id: productId, 
        specId: specId, 
        number: addnum, 
        price: price, 
        name: name,
        categoryId: categoryId
    }));
}
function reduceProduct(productId, specId,num) {
    var oldnum = cart.getProductNumber({
        id: productId, 
        specId: specId
    });
    if (oldnum !== null) {
        if (oldnum - num > 0) {
            cart.updateNumber(oldnum - num, {
                id: productId, 
                specId: specId
            });
        } else {
            cart.deleteProduct({
                id: productId, 
                specId: specId
            });
        }
    }
}
function showAll() {
    var dts = document.getElementsByTagName("dt");
    for (var i in dts) {
        if (dts[i].innerText != null) {
            dts[i].style.display = "";
            var dd = dts[i].nextElementSibling;
            while (dd != null && dd.tagName != 'DT') {
                dd.style.display = "";
                dd = dd.nextElementSibling
            }
        }
    }
    showMenu(false);
}
function showProducts(categoryName) {
    showAll();
    var dts = document.getElementsByTagName("dt");
    for (var i in dts) {
        if (dts[i].innerText != null && dts[i].innerText != categoryName) {
            dts[i].style.display = "none";
            var dd = dts[i].nextElementSibling;
            while (dd != null && dd.tagName != 'DT' ) {
                dd.style.display = "none";
                dd = dd.nextElementSibling
            }
        }
    }
}
function showCart() {
    window.open("cart.html");
}

var cart = new OAK.Shop.Cart();
cart.showProductNum = function (productId, specId, num) {
    if (num > 0) {
        g("num_" + productId + "_" + specId).className = "count";
        //g("del_" + productId+"_"+specId).style.display = "";
    } else {
        g("num_" + productId + "_" + specId).className = "count_zero";
        //g("del_"  + productId+"_"+specId).style.display = "none";
    }
    g("num_" + productId + "_" + specId).innerHTML = parseInt(num);
}
cart.showTotalNum = function () {
    var quant = cart.getQuantity();
    g("cartN").innerHTML = "" + quant.totalNumber + "份　￥" + quant.totalAmount.toFixed(2);
    SetCookie("food1",quant.totalNumber);
};
cart.showCartInfo = function () {
    var products = cart.getProductList();
    for (var i in products) {
        var product_id = products[i].id;
        var spec_id = products[i].specId;
        cart.showProductNum(product_id, spec_id, cart.getProductNumber({
                id: product_id,
                specId: spec_id
            }) || 0);
    }
    cart.showTotalNum();
};
cart.onAfterAdd = function (obj, num, conditions) {
    cart.showProductNum(conditions.id, conditions.specId, num);
    cart.showTotalNum();
    cart.saveToCache();
};
cart.onAfterUpdate = function (obj, num, conditions) {
    cart.showProductNum(conditions.id, conditions.specId, num);
    cart.showTotalNum();
    cart.saveToCache();
};
cart.onAfterDelete = function (obj, conditions) {
    cart.showProductNum(conditions.id, conditions.specId, 0);
    cart.showTotalNum();
    cart.saveToCache();
};
cart.getFromCache();
cart.showCartInfo();
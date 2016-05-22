// JavaScript Document

        function g(id) {
            return document.getElementById(id);
        }

function showAll(){
    var dts = document.getElementsByTagName("dt");
    for(var i in dts){
        if(dts[i].innerText != null){
            dts[i].style.display = "";
            var dd = dts[i].nextElementSibling;
            while(dd != null && dd.tagName != 'DT' ){
                dd.style.display = "";
                dd = dd.nextElementSibling
            }
        }
    }
    showMenu(false);
}
function showProducts(categoryName){
    showAll();
    var dts = document.getElementsByTagName("dt");
    for(var i in dts){
        if(dts[i].innerText != null && dts[i].innerText != categoryName){
            dts[i].style.display = "none";
            var dd = dts[i].nextElementSibling;
            while(dd != null && dd.tagName != 'DT' ){
                dd.style.display = "none";
                dd = dd.nextElementSibling
            }
        }
    }
}

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

/*返回上一个页面*/
function pageBack(){
	var a=window.location.href;
	if(/#top/.test(a)){window.history.go(-2);
	window.location.load(window.location.href)}
	else
	{window.history.back();
	window.location.load(window.location.href)
	}
}

function opencaidan(){
	if(g("c_order_list").style.display != "block"){
	g("c_order_list").style.display = "block";
	}
	else g("c_order_list").style.display = "none";
}



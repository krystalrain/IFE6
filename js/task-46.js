var addEvent = function (elem, type, handler) {
    if (window.addEventListener) {
        addEvent =  function (elem, type, handler) {
            elem.addEventListener(tyoe, handler, false);
        };
    } else if (window.attachEvent) {
        addEvent =  function (elem, type, handler) {
            elem.attachEvent('on' + type, handler);
        };
    } else {
        addEvent =  function (elem, type, handler) {
            elem['on' + type] = handler;
        };
    }
    addEvent(elem, type, handler);
};


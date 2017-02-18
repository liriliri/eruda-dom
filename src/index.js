var util = require('./util');

module.exports = function (eruda)
{
    var erudaUtil = eruda.util;

    return {
        name: 'dom',
        init: function ($el)
        {
            this._$el = $el;
            this._isInit = false;

            erudaUtil.evalCss(require('./style.css'));
        },
        show: function ()
        {
            this._$el.show();

            if (this._isInit) return;

            this._initTree();
        },
        _initTree: function ()
        {
            this._isInit = true;

            this._$el.html(createEl(document.documentElement));
        }
    }
};

function createEl(el)
{
    var type = el.nodeType;

    switch (type)
    {
        case 1: return createNode(el);
        case 3: return createTextNode(el);
        case 8: return createCmtNode(el);
    }

    return '';
}

function createNode(el)
{
    return '';
}

function createTextNode(el)
{
    return '';
}

function createCmtNode(el)
{
    return '';
}
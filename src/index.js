var util = require('./util');

module.exports = function (eruda)
{
    var erudaUtil = eruda.util;

    return {
        name: 'dom',
        init: function ($el)
        {
            this._$el = $el;

            erudaUtil.evalCss(require('./style.css'));

            this._tpl = util.template(require('./template.tpl'));
        },
        show: function ()
        {
            this._$el.show();

            this._render();
        },
        _render: function ()
        {
            this._$el.html(this._tpl());
        }
    }
};
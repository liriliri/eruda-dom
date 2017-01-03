// Built by eustia.
module.exports = (function ()
{
    var _ = {};

    /* ------------------------------ has ------------------------------ */

    var has = _.has = (function ()
    {
        /* Checks if key is a direct property.
         *
         * |Name  |Type   |Desc                            |
         * |------|-------|--------------------------------|
         * |obj   |object |Object to query                 |
         * |key   |string |Path to check                   |
         * |return|boolean|True if key is a direct property|
         *
         * ```javascript
         * has({one: 1}, 'one'); // -> true
         * ```
         */

        var hasOwnProp = Object.prototype.hasOwnProperty;

        function exports(obj, key)
        {
            return hasOwnProp.call(obj, key);
        }

        return exports;
    })();

    /* ------------------------------ keys ------------------------------ */

    var keys = _.keys = (function (exports)
    {
        /* Create an array of the own enumerable property names of object.
         *
         * |Name  |Type  |Desc                   |
         * |------|------|-----------------------|
         * |obj   |object|Object to query        |
         * |return|array |Array of property names|
         */

        exports = Object.keys || function (obj)
        {
            var ret = [], key;

            for (key in obj)
            {
                if (has(obj, key)) ret.push(key);
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ escape ------------------------------ */

    var escape = _.escape = (function ()
    {
        /* Escapes a string for insertion into HTML, replacing &, <, >, ", `, and ' characters.
         *
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |str   |string|String to escape|
         * |return|string|Escaped string  |
         *
         * ```javascript
         * escape('You & Me'); -> // -> 'You &amp; Me'
         * ```
         */

        function exports(str)
        {
            return regTest.test(str) ? str.replace(regReplace, replaceFn) : str;
        }

        var MAP = exports.MAP = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        };

        var regSrc = '(?:' + keys(MAP).join('|') + ')',
            regTest = new RegExp(regSrc),
            regReplace = new RegExp(regSrc, 'g');

        function replaceFn(match)
        {
            return MAP[match];
        }

        return exports;
    })();

    /* ------------------------------ template ------------------------------ */

    var template = _.template = (function (exports)
    {
        /* Compile JavaScript template into function that can be evaluated for rendering.
         *
         * |Name  |Type    |String                    |
         * |------|--------|--------------------------|
         * |str   |string  |Template string           |
         * |return|function|Compiled template function|
         *
         * ```javascript
         * template('Hello <%= name %>!')({name: 'eris'}); // -> 'Hello eris!'
         * template('<p><%- name %></p>')({name: '<eris>'}); // -> '<p>&lt;eris&gt;</p>'
         * template('<%if (echo) {%>Hello eris!<%}%>')({echo: true}); // -> 'Hello eris!'
         * ```
         */

        var regEvaluate = /<%([\s\S]+?)%>/g,
            regInterpolate = /<%=([\s\S]+?)%>/g,
            regEscape = /<%-([\s\S]+?)%>/g,
            regMatcher = RegExp([
                regEscape.source,
                regInterpolate.source,
                regEvaluate.source
            ].join('|') + '|$', 'g');

        var escapes = {
            "'": "'",
            '\\': '\\',
            '\r': 'r',
            '\n': 'n',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };

        var regEscapeChar = /\\|'|\r|\n|\u2028|\u2029/g;

        var escapeChar = function(match)
        {
            return '\\' + escapes[match];
        };

        exports = function (str)
        {
            var index = 0,
                src = "__p+='";

            str.replace(regMatcher, function (match, escape, interpolate, evaluate, offset)
            {
                src += str.slice(index, offset).replace(regEscapeChar, escapeChar);
                index = offset + match.length;

                if (escape)
                {
                    src += "'+\n((__t=(" + escape + "))==null?'':util.escape(__t))+\n'";
                } else if (interpolate)
                {
                    src += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
                } else if (evaluate)
                {
                    src += "';\n" + evaluate + "\n__p+='";
                }

                return match;
            });

            src += "';\n";
            src = 'with(obj||{}){\n' + src + '}\n';
            src = "var __t,__p='',__j=Array.prototype.join," +
                  "print=function(){__p+=__j.call(arguments,'');};\n" +
                  src + 'return __p;\n';

            var render = new Function('obj', 'util', src);

            return function (data)
            {
                return render.call(null, data, _);
            };
        };

        return exports;
    })({});

    return _;
})();
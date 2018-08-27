module.exports = function(eruda) {
  let { evalCss, each, $ } = eruda.util

  class Dom extends eruda.Tool {
    constructor() {
      super()
      this.name = 'dom'
      this._style = evalCss(require('./style.scss'))
      this._isInit = false
      this._htmlEl = document.documentElement
      this._htmlTagTpl = require('./htmlTag.hbs')
      this._textNodeTpl = require('./textNode.hbs')
    }
    init($el, container) {
      super.init($el, container)
      $el.html(require('./template.hbs')())
      this._$domTree = $el.find('.eruda-dom-tree')
    }
    show() {
      super.show()

      if (!this._isInit) this._initTree()
    }
    hide() {
      super.hide()
    }
    destroy() {
      super.destroy()
      evalCss.remove(this._style)
    }
    _initTree() {
      this._isInit = true

      this._renderChildren(null, this._$domTree)
    }
    _renderChildren(node, $container) {
      let children
      if (!node) {
        children = [this._htmlEl]
      } else {
        children = node.childNodes
      }

      const container = $container.get(0)

      each(children, child => this._renderChild(child, container))
      if (node) {
        const $tag = createEl('li')
        $tag.addClass('eruda-tree-item')
        $tag.html(
          `<span class="eruda-html-tag" style="margin-left: -12px;">&lt;<span class="eruda-tag-name">/${node.tagName.toLocaleLowerCase()}</span>&gt;</span>`
        )
        container.appendChild($tag.get(0))
      }
    }
    _renderChild(child, container) {
      const $tag = createEl('li')

      $tag.addClass('eruda-tree-item')
      if (child.nodeType === child.ELEMENT_NODE) {
        const childCount = child.childNodes.length
        const expandable = childCount > 0
        const data = {
          ...getHtmlTagData(child),
          hasTail: expandable
        }
        const hasOneTextNode =
          childCount === 1 && child.childNodes[0].nodeType === child.TEXT_NODE
        if (hasOneTextNode) {
          data.text = child.childNodes[0].nodeValue
        }
        $tag.html(this._htmlTagTpl(data))
        if (expandable && !hasOneTextNode) {
          $tag.addClass('eruda-expandable')
        }
      } else if (child.nodeType === child.TEXT_NODE) {
        const value = child.nodeValue
        if (value.trim() === '') return

        $tag.html(
          this._textNodeTpl({
            value: child.nodeValue
          })
        )
      } else {
        return
      }
      const $children = createEl('ul')
      $children.addClass('eruda-children')

      $tag.on('click', () => {
        if (!$tag.hasClass('eruda-expandable')) return

        if ($tag.hasClass('eruda-expanded')) {
          $children.html('')
          $tag.html(
            this._htmlTagTpl({
              ...getHtmlTagData(child),
              hasTail: true
            })
          )
          $tag.rmClass('eruda-expanded')
        } else {
          $tag.html(
            this._htmlTagTpl({
              ...getHtmlTagData(child),
              hasTail: false
            })
          )
          $tag.addClass('eruda-expanded')
          this._renderChildren(child, $children)
        }
      })

      container.appendChild($tag.get(0))
      container.appendChild($children.get(0))
    }
  }

  function getHtmlTagData(node) {
    const ret = {}

    ret.tagName = node.tagName.toLocaleLowerCase()
    ret.attributes = node.attributes

    return ret
  }

  function createEl(name) {
    return $(document.createElement(name))
  }

  return new Dom()
}

module.exports = function(eruda) {
  let { evalCss, each, $, toArr } = eruda.util

  class Dom extends eruda.Tool {
    constructor() {
      super()
      this.name = 'dom'
      this._style = evalCss(require('./style.scss'))
      this._isInit = false
      this._htmlTagTpl = require('./htmlTag.hbs')
      this._textNodeTpl = require('./textNode.hbs')
      this._selectedEl = document.documentElement
      this._htmlCommentTpl = require('./htmlComment.hbs')
    }
    init($el, container) {
      super.init($el)
      this._container = container
      $el.html(require('./template.hbs')())
      this._$domTree = $el.find('.eruda-dom-tree')

      this._bindEvent()
    }
    show() {
      super.show()

      if (!this._isInit) this._initTree()
    }
    hide() {
      super.hide()
    }
    select(el) {
      const els = []
      els.push(el)
      while (el.parentElement) {
        els.unshift(el.parentElement)
        el = el.parentElement
      }
      while (els.length > 0) {
        el = els.shift()
        if (el.erudaDom) {
          el.erudaDom.open()
        } else {
          break
        }
        if (els.length === 0 && el.erudaDom) {
          el.erudaDom.select()
        }
      }
    }
    destroy() {
      super.destroy()
      evalCss.remove(this._style)
    }
    _bindEvent() {
      const container = this._container

      this._$el.on('click', '.eruda-inspect', () => {
        this._setElement(this._selectedEl)
        if (container.get('elements')) container.showTool('elements')
      })
    }
    _setElement(el) {
      const elements = this._container.get('elements')
      if (!elements) return

      elements.set(el)
    }
    _initTree() {
      this._isInit = true

      this._renderChildren(null, this._$domTree)
      this.select(document.body)
    }
    _renderChildren(node, $container) {
      let children
      if (!node) {
        children = [document.documentElement]
      } else {
        children = toArr(node.childNodes)
      }

      const container = $container.get(0)

      if (node) {
        children.push({
          nodeType: 'END_TAG',
          node
        })
      }
      each(children, child => this._renderChild(child, container))
    }
    _renderChild(child, container) {
      const $tag = createEl('li')
      let isEndTag = false

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
            value
          })
        )
      } else if (child.nodeType === child.COMMENT_NODE) {
        const value = child.nodeValue
        if (value.trim() === '') return

        $tag.html(
          this._htmlCommentTpl({
            value
          })
        )
      } else if (child.nodeType === 'END_TAG') {
        isEndTag = true
        child = child.node
        $tag.html(
          `<span class="eruda-html-tag" style="margin-left: -12px;">&lt;<span class="eruda-tag-name">/${child.tagName.toLocaleLowerCase()}</span>&gt;</span><span class="eruda-selection"></span>`
        )
      } else {
        return
      }
      const $children = createEl('ul')
      $children.addClass('eruda-children')

      container.appendChild($tag.get(0))
      container.appendChild($children.get(0))

      if (child.nodeType !== child.ELEMENT_NODE) return

      let erudaDom = {}

      if ($tag.hasClass('eruda-expandable')) {
        const open = () => {
          $tag.html(
            this._htmlTagTpl({
              ...getHtmlTagData(child),
              hasTail: false
            })
          )
          $tag.addClass('eruda-expanded')
          this._renderChildren(child, $children)
        }
        const close = () => {
          $children.html('')
          $tag.html(
            this._htmlTagTpl({
              ...getHtmlTagData(child),
              hasTail: true
            })
          )
          $tag.rmClass('eruda-expanded')
        }
        const toggle = () => {
          if ($tag.hasClass('eruda-expanded')) {
            close()
          } else {
            open()
          }
        }
        $tag.on('click', '.eruda-toggle-btn', e => {
          e.stopPropagation()
          toggle()
        })
        erudaDom = {
          open,
          close
        }
      }

      const select = () => {
        this._$el.find('.eruda-selected').rmClass('eruda-selected')
        $tag.addClass('eruda-selected')
        this._selectedEl = child
        this._setElement(child)
      }
      $tag.on('click', select)
      erudaDom.select = select
      if (!isEndTag) child.erudaDom = erudaDom
    }
  }

  function getHtmlTagData(el) {
    const ret = {}

    ret.tagName = el.tagName.toLocaleLowerCase()
    ret.attributes = el.attributes

    return ret
  }

  function createEl(name) {
    return $(document.createElement(name))
  }

  return new Dom()
}

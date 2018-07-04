// devDependencies
import assign from 'lodash-es/assign'

// Helpers
import setIF from './helpers/setIF'
import masterCook from './helpers/masterCook'
import setPublicVar from './helpers/setPublicVar'
import forEach from './helpers/forEach'
import noScroll from 'no-scroll'

// Theme assets
import './templates/main.scss'
import themeDefault from './templates/default.html'
import buttonDefault from './templates/button.html'

// Utils
import { version as PKG_VERSION } from '../package.json'

/**
 * @module constructor
 * @variable ingredients
 * @type string
 * @default --
 * @description HTML selector for the anchor tags: eg: “.menu a” or “.menu-link” if ”.menu-link” it’s a NODE Collection of links
 * @required true
 */
class MenuChef {
  constructor (ingredients = false, options = {}) {
    if (ingredients === false) throw new Error('MenuChef needs link elements passed as ingredients')
    this._ingredients = document.querySelectorAll(ingredients)
    if (this._ingredients.length === 0) throw new Error('MenuChef needs link elements passed as ingredients')
    if (this._ingredients.length === 1) console.warn('MenuChef don\'t find ingredients. Maybe you passed the menu itself as ingredients. If the class of menu is ".menu", pass ".menu a". The links are the ingredients =)')

    const THEMES = {
      full: {
        html: themeDefault,
        options: {
          effectOnOpen: [],
          pageEffect: [],
          direction: []
        }
      },
      side: {
        html: themeDefault,
        options: {
          effectOnOpen: ['smooth'],
          pageEffect: ['blur'],
          direction: ['left', 'right']
        }
      }
    }

    const HAMBURGERS = ['3dx', '3dx-r', '3dy', '3dy-r', 'arrow', 'arrow-r', 'arrowalt', 'arrowalt-r', 'boring', 'collapse', 'collapse-r', 'elastic', 'elastic-r', 'emphatic', 'emphatic-r', 'slider', 'slider-r', 'spin', 'spin-r', 'spring', 'spring-r', 'stand', 'stand-r', 'squeeze', 'vortex', 'vortex-r']

    const SCHEMES = ['black', 'yellow', 'red', 'green', 'blue']

    /**
     * @module constructor
     * @variable options
     * @type object
     * @default options
     * @description Overwrite the <a href="#Default-Options">default options</a> of MenuChef
     */
    const DEFAULTS = {
      /**
       * @module options
       * @variable parent
       * @type string
       * @default body
       * @released 1.2.0
       * @description Parent element where MenuChef'll placed
       */
      parent: 'body',
      /**
       * @module options
       * @variable theme
       * @type string, object
       * @default full
       * @description Theme string (name)/object to personalize specific details of MenuChef theme
       */
      theme: {
        /**
       * @module theme
       * @variable theme
       * @type string
       * @default full
       * @description Theme string (name)/object to personalize specific details of MenuChef theme
       */
        theme: 'full',
        /**
       * @module theme
       * @variable effectOnOpen
       * @type string
       * @default --
       * @description Effects on open the menu. The effects available depends of theme. <br><br> side: smooth
       */
        effectOnOpen: '',
        /**
       * @module theme
       * @variable direction
       * @type string
       * @default right
       * @description Direction to open the menu. Directions available depends of theme. <br><br>side: left, right
       */
        direction: '',
        /**
       * @module theme
       * @variable pageEffect
       * @type string
       * @default --
       * @description Effects on page when the menu is opening. Effects available depends of theme. <br><br>side: blur
       */
        pageEffect: ''
      },
      /**
       * @module options
       * @variable scheme
       * @type string
       * @default black
       * @description Default schemes colors of MenuChef. You can <a href="#Theming-Vars">modify by yourself</a><br><br>Options: black, yellow, red, green, blue
       */
      scheme: 'black',
      /**
       * @module options
       * @variable closeOnClick
       * @type boolean
       * @default true
       * @description Close MenuChef when it’s clicked in a link
       */
      closeOnClick: true,
      /**
       * @module options
       * @variable closeOnClickOutside
       * @type boolean
       * @default true
       * @description Close MenuChef when it’s clicked outside of kitchen (the menu it self)
       */
      closeOnClickOutside: true,
      /**
       * @module options
       * @variable button
       * @type string
       * @default MenuChef's hamburger button
       * @released 1.2.0
       * @description HTML of MenuChef's button. You can pass your own button HTML like <code>&lt;i class=&quot;myicon&quot;&gt;&lt;/i&gt;</code>.
       * <br>
       * Remember: The MenuChef's button is the same for open and for close (toggle). You can control appearence of button with CSS. The button container receives the class <code>is-active</code> when MenuChef is open.
       */
      button: buttonDefault,
      /**
       * @module options
       * @variable classes
       * @type object
       * @default --
       * @released 1.1.0
       * @description Classes is a manager of classes in links passed to MenuChef. It reveives 3 properties. All properties receives ONLY <code>array</code> of classes.
       * <br>
       * <b>exclude</b>: remove a class or an <code>array</code> of classes
       * <br>
       * <b>only</b>: remove ALL classes expect this one or an <code>array</code> of classes
       * <br>
       * <b>include</b>: add a class or an <code>array</code> of classes
       * <br>
       * ps: The order of hierarchy is respected. <b>exclude</b> > <b>only</b> > <b>include</b>
       */
      classes: {
        exclude: [],
        only: [],
        include: []
      },

      /**
       * @module options
       * @variable hamburger
       * @type string
       * @default boring
       * @description This option is powered by awesome lib <a href="https://jonsuh.com/hamburgers/" target="_blank">Hamburgers</a>, by Jonathan Sug. The operation can be seen at <a href="https://jonsuh.com/hamburgers/" target="_blank">lib demo site</a><br><br>Options: 3dx, 3dx-r, 3dy, 3dy-r, arrow, arrow-r, arrowalt, arrowalt-r, boring, collapse, collapse-r, elastic, elastic-r, emphatic, emphatic-r, slider, slider-r, spin, spin-r, spring, spring-r, stand, stand-r, squeeze, vortex, vortex-r
       */
      hamburger: 'boring',
      /**
       * @module options
       * @variable bodyClassOpen
       * @type string
       * @default --
       * @description Append a class in <body> when the menu is opened
       */
      bodyClassOpen: '',
      /**
       * @module options
       * @variable kitchenClass
       * @type string
       * @default --
       * @description Append a class in MenuChef wrapper <br><br>ps. Kitchen is the wrapper of MenuChef, where all the ingredients are cooked
       */
      kitchenClass: '',
      /**
       * @module options
       * @variable kitchenOpenClass
       * @type string
       * @default --
       * @description Append a class in MenuChef when the same is opened
       */
      kitchenOpenClass: '',
      /**
       * @module options
       * @variable onOpen
       * @type function
       * @default --
       * @description Callback function that's called when MenuChef is open
       */
      onOpen: () => {},
      /**
       * @module options
       * @variable onClose
       * @type function
       * @default --
       * @description Callback function that's called when MenuChef is close
       */
      onClose: () => {},
      /**
       * @module options
       * @variable onClick
       * @type function
       * @default --
       * @description Callback function that's called when a link in MenuChef is clicked
       */
      onClick: () => {},
      /**
       * @module options
       * @variable onReady
       * @type function
       * @default --
       * @released 1.2.0
       * @description Callback function that's called when MenuChef is ready and loaded
       */
      onReady: () => {}
    }

    this.version = PKG_VERSION
    this._options = assign(DEFAULTS, options)
    this._options.hamburger = setIF(this._options.hamburger, (HAMBURGERS.indexOf(this._options.hamburger) !== -1), 'boring')
    this._options.scheme = setIF(this._options.scheme, (SCHEMES.indexOf(this._options.scheme) !== -1), 'black')
    if (typeof this._options.theme !== 'string' && typeof this._options.theme !== 'object') throw new Error('theme must be a string or a object')
    this._theme = (typeof this._options.theme === 'string') ? this._options.theme : this._options.theme.theme

    this.$parent = document.querySelector(this._options.parent) ? document.querySelector(this._options.parent) : document.querySelector(DEFAULTS.parent)

    if (this._options.parent !== DEFAULTS.parent && !this.$parent) console.warning(`parent element don't found. body will be used instead.`)

    this._themeOptions = (typeof this._options.theme === 'object') ? this._options.theme : {}

    if (typeof this._options.onOpen !== 'function') throw new Error('onOpen callback must be a function')
    if (typeof this._options.onClose !== 'function') throw new Error('onClose callback must be a function')
    if (typeof this._options.onClick !== 'function') throw new Error('onClick callback must be a function')
    if (typeof this._options.onReady !== 'function') throw new Error('onReady callback must be a function')

    if (!THEMES.hasOwnProperty(this._theme)) {
      console.warn(`Theme "${this._theme}" passed in options does not exist. Default theme was setted. Themes availables: ${Object.keys(THEMES).join(', ')}`)
      this._theme = 'full'
    }

    try { this._themeOptions.effectOnOpen = setIF(this._themeOptions.effectOnOpen, (THEMES[this._theme].options.effectOnOpen.indexOf(this._themeOptions.effectOnOpen) !== -1)) } catch (e) {}
    try { this._themeOptions.direction = setIF(this._themeOptions.direction, (THEMES[this._theme].options.direction.indexOf(this._themeOptions.direction) !== -1)) } catch (e) {}
    try { this._themeOptions.pageEffect = setIF(this._themeOptions.pageEffect, (THEMES[this._theme].options.pageEffect.indexOf(this._themeOptions.pageEffect) !== -1)) } catch (e) {}

    this._themeClass = `MenuChef--theme-${this._theme}`
    this._kitchenClass = 'js-MenuChef'
    this._kitchenLinksClass = 'js-MenuChefLinks'
    this._kitchenLinksClassStyled = 'MenuChef-links-link'
    this._dirClass = (this._themeOptions.direction) ? `${this._themeClass}--dir--${this._themeOptions.direction}` : ''
    this._themeEffectClass = (this._themeOptions.effectOnOpen) ? `${this._themeClass}-effect--${this._themeOptions.effectOnOpen}` : false
    this._themeOpenClass = (this._themeEffectClass) ? `${this._themeEffectClass}--open` : 'is-visible'

    this._classes = {
      init: {
        body: [(this._themeOptions.pageEffect) ? `has-MenuChef--effect--${this._themeOptions.pageEffect}` : ''],
        controlBtn: {
          open: [(this._themeOptions.direction) ? `MenuChefOpen--dir--${this._themeOptions.direction}` : ''],
          close: []
        },
        kitchen: [this._themeClass, this._themeEffectClass, this._dirClass, this._options.kitchenClass]
      },
      open: {
        body: ['has-menuChefOpen', `has-menuChefOpen--${this._theme}`, this._options.bodyClassOpen],
        controlBtn: {
          open: [],
          close: []
        },
        kitchen: [this._themeOpenClass, this._options.kitchenOpenClass]
      },
      close: {
        body: [],
        controlBtn: {
          open: [],
          close: []
        },
        kitchen: []
      }
    }

    MenuChef.prototype.ISBUTTONDEFAULT = (this._options.button === buttonDefault)

    this.init()
    this.inject(THEMES)
    this.cook()
  }

  inject (themes) {
    if (!this.ISBUTTONDEFAULT) this._options.button = `<span onclick="MenuChef.toggle()" class="MenuChefOpen MenuChefOpen--custom">${this._options.button}</span>`
    this.$parent.insertAdjacentHTML('afterbegin', (themes[this._theme].html + this._options.button).replace(/{{options.hamburger}}/g, this._options.hamburger.toLowerCase()))
    this.$openButton = document.querySelector('.MenuChefOpen')
    this._kitchen = document.querySelector(`.${this._kitchenClass}`)
    masterCook(document.body, this._classes.init.body)
    masterCook(this._kitchen, this._classes.init.kitchen)
    if (this.ISBUTTONDEFAULT) masterCook(this.$openButton, this._classes.init.controlBtn.open)

    // to work in IE10
    // this.$openButton.dataset.scheme = this._kitchen.dataset.scheme = this._options.scheme
    if (this.ISBUTTONDEFAULT) this.$openButton.setAttribute('data-scheme', this._options.scheme)
    this._kitchen.setAttribute('data-scheme', this._options.scheme)
    this._options.onReady()
  }

  cook () {
    const self = this
    const pan = this._kitchen.querySelector(`.${this._kitchenLinksClass}`)
    forEach(this._ingredients, (index, ingredient) => { // for (let ingredient of this._ingredients) {}
      var preparing = ingredient.cloneNode(true)

      try {
        // options.classes.exclude
        if (self._options.classes.exclude.length === 0) {
        } else {
          self._options.classes.exclude.map(classe => preparing.classList.remove(classe))
          preparing.classList.add(self._kitchenLinksClassStyled)
        }
      } catch (e) {}

      try {
        // options.classes.only
        if (self._options.classes.only.length === 0) {
        } else {
          for (let i = preparing.classList.length - 1; i >= 0; i--) {
            let classe = preparing.classList[i]
            if (self._options.classes.only.indexOf(classe) === -1) {
              preparing.classList.remove(classe)
            }
          }
          preparing.classList.add(self._kitchenLinksClassStyled)
        }
      } catch (e) {}

      try {
        // options.classes.include
        if (self._options.classes.include.length !== 0) {
          self._options.classes.include.map(classe => preparing.classList.add(classe))
          preparing.classList.add(self._kitchenLinksClassStyled)
        }
      } catch (e) {}

      try {
        if (self._options.classes.exclude.length === 0 && self._options.classes.only.length === 0) preparing.className = self._kitchenLinksClassStyled
      } catch (e) {}

      preparing.onclick = () => {
        self._options.onClick()
        if (self._options.closeOnClick) MenuChef.close()
      }

      pan.appendChild(preparing)
    })
  }

  init () {
    const self = this
    self._isOpen = null

    /**
       * @module public_variables
       * @variable MenuChef.version
       * @type string
       * @default version
       * @description Return MenuChef version number
       */
    setPublicVar(MenuChef, self, 'version')
    /**
       * @module public_variables
       * @variable MenuChef.isOpen
       * @type boolean
       * @default null
       * @description Return <code>null</code> if MenuChef was never opened, <code>true</code>/<code>>false</code if MenuChef it's open or not
       */
    setPublicVar(MenuChef, self, 'isOpen', '_isOpen')

    /**
     * @module public_methods
     * @variable MenuChef.open()
     * @type function
     * @default --
     * @description Open MenuChef
     */
    MenuChef.open = function () {
      masterCook(document.body, self._classes.open.body)
      masterCook(self._kitchen, self._classes.open.kitchen)
      if (self._options.closeOnClickOutside) self.chefObserver('addWatch')
      self._options.onOpen()
      self.$openButton.classList.add('is-active')
      self._isOpen = true
      noScroll.on()
    }
    /**
     * @module public_methods
     * @variable MenuChef.close()
     * @type function
     * @default --
     * @description Close MenuChef
     */
    MenuChef.close = function () {
      masterCook(document.body, self._classes.open.body, 'remove')
      masterCook(self._kitchen, self._classes.open.kitchen, 'remove')
      if (self._options.closeOnClickOutside) self.chefObserver('removeWatch')
      self._options.onClose()
      self.$openButton.classList.remove('is-active')
      self._isOpen = false
      noScroll.off()
    }
    /**
     * @module public_methods
     * @variable MenuChef.toggle([this, classe])
     * @type function
     * @default All parameters are optional <br> <code>classe</code> default is <code>is-active</code>
     * @description Toggle MenuChef<br><br>When <code>this</code> is passed, toggle is fired and return the <code>classe</code> to the element <code>this</code>. Only works when the function toggle() itself is triggered
     */
    MenuChef.toggle = function (el = false, classe = 'is-active') {
      if (self._kitchen.classList.contains(self._themeOpenClass)) {
        MenuChef.close()
        if (el) el.classList.remove(classe)
      } else {
        MenuChef.open()
        if (el) el.classList.add(classe)
      }
    }
    MenuChef._watcher = function (e) {
      const searchKitchen = (el) => {
        try {
          return el.getAttribute('onclick').includes('MenuChef.toggle')
        } catch (err) {}

        try {
          return el.classList.contains(self._kitchenLinksClass) || el.classList.contains(self._kitchenClass)
        } catch (err) {}
      }
      /**
       * @private
       * Close MenuChef if is clicked outside
       * Don't close if is clicked in kitchen or in a button with
       * MenuChef.toggle() function on onclick because the watcher
       * closes the MenuChef before the toggle(), who mistakenly opened
       */

      try {
        if (e.path.filter(searchKitchen).length === 0) MenuChef.close()
      } catch (e) {}
    }
    /**
     * @module public_methods
     * @variable MenuChef.destroy()
     * @type function
     * @default -
     * @description Destroy MenuChef instance, HTML inserts and watchers
     */
    MenuChef.destroy = function () {
      masterCook(document.body, self._classes.init.body, 'remove')
      const kitchen = document.querySelector(`.${self._kitchenClass}`)
      const kitchenButtonOpen = document.querySelector(`.MenuChefOpen`)

      kitchen.parentNode.removeChild(kitchen)
      kitchenButtonOpen.parentNode.removeChild(kitchenButtonOpen)
    }
  }

  chefObserver (type = 'addWatch') {
    if (type === 'addWatch') {
      document.addEventListener('click', MenuChef._watcher, true)
    }

    if (type === 'removeWatch') {
      document.removeEventListener('click', MenuChef._watcher, true)
    }
  }
}

window.MenuChef = MenuChef

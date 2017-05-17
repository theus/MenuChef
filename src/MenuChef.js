// devDependencies
import assign from 'lodash-es/assign'

// Helpers
import setIF from './helpers/setIF'
import masterCook from './helpers/masterCook'
import setPublicVar from './helpers/setPublicVar'
import forEach from './helpers/forEach'

// Theme assets
import './templates/main.scss'
import themeDefault from './templates/default.html'

// Utils
import { version as PKG_VERSION } from '../package.json'

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

    const DEFAULTS = {
      theme: {
        theme: 'full',
        effectOnOpen: '',
        direction: '',
        pageEffect: ''
      },

      scheme: 'black',
      closeOnClick: true,
      closeOnClickOutside: true,

      classes: {
        exclude: [],
        only: [],
        include: []
      },

      hamburger: 'boring',
      bodyClassOpen: '',
      kitchenClass: '',
      kitchenOpenClass: '',

      onOpen: () => {},
      onClose: () => {},
      onClick: () => {}
    }

    this.version = PKG_VERSION
    this._options = assign(DEFAULTS, options)
    this._options.hamburger = setIF(this._options.hamburger, (HAMBURGERS.indexOf(this._options.hamburger) !== -1), 'boring')
    this._options.scheme = setIF(this._options.scheme, (SCHEMES.indexOf(this._options.scheme) !== -1), 'black')
    if (typeof this._options.theme !== 'string' && typeof this._options.theme !== 'object') throw new Error('theme must be a string or a object')
    this._theme = (typeof this._options.theme === 'string') ? this._options.theme : this._options.theme.theme

    this._themeOptions = (typeof this._options.theme === 'object') ? this._options.theme : {}

    if (typeof this._options.onOpen !== 'function') throw new Error('onOpen callback must be a function')
    if (typeof this._options.onClose !== 'function') throw new Error('onClose callback must be a function')
    if (typeof this._options.onClick !== 'function') throw new Error('onClick callback must be a function')

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

    this.init()
    this.inject(THEMES)
    this.cook()
  }

  inject (themes) {
    document.body.insertAdjacentHTML('afterbegin', themes[this._theme].html.replace(/{{options.hamburger}}/g, this._options.hamburger.toLowerCase()))
    this.$openButton = document.querySelector('.MenuChefOpen')
    this._kitchen = document.querySelector(`.${this._kitchenClass}`)
    masterCook(document.body, this._classes.init.body)
    masterCook(this._kitchen, this._classes.init.kitchen)
    masterCook(this.$openButton, this._classes.init.controlBtn.open)

    // to work in IE10
    // this.$openButton.dataset.scheme = this._kitchen.dataset.scheme = this._options.scheme
    this.$openButton.setAttribute('data-scheme', this._options.scheme)
    this._kitchen.setAttribute('data-scheme', this._options.scheme)
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

    // Public Variables
    setPublicVar(MenuChef, self, 'version')
    setPublicVar(MenuChef, self, 'isOpen', '_isOpen')

    // Public Methods
    MenuChef.open = function () {
      masterCook(document.body, self._classes.open.body)
      masterCook(self._kitchen, self._classes.open.kitchen)
      if (self._options.closeOnClickOutside) self.chefObserver('addWatch')
      self._options.onOpen()
      self.$openButton.classList.add('is-active')
      self._isOpen = true
    }
    MenuChef.close = function () {
      masterCook(document.body, self._classes.open.body, 'remove')
      masterCook(self._kitchen, self._classes.open.kitchen, 'remove')
      if (self._options.closeOnClickOutside) self.chefObserver('removeWatch')
      self._options.onClose()
      self.$openButton.classList.remove('is-active')
      self._isOpen = false
    }
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
       *
       * Close MenuChef if is clicked outside
       * Don't close if is clicked in kitchen or in a button with
       * MenuChef.toggle() function on onclick because the watcher
       * closes the MenuChef before the toggle(), who mistakenly opened
       *
       */

      try {
        if (e.path.filter(searchKitchen).length === 0) MenuChef.close()
      } catch (e) {}
    }
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

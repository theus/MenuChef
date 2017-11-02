var expect = chai.expect
chai.should()

var eventFire = function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

describe('new MenuChef', function () {
  it('new MenuChef should init', function () {
    expect(new MenuChef('.js-Menu a')).to.be.an.object;
    MenuChef.destroy();
  })
  it('instance of new MenuChef should init', function () {
    var menu = new MenuChef('.js-Menu a')
    menu.should.be.an.object;
    MenuChef.destroy();
  })

  it('new MenuChef(".js-Menu") should advice in console about that element aren\'t ingredients', function () {
    window.logs.warns = []
    new MenuChef('.js-Menu')
    expect(window.logs.warns[0]).to.be.equal('MenuChef don\'t find ingredients. Maybe you passed the menu itself as ingredients. If the class of menu is ".menu", pass ".menu a". The links are the ingredients =)');
    MenuChef.destroy();
  });

  it('new MenuChef(".js-Mene") receive a element that don\'t exist and throw an error', function () {
    try {
      new MenuChef('.js-Mene')
    } catch (err) {
      expect(err).to.match(/Error: MenuChef needs link elements passed as ingredients/);
    }
  });

  it('new MenuChef(".js-Menu a") works fine', function () {
    expect(new MenuChef('.js-Menu a')._ingredients).to.have.length.above(2);
  });

});

describe('MenuChef.open()', function () {
  it('MenuChef.open() should open the menu', function () {
    MenuChef.open();
    expect(document.querySelector('.MenuChef').classList.contains('is-visible')).to.be.true;
  });
});

describe('MenuChef.close()', function () {
  it('MenuChef.close() should close the menu', function () {
    MenuChef.close();
    expect(document.querySelector('.MenuChef').classList.contains('is-visible')).to.be.false;
  });
});

describe('MenuChef.toggle()', function () {
  it('MenuChef.toggle() should open the menu', function () {
    MenuChef.toggle();
    expect(document.querySelector('.MenuChef').classList.contains('is-visible')).to.be.true;
  });

  it('MenuChef.toggle() should close the menu', function () {
    MenuChef.toggle();
    expect(document.querySelector('.MenuChef').classList.contains('is-visible')).to.be.false;
  });
});

describe('MenuChef.destroy()', function () {
  it('MenuChef.destroy() should remove MenuChef from DOM', function () {
    MenuChef.destroy();
    expect(document.querySelector('.MenuChef')).to.be.null;
  });
});

describe('MenuChef options', function () {
  it('Change options', function () {
    var menu = new MenuChef('.js-Menu a', {
      closeOnClick: false,
    });
    expect(menu._options.closeOnClick).to.be.false;
    MenuChef.destroy();
  });

  it('Options classes object', function () {
    new MenuChef('.js-Menu a', {
      classes: {
        exclude: ['class-foo'],
      },
    });
    expect(document.querySelector('.MenuChef-links-link').classList.contains('class-foo')).to.be.false;
    MenuChef.destroy();

    new MenuChef('.js-Menu a', {
      classes: {
        include: ['yolo'],
      },
    });
    expect(document.querySelector('.MenuChef-links-link').classList.contains('yolo')).to.be.true;
    MenuChef.destroy();

    new MenuChef('.js-Menu a', {
      classes: {
        only: ['class-foo']
      }
    });
    expect(document.querySelector('.MenuChef-links-link').classList.contains('class-foo')).to.be.true;
    expect(document.querySelector('.MenuChef-links-link').classList.contains('class-bar')).to.be.false;
  });

  it('Change scheme', function () {
    var menu = new MenuChef('.js-Menu a', {
      scheme: 'red'
    });
    MenuChef.open();
    expect(menu._options.scheme).to.be.equal('red');
    expect(document.querySelector('.MenuChef').dataset.scheme).to.be.equal('red');
    MenuChef.destroy();
  });
  it('Change theme', function () {
    // test theme string
    var menu = new MenuChef('.js-Menu a', {
      theme: 'side'
    });
    expect(menu._options.theme).to.be.equal('side');
    expect(menu._themeClass).to.be.equal('MenuChef--theme-side');
    MenuChef.destroy();
    var menu = new MenuChef('.js-Menu a', {
      theme: {
        theme: 'side',
        direction: 'left'
      }
    });

    // test theme object
    expect(menu._options.theme).to.be.a.object;
    expect(menu._options.theme.theme).to.be.equal('side')
    expect(menu._options.theme.direction).to.be.equal('left')
    expect(menu._themeClass).to.be.equal('MenuChef--theme-side');
    MenuChef.destroy();
  });
  it('Change custom classes', function () {
    var menu = new MenuChef('.js-Menu a', {
      bodyClassOpen: 'body-example-class-open',
      kitchenClass: 'kitchen-example-class',
      kitchenOpenClass: 'kitchen-example-class-open'
    });
    MenuChef.open();
    expect(document.body.classList.contains('body-example-class-open')).to.be.true;
    expect(document.querySelector('.MenuChef').classList.contains('kitchen-example-class-open')).to.be.true;
    expect(document.querySelector('.MenuChef').classList.contains('kitchen-example-class')).to.be.true;
    MenuChef.close();
    expect(document.body.classList.contains('body-example-class-open')).to.be.false;
    expect(document.querySelector('.MenuChef').classList.contains('kitchen-example-class-open')).to.be.false;
    expect(document.querySelector('.MenuChef').classList.contains('kitchen-example-class')).to.be.true;
    MenuChef.destroy();
  });
  it('Change theme effects', function () {
    var menu = new MenuChef('.js-Menu a', {
      theme: {
        theme: 'side',
        effectOnOpen: 'smooth',
        direction: 'left',
        pageEffect: 'blur'
      },
    });
    expect(document.body.classList.contains('has-MenuChef--effect--blur')).to.be.true;
    expect(document.querySelector('.MenuChef').classList.contains('MenuChef--theme-side-effect--smooth')).to.be.true;
    expect(document.querySelector('.MenuChef').classList.contains('MenuChef--theme-side--dir--left')).to.be.true;
    MenuChef.open();
    expect(document.body.classList.contains('has-menuChefOpen--side')).to.be.true;
    expect(document.querySelector('.MenuChef').classList.contains('MenuChef--theme-side-effect--smooth--open')).to.be.true;
    MenuChef.destroy();
  });

  it('Change custom button', function () {
    var menu = new MenuChef('.js-Menu a', {
      button: '<span id="custombtn">custom btn</span>'
    });

    var custombtn = document.getElementById('custombtn');

    expect(menu.ISBUTTONDEFAULT).to.be.false;
    expect(custombtn.textContent).to.be.equal('custom btn');
    eventFire(custombtn, 'click');
    expect(MenuChef.isOpen).to.be.true;
    eventFire(custombtn, 'click');
    expect(MenuChef.isOpen).to.be.false;
    MenuChef.destroy();
  });

  it('Change parent element', function () {
    expect(document.querySelector('#menu .MenuChef')).to.be.null;

    var menu = new MenuChef('.js-Menu a', {
      parent: '#menu'
    });

    expect(document.querySelector('#menu .MenuChef')).to.be.not.null;
    MenuChef.destroy();
  });

});

describe('MenuChef options callbacks', function () {
  it('onOpen() should execute on open', function () {
    var executed = false;
    var menu = new MenuChef('.js-Menu a', {
      onOpen: function () {
        executed = true;
      }
    });
    MenuChef.open();
    expect(executed).to.be.true;
    MenuChef.destroy();
  });

  it('onClose() should execute on close', function () {
    var executed = false;
    var menu = new MenuChef('.js-Menu a', {
      onClose: function () {
        executed = true;
      }
    });
    MenuChef.open();
    expect(executed).to.be.false;
    MenuChef.close();
    expect(executed).to.be.true;
    MenuChef.destroy();
  });

  it('onClick() should execute on click', function () {
    // http://stackoverflow.com/a/2706236/1856898
    // simulate click to work in terminal testing
    var executed = false;
    var menu = new MenuChef('.js-Menu a', {
      onClick: function () {
        executed = true;
      }
    });

    MenuChef.open();
    expect(executed).to.be.false;
    eventFire(document.querySelector('.MenuChef-links-link'), 'click');
    expect(executed).to.be.true;
    MenuChef.close();
    MenuChef.destroy();
  });

  it('onReady() should execute on ready', function () {
    MenuChef.destroy();
    var executed = false;
    expect(executed).to.be.false;
    expect(document.querySelector('.MenuChef')).to.be.null;
    
    var menu = new MenuChef('.js-Menu a', {
      onReady: function () {
        executed = true;
      }
    });

    expect(document.querySelector('.MenuChef')).to.be.not.null;
    expect(executed).to.be.true;
    MenuChef.destroy();
  });
});

describe('Public Variables', function () {
  it('MenuChef.version should return the actual version of MenuChef', function () {
    expect(MenuChef.version).to.be.a.string;
  });
  it('MenuChef.isOpen should return a boolean indicating whether it\'s open or not or null if never was opened', function () {
    new MenuChef('.js-Menu a');
    expect(MenuChef.isOpen).to.be.null;
    MenuChef.open();
    expect(MenuChef.isOpen).to.be.true;
    MenuChef.close();
    expect(MenuChef.isOpen).to.be.false;
    MenuChef.destroy();
  });
});
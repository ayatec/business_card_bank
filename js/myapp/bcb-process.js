
class BCBProcess extends CommonProcess {
  constructor(
    _initSetting = {
      NAME: `${Project.NAME} Process`
    }
  ) {
    super(_initSetting);
    
    this.run();
  }
  
  run() {
    this.initContent();
    this.createDesc();
    BCBProcess.initPopover();
    this.initController();
    this.show();
  }
  
  initContent() {
    $('main').empty();
    $('main').append(Content.getContent('desc-area'));
    $('main').append(Content.getContent('user-area'));
    $('main').append(Content.getContent('card-area'));
    $('main').append(Content.getContent('card-detail-area'));
  }
  
  createDesc() {
    $('#desc-area').append(Content.getHeader('テストデータ'));
    $('#desc-area').append(Content.getItem({
      name: 'test',
      keys: 'pass'
    }));
    $('#desc-area').append(Content.getItem({
      name: 'test2',
      keys: 'pass2'
    }));
    $('#desc-area').append(Content.getItem({
      name: 'aya',
      keys: 'P@ssw0rd'
    }));
  }
  
  static initPopover() {
    new PopoverController({
      NAME: 'ID Popover',
      SELECTOR: '#user-id-help',
      HELP: 'ID を入力してください。'
    });
    new PopoverController({
      NAME: 'Password Popover',
      SELECTOR: '#user-password-help',
      HELP: 'パスワード を入力してください。'
    });
    new PopoverController({
      NAME: 'Login Check Popover',
      SELECTOR: '#user-check-help',
      HELP: '共有デバイスでは設定に注意してください。'
    });
    new PopoverController({
      NAME: 'Logined ID Popover',
      SELECTOR: '#logined-id-help',
      HELP: 'ログインしている ID です。'
    });
  }
  
  initController() {
    this.CONTROLLER = {
      CARD_DETAIL: new CardDetailController(),
      CARD: new CardController(),
      USER: new UserController()
    };
    
    this.CONTROLLER.SWITCH = {
      DESC: new SwitchController({
        TEMPLATE: 'desc'
      }),
      USER: new SwitchController({
        TEMPLATE: 'user',
        currentView: true,
        LS_KEY: 'none'
      }),
      CARD: new SwitchController({
        NAME: 'Card Switch',
        SWITCH_SELECTOR: '#card-area',
        currentView: false
      }),
      CARD_DETAIL: new SwitchController({
        NAME: 'Card Detail Switch',
        SWITCH_SELECTOR: '#card-detail-area',
        currentView: false
      })
    };
    
    this.CONTROLLER.SCROLL = {
      DESC: new ScrollController({
        NAME: 'Desc Switch',
        SCROLL_SELECTOR: '#desc-area'
      }),
      USER: new ScrollController({
        NAME: 'User Switch',
        SCROLL_SELECTOR: '#user-area'
      }),
      CARD: new ScrollController({
        NAME: 'Card Switch',
        SCROLL_SELECTOR: '#card-area'
      }),
      CARD_DETAIL: new ScrollController({
        NAME: 'Card Detail Switch',
        SCROLL_SELECTOR: '#card-detail-area'
      })
    };
  }
  
  show() {
    $('main').slideDown(300);
    Log.log();
    Log.logClass(this.NAME, 'Start');
  }
}

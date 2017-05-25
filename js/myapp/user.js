
// ----------------------------------------------------------------
// User Class

class UserModel extends SwitchModel {
  constructor({
    name,
    lsKeyView,
    triggerSelector,
    switchSelector,
    userIdSelector = null,
    userPasswordSelector = null,
    loginTrigger = 'click',
    loginSelector = null,
    logoutTrigger = 'click',
    logoutSelector = null,
    signupTrigger = 'click',
    signupSelector = null
  } = {}) {
    super({
      name: name,
      lsKeyView: lsKeyView,
      triggerSelector: triggerSelector,
      switchSelector: switchSelector
    });
    
    this.NAME = name;
    this.LOGIN_TRIGGER = loginTrigger;
    this.LOGIN_SELECTOR = loginSelector;
    
    this.LOGOUT_TRIGGER = logoutTrigger;
    this.LOGOUT_SELECTOR = logoutSelector;
    
    this.SIGNUP_TRIGGER = signupTrigger;
    this.SIGNUP_SELECTOR = signupSelector;
    
    this.USER_ID_SELECTOR = userIdSelector;
    this.USER_PASSWORD_SELECTOR = userPasswordSelector;
    // this.LOGIN_CHECK_SELECTOR = '#login-check';
    
    this.USER_AREA_SELECTOR = '#user-area';
    this.$USER_AREA_SELECTOR = $(this.USER_AREA_SELECTOR);
    this.TEMPLATE_LOGINED_SELECTOR = '#logined-template';
    this.$TEMPLATE_LOGINED_SELECTOR = $(this.TEMPLATE_LOGINED_SELECTOR);
    this.TEMPLATE_NOT_LOGIN_SELECTOR = '#not-login-template';
    this.$TEMPLATE_NOT_LOGIN_SELECTOR = $(this.TEMPLATE_NOT_LOGIN_SELECTOR);
    
    this.ID_LENGTH_MAX = 31;
    this.ID_LENGTH_MIN = 3;
  }
}

class UserView extends SwitchView {
  constructor(_model = new UserModel()) {
    super(_model);
  }
  
  generateUserArea(_alertType = 'success', _message = null) {
    let template = null;
    if (this.model.LOGIN) {
      // ログインしているとき
      Log.logClass(this.NAME, 'Logined');
      template = this.model.$TEMPLATE_LOGINED_SELECTOR.text();
      $(`${this.model.TRIGGER_SELECTOR} a`).text('Logout');
      
    } else {
      // ログインしていないとき
      Log.logClass(this.model.NAME, 'Not login');
      template = this.model.$TEMPLATE_NOT_LOGIN_SELECTOR.text();
      $(`${this.model.TRIGGER_SELECTOR} a`).text('Login');
      
    }
    const compiled = _.template(template);
    const model = {
      id: this.model.ID,
      password: this.model.PASSWORD
    };
    
    this.model.$USER_AREA_SELECTOR.empty();
    this.generateAlert(this.model.$USER_AREA_SELECTOR, _alertType, _message);
    this.model.$USER_AREA_SELECTOR.append(compiled(model));
    
    $(this.model.USER_ID_SELECTOR).focus();
    
    BCBProcess.initPopover();
  }
}

// ----------------------------------------------------------------
// Controller

class UserController extends CommonController {
  constructor(_obj) {
    super(_obj);
    
    this.model = new UserModel(_obj);
    this.view = new UserView(this.model);
    
    this.NAME = 'User Controller';
    this.model.LOGIN = false;
    this.model.ID = null;
    this.model.PASSWORD = null;
    this.model.PASSWORD_HASH = null;
  }
  
  checkValidate() {
    this.model.ID = $(this.model.USER_ID_SELECTOR).val();
    this.model.PASSWORD = $(this.model.USER_PASSWORD_SELECTOR).val();
    if (this.model.ID.length == 0) {
      this.view.generateUserArea('danger', 'ID を入力してください。');
      return false;
    } else if (this.model.ID.length < this.model.ID_LENGTH_MIN) {
      this.view.generateUserArea('danger', `ID は ${this.model.ID_LENGTH_MIN} 文字以上で入力してください。`);
      return false;
    } else if (this.model.ID.length > this.model.ID_LENGTH_MAX) {
      this.view.generateUserArea('danger', `ID は ${this.model.ID_LENGTH_MAX} 文字以下で入力してください。`);
      return false;
    } else if (this.model.PASSWORD.length == 0) {
      this.view.generateUserArea('danger', 'パスワード を入力してください。');
      return false;
    }
    return true;
  }
  
  submitLogin() {
    Log.logClassKey(this.NAME, 'Submit', 'Login');
    
    if (this.checkValidate() == false) {
      return;
    }
    
    CE.CONTROLLER.setUser();
    this.model.PASSWORD_HASH = SHA256.getHash(this.model.PASSWORD);
    
    this.view.generateLoading(this.model.$USER_AREA_SELECTOR, 'ログイン中...', `${this.model.ID} でログイン`);
    
    $.ajax({
      url: 'ruby/loginUser.rb',
      data: {
        id: this.model.ID,
        password: this.model.PASSWORD_HASH
      },
      success: (_data) => {
        Log.logClass(this.NAME, 'loginUser ajax success');
        if (_data.length > 0) {
          this.model.ID = _data;
          this.model.LOGIN = true;
          CE.CONTROLLER.setUser(this.model.ID, this.model.PASSWORD_HASH);
          this.view.generateUserArea('success', `ユーザー ${this.model.ID} でログインしました。`);
        } else {
          this.view.generateUserArea('danger', 'IDとパスワードの組み合わせが正しくありません。');
        }
      },
      error: () => {
        Log.logClass(this.NAME, 'loginUser ajax failed');
        this.view.generateUserArea('danger', 'ajax通信に失敗しました。');
      }
    });
  }
  
  submitLogout() {
    Log.logClassKey(this.NAME, 'Submit', 'Logout');
    this.model.LOGIN = false;
    this.model.ID = null;
    this.model.PASSWORD = null;
    CE.CONTROLLER.setUser();
    this.view.generateUserArea('success', 'ログアウトしました。');
  }
  
  submitSignup() {
    Log.logClassKey(this.NAME, 'Submit', 'Sign Up');
    
    if (this.checkValidate() == false) {
      return;
    }
    
    CE.CONTROLLER.setUser();
    this.model.PASSWORD_HASH = SHA256.getHash(this.model.PASSWORD);
    
    this.view.generateLoading(this.model.$USER_AREA_SELECTOR,'登録中...',  `${this.ID} でユーザー登録`);
    
    $.ajax({
      url: 'ruby/signupUser.rb',
      data: {
        id: this.model.ID,
        password: this.model.PASSWORD_HASH
      },
      success: (_data) => {
        Log.logClass(this.NAME, 'signupUser ajax success');
        if (_data.length > 0) {
          this.model.ID = _data;
          this.model.LOGIN = true;
          CE.CONTROLLER.setUser(this.model.ID, this.model.PASSWORD_HASH);
          this.view.generateUserArea('success', `ユーザー ${this.model.ID} を登録しました。`);
        } else {
          this.view.generateUserArea('danger', `ユーザー ${this.model.ID} は登録済みです`);
        }
      },
      error: () => {
        Log.logClass(this.NAME, 'signupUser ajax failed');
        this.view.generateUserArea('danger', 'ajax通信に失敗しました。');
      }
    });
  }
}

// ----------------------------------------------------------------
// Event

class UserEvent extends CommonEvent {
  constructor({
    name = 'User Event'
  } = {})
  {
    super({
      name: name
    });
    
    this.NAME = name;
    this.CONTROLLER = new UserController({
      name: 'User Switch',
      lsKeyView: 'user',
      triggerSelector: '#action-user',
      switchSelector: '#user-area',
      userIdSelector: '#user-id',
      userPasswordSelector: '#user-password',
      loginSelector: '#login-submit',
      logoutSelector: '#logout-submit',
      signupSelector: '#signup-submit'
    });
    
    this.setOn();
    this.CONTROLLER.view.generateUserArea();
  }
  
  setOn() {
    SetEvent.setOn(
      this.CONTROLLER.model.LOGIN_TRIGGER,
      this.CONTROLLER.model.LOGIN_SELECTOR,
      () => {
        this.CONTROLLER.submitLogin();
      }
    );
    SetEvent.setOn(
      this.CONTROLLER.model.LOGOUT_TRIGGER,
      this.CONTROLLER.model.LOGOUT_SELECTOR,
      () => {
        this.CONTROLLER.submitLogout();
      }
    );
    SetEvent.setOn(
      this.CONTROLLER.model.SIGNUP_TRIGGER,
      this.CONTROLLER.model.SIGNUP_SELECTOR,
      () => {
        this.CONTROLLER.submitSignup();
      }
    );
    SetEvent.setOn(
      'keypress',
      this.CONTROLLER.model.USER_ID_SELECTOR,
      (e) => {
        if (e.keyCode == 13) {
          $(this.CONTROLLER.model.USER_PASSWORD_SELECTOR).focus();
        }
      }
    );
    SetEvent.setOn(
      'keypress',
      this.CONTROLLER.model.USER_PASSWORD_SELECTOR,
      (e) => {
        if (e.keyCode == 13) {
          $(this.CONTROLLER.model.LOGIN_SELECTOR).trigger(this.CONTROLLER.model.LOGIN_TRIGGER);
        }
      }
    );
  }
}
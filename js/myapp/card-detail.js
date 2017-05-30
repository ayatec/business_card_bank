
// ----------------------------------------------------------------
// CardDetail Class

// ----------------------------------------------------------------
// Model

class CardDetailModel extends CommonModel {
  constructor(
    _initSetting = {
      NAME: 'Card Detail Object'
    }
  ) {
    super(_initSetting);
    
    this.CARD_DETAIL_AREA_SELECTOR = '#card-detail-area';
    this.TEMPLATE_CARD_DETAIL_SELECTOR = '#card-detail-template';
    
    this.CARD_DETAIL_ADD_SELECTOR = '#detail-submit-add';
    this.CARD_DETAIL_SAVE_SELECTOR = '#detail-submit-save';
    this.CARD_DETAIL_DELETE_SELECTOR = '#detail-submit-delete';
    this.CARD_DETAIL_CLOSE_SELECTOR = '#detail-submit-close';
    
    this.ID = null;
    this.HASH = null;
    this.CARD = null;
    this.COPY = false;
    
    this.CARD_EDIT = null;
    
    this.TYPE_ADD = 'add';
    this.TYPE_UPDATE = 'update';
    this.TYPE_DELETE = 'delete';
  }
}

// ----------------------------------------------------------------
// View

class CardDetailView extends CommonView {
  constructor(
    _initSetting = {
      NAME: 'Card Detail View'
    }
  ) {
    super(_initSetting);
  }
  
  generateCardDetailArea(
    _alertType = this.MODEL.ALERT_SUCCESS,
    _message = null,
    _close = true
  ) {
    $(this.MODEL.CARD_DETAIL_AREA_SELECTOR).empty();
    
    let body = '';
    let ruby = '';
    if (this.MODEL.CARD == null) {
      body = '新規作成';
    } else {
      body = this.MODEL.CARD['name'];
      ruby = this.MODEL.CARD['nameKana'];
    }
    $(this.MODEL.CARD_DETAIL_AREA_SELECTOR).append(
      Content.getHeader(
        this.getTemplate(
          this.MODEL.TEMPLATE_RUBY,
          {
            body: body,
            ruby: ruby
          }
        )
      )
    );
    super.generateAlert(
      this.MODEL.CARD_DETAIL_AREA_SELECTOR,
      _alertType,
      _message,
      _close
    );
    if (this.MODEL.CARD != null) {
      // カードがある場合
      $(this.MODEL.CARD_DETAIL_AREA_SELECTOR).append(this.getTemplate(
        this.MODEL.TEMPLATE_CARD_DETAIL_SELECTOR,
        {
          card: this.MODEL.CARD,
          add: this.MODEL.COPY
        }
      ));
    } else {
      // カードがない場合
      $(this.MODEL.CARD_DETAIL_AREA_SELECTOR).append(this.getTemplate(
        this.MODEL.TEMPLATE_CARD_DETAIL_SELECTOR,
        {
          card: {
            registerDate: (new Date()).getString(),
            updateDate: (new Date()).getString()
          },
          add: true
        }
      ));
    }
  }
  
  getCardEdit() {
    let card = {
      address1: $('#detail-address1').val(),
      address2: $('#detail-address2').val(),
      cellphone: $('#detail-cellphone').val(),
      companyName: $('#detail-company-name').val(),
      companyNameKana: $('#detail-company-name-kana').val(),
      department: $('#detail-department').val(),
      fax: $('#detail-fax').val(),
      mail: $('#detail-mail').val(),
      name: $('#detail-name').val(),
      nameKana: $('#detail-name-kana').val(),
      note: $('#detail-note').val(),
      post: $('#detail-post').val(),
      telephone: $('#detail-telephone').val(),
      url: $('#detail-url').val(),
      userId: $('#detail-user-id').val(),
      zipCode: $('#detail-zip-code').val(),
      registerDate: (new Date()).getString(),
      updateDate: (new Date()).getString()
    }
    if (this.MODEL.CARD != null) {
      card['id'] = this.MODEL.CARD['id'];
    }
    return card;
  }
}

// ----------------------------------------------------------------
// Event

class CardDetailEvent extends CommonEvent {
  constructor(
    _initSetting = {
      NAME: 'Card Detail Event'
    }
  ) {
    super(_initSetting);
  }
  
  setEvent() {
    this.setAddClick();
    this.setSaveClick();
    this.setDeleteClick();
    this.setCloseClick();
  }
  
  setAddClick() {
    super.setOn(
      'click',
      this.CONTROLLER.MODEL.CARD_DETAIL_ADD_SELECTOR,
      () => {
        this.CONTROLLER.saveCard(
          this.MODEL.ID,
          this.MODEL.HASH,
          this.VIEW.getCardEdit(),
          this.MODEL.TYPE_ADD
        );
      }
    );
  }
  
  setSaveClick() {
    super.setOn(
      'click',
      this.CONTROLLER.MODEL.CARD_DETAIL_SAVE_SELECTOR,
      () => {
        this.CONTROLLER.saveCard(
          this.MODEL.ID,
          this.MODEL.HASH,
          this.VIEW.getCardEdit(),
          this.MODEL.TYPE_UPDATE
        );
      }
    );
  }
  
  setDeleteClick() {
    super.setOn(
      'click',
      this.CONTROLLER.MODEL.CARD_DETAIL_DELETE_SELECTOR,
      () => {
        this.CONTROLLER.deleteCard();
      }
    );
  }
  
  setCloseClick() {
    super.setOn(
      'click',
      this.CONTROLLER.MODEL.CARD_DETAIL_CLOSE_SELECTOR,
      () => {
        PS.CONTROLLER.SCROLL.CARD.VIEW.scroll();
        PS.CONTROLLER.SWITCH.CARD_DETAIL.VIEW.setView(false);
      }
    );
  }
}

// ----------------------------------------------------------------
// Controller

class CardDetailController extends CommonController {
  constructor(
    _model = {},
    _initSetting = {
      NAME: 'Card Detail Controller',
      MODEL: new CardDetailModel(),
      VIEW: new CardDetailView(),
      EVENT: new CardDetailEvent()
    }
  ) {
    super(_model, _initSetting);
    
    this.EVENT.setEvent();
  }
  
  openCard(
    _id = null,
    _hash = null,
    _card = null,
    _copy = false
  ) {
    this.MODEL.ID = _id;
    this.MODEL.HASH = _hash;
    this.MODEL.CARD = _card;
    this.MODEL.COPY = _copy;
    
    if (_id != null && _hash != null) {
      if (_card == null) {
        // カードがない場合
        if (PS.CONTROLLER.USER.MODEL.LOGIN) {
          // ログイン済み
          // カードの追加
          this.VIEW.generateCardDetailArea(
            this.MODEL.ALERT_SUCCESS,
            'カードを追加できます。'
          );
          PS.CONTROLLER.SWITCH.CARD_DETAIL.VIEW.setView(true);
        } else {
          // ログインしていない
          // カードの選択
          this.VIEW.generateCardDetailArea(
            this.MODEL.ALERT_WARNING,
            'カードを選択してください。'
          );
          PS.CONTROLLER.SWITCH.CARD_DETAIL.VIEW.setView(false);
        }
      } else {
        if (_copy) {
          // カードの編集
          this.VIEW.generateCardDetailArea(
            this.MODEL.ALERT_SUCCESS,
            'コピーしたカードを追加できます。'
          );
          PS.CONTROLLER.SWITCH.CARD_DETAIL.VIEW.setView(true);
        } else {
          // カードの編集
          this.VIEW.generateCardDetailArea(
            this.MODEL.ALERT_SUCCESS,
            'カードを編集できます。'
          );
          PS.CONTROLLER.SWITCH.CARD_DETAIL.VIEW.setView(true);
        }
      }
    } else {
      // 情報がない
      this.VIEW.generateCardDetailArea(
        this.MODEL.ALERT_WARNING,
        'ログインしてください。'
      );
      PS.CONTROLLER.SWITCH.CARD_DETAIL.VIEW.setView(false);
    }
  }
  
  checkValidate(
    _card = this.MODEL.CARD
  ) {
    if (_card['name'].length < 1) {
      this.MODEL.CARD = _card;
      this.MODEL.COPY = true;
      this.VIEW.generateCardDetailArea(
        this.MODEL.ALERT_WARNING,
        '氏名 を入力してください。'
      );
      PS.CONTROLLER.SCROLL.CARD_DETAIL.VIEW.scroll();
      return false;
    }
    return true;
  }
  
  saveCard(
    _id = this.MODEL.ID,
    _hash = this.MODEL.HASH,
    _card = this.MODEL.CARD,
    _type = null
  ) {
    
    if (_type == this.MODEL.TYPE_ADD) {
      this.VIEW.generateLoading($(this.MODEL.CARD_DETAIL_AREA_SELECTOR),'名刺追加中',  `名刺を追加中`);
    } else if (_type == this.MODEL.TYPE_UPDATE) {
      this.VIEW.generateLoading($(this.MODEL.CARD_DETAIL_AREA_SELECTOR),'名刺更新中',  `名刺を更新中`);
    } else if (_type == this.MODEL.TYPE_DELETE) {
      this.VIEW.generateLoading($(this.MODEL.CARD_DETAIL_AREA_SELECTOR),'名刺削除中',  `名刺を削除中`);
    }
    
    if (!this.checkValidate(_card)) {
      return;
    }
    
    $.ajax({
      url: 'ruby/saveCard.rb',
      data: {
        type: _type,
        userName: _id,
        password: _hash,
        id: _card['id'],
        address1: _card['address1'],
        address2: _card['address2'],
        cellphone: _card['cellphone'],
        companyName: _card['companyName'],
        companyNameKana: _card['companyNameKana'],
        department: _card['department'],
        fax: _card['fax'],
        mail: _card['mail'],
        name: _card['name'],
        nameKana: _card['nameKana'],
        note: _card['note'],
        post: _card['post'],
        registerDate: _card['registerDate'],
        telephone: _card['telephone'],
        updateDate: (new Date()).getString(),
        url: _card['url'],
        zipCode: _card['zipCode']
      },
      success: (_data) => {
        Log.logClassKey(this.NAME, 'ajax saveCard', 'success');
        if (_data.length > 0) {
          PS.CONTROLLER.CARD.setUser();
          PS.CONTROLLER.SCROLL.CARD.VIEW.scroll();
          PS.CONTROLLER.SWITCH.CARD.VIEW.setView(true);
          PS.CONTROLLER.SWITCH.CARD_DETAIL.VIEW.setView(false);
        } else {
          this.VIEW.generateCardDetailArea(
            this.MODEL.ALERT_WARNING,
            `名刺の登録に失敗しました。`
          );
        }
      },
      error: () => {
        Log.logClassKey(this.NAME, 'ajax saveCard', 'failed');
        this.VIEW.generateCardDetailArea(
          this.MODEL.ALERT_DANGER,
          'ajax通信に失敗しました。',
          false
        );
      }
    });
  }
  
  deleteCard(
    _id = this.MODEL.ID,
    _hash = this.MODEL.HASH,
    _card = this.MODEL.CARD
  ) {
    if (_id != null && _hash != null && _card != null) {
      const confirmCardDelete = new ConfirmController({
        CONFIRM_ID: 'confirm-card-delete',
        CONFIRM_TITLE: '名刺の削除',
        CONFIRM_MESSAGE: `${_card.name}(${_card.companyName}) さんの名刺を本当に削除しますか？`,
        AUTO_OPEN: true,
        YES: 'はい',
        NO: 'NO',
        FUNCTION_YES: () => {
          this.saveCard(
            _id,
            _hash,
            _card,
            this.MODEL.TYPE_DELETE
          );
        }
      });
    }
  }
}

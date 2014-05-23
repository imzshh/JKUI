/**
 * Copyright (c) 2007 Tulipmm.cn. All rights reserved.
 * @Author fossil
 */
 
 // JueKit.UI.Button
JueKit.Type.registerNamespace("JueKit.UI");
//��ť���
JueKit.UI.Button = JueKit.Type.createClass("JueKit.UI.Button", JueKit.UI.CommandItem,
{
    cssCls: "jueBtn", // ��ť������ʽ����
    // ���¼�
    bindDomEventHandlers: function () {
        // ��ť����������¼�
        JueKit.Event.addHandler(this._el, 'mouseover', this.__hBtnMouseOver, this);
        // ��ť������Ƴ��¼�
        JueKit.Event.addHandler(this._el, 'mouseout', this.__hBtnMouseOut, this);
        // ��ť����갴���¼�
        JueKit.Event.addHandler(this._el, 'mousedown', this.__hBtnMouseDown, this);
        // ��ť����굥���¼�
        JueKit.Event.addHandler(this._el, 'click', this.__hBtnClick, this);
        // ��ť����꽹���¼�
        JueKit.Event.addHandler(this._elBtn, 'focus', this.__hBtnFocus, this);
        // ��ť�����ʧȥ�����¼�
        JueKit.Event.addHandler(this._elBtn, 'blur', this.__hBtnBlur, this);
    },
    // ����DOM�ڵ�
    createDom: function (objData) {
        //���ð�ť��ʽ
        if (objData.cssCls) {
            this.cssCls = objData.cssCls;
        }
        //���ð�ťicon
        if (objData.iconCssClass) {
            this.iconCssCls = objData.iconCssCls;
        }
        //�õ���ť����
        this._el = JueKit.UI.Button.__getButtonDom(this.cssCls, objData.iconCssCls);
        //�õ�button����
        this._elBtn = this._el.childNodes[0].childNodes[0].childNodes[0];
        //�õ���ť�ı�����
        this._elText = this._elBtn.childNodes[1];
        //���ð�ť�ı�
        this._elText.innerHTML = objData.text;
        //�����෽������
        JueKit.UI.Button._base.createDom.call(this, objData);
    },
    //����DOM
    parseDom: function (objData) {
        this._elBtn = JueKit.Dom.getFirstChild(JueKit.Dom.getFirstChild(JueKit.Dom.getFirstChild(this._el)));
        this._elText = JueKit.Dom.getChildElByIndex(this._elBtn, 1);

    },
    // ��ʼ����ť
    onInit: function (objData) {
        //���ð�ťicon
        if (objData.iconCssClass) {
            this.iconCssCls = objData.iconCssClass;
        }
       // ���ð�ť�Ƿ� ����
        this.set_disabled(objData.disabled);
    },
    // ��ʾ��ť
    show: function (visible) {  
        JueKit.UI.Button._base.show.call(this, visible);
        if (visible === undefined || visible) {
            this._el.style.display = "inline-block";
        }
    },
    // ��ť����������¼�
    __hBtnMouseOver: function (evt) {
        if (this.get_disabled()) {
            return;
        }

        var ac = JueKit.UI.Common.get_activeControl();
        var mb = JueKit.UI.Common.get_mouseButton();

        if (mb == 1) {
            if (ac == this) {
                JueKit.Dom.addCssClass(this._el, this.cssCls + "Down");
            }
        }
        else {
            JueKit.Dom.addCssClass(this._el, this.cssCls + "Hover");
        }

        this.fireEvent("mouseOver");
    },
    // ��ť������Ƴ��¼�
    __hBtnMouseOut: function (evt) {
        JueKit.Dom.removeCssClass(this._el, this.cssCls + "Hover");
        JueKit.Dom.removeCssClass(this._el, this.cssCls + "Down");
    },
    // ��ť����갴���¼�
    __hBtnMouseDown: function (evt) {
        if (this.get_disabled()) {
            return;
        }

        if (JueKit.Event.button(evt) != 1) {
            return;
        }

        this._elBtn.focus();
        JueKit.Dom.replaceCssClass(this._el, this.cssCls + "Hover", this.cssCls + "Down");

        JueKit.UI.Common.set_activeControl(this);
    },
    // ��ť����굥���¼�
    __hBtnClick: function (evt) {
        if (this.get_disabled()) {
            return;
        }

        JueKit.Dom.replaceCssClass(this._el, this.cssCls + "Down", this.cssCls + "Hover");

        var args = { result: true, event: evt };
        this.fireEvent("beforeClick", args);

        if (!args.result) {
            return;
        }
        if (this._autoPostBack) {
            this.postBack("click", args.postData, this.__cbServerClickS, null, function (text) { alert(text); });
        }
        else {
            this.fireEvent("click");
        }
    },
    // ��ť����굥���¼�
    __cbServerClickS: function (text) {
        this.fireEvent("click", text);
    },
    // ��ť����꽹���¼�
    __hBtnFocus: function (evt) {
        JueKit.Dom.addCssClass(this._el, this.cssCls + "Active");
    },
    // ��ť�����ʧȥ�����¼�
    __hBtnBlur: function (evt) {
        JueKit.Dom.removeCssClass(this._el, this.cssCls + "Active");
    },
    // ���ð�ť���
    set_width: function (value) {
        this._width = value;
        if (value < 0) {
            return;
        }
        var cw = this._el.offsetWidth - this._elBtn.offsetWidth;
        if (cw < 0) {
            return;
        }
        this._elBtn.style.width = (value - cw) + "px";
    },
    // ��ť��꽹���¼�
    focus: function () {
        this._elBtn.focus();
    },
    // ��ť���ʧȥ�����¼�
    blur: function () {
        this._elBtn.blur();
    },
    // �õ���ť �Ƿ����
    get_disabled: function () {
        return this._elBtn.disabled;
    },
    // ���ð�ť�Ƿ� ����
    set_disabled: function (value) {
        this._elBtn.disabled = value;
        if (value) {
            JueKit.Dom.addCssClass(this._el, this.cssCls + "Gray");
            if (this.iconCssCls && this._el.childNodes[0] && this._el.childNodes[0].childNodes[0] && this._el.childNodes[0].childNodes[0].childNodes[0] && this._el.childNodes[0].childNodes[0].childNodes[0].childNodes[0]) {
                JueKit.Dom.addCssClass(this._el.childNodes[0].childNodes[0].childNodes[0].childNodes[0], this.iconCssCls + "Gray");
            }
        }
        else {
            JueKit.Dom.removeCssClass(this._el, this.cssCls + "Gray");
            if (this.iconCssCls && this._el.childNodes[0] && this._el.childNodes[0].childNodes[0] && this._el.childNodes[0].childNodes[0].childNodes[0] && this._el.childNodes[0].childNodes[0].childNodes[0].childNodes[0]) {
                JueKit.Dom.removeCssClass(this._el.childNodes[0].childNodes[0].childNodes[0].childNodes[0], this.iconCssCls + "Gray");
            }
        }
    }//, 
    //���ð�ť��ʾ�ı�
//    set_text: function (value) {
//        if (value != undefined && value != "") {
//            this._elText.innerHTML = value;
//        }
//    } 
});
// ��ťģ��
JueKit.UI.Button._btnTemplate = {};
// ���ذ�ťģ��
JueKit.UI.Button.__getButtonDom = function (cssCls, iconCssCls) {
    if (!this._btnTemplate[cssCls]) {
        var elContainer = JueKit.Dom.createEl("div", null,
            JueKit.String.format("<span class='{0}Wrap'><span class='{0}'><span class='{0}Inner'><button class='{0}Btn'><span class='{0}Icon'></span><span class='{0}Text'></span></button></span></span></span>", cssCls));
        this._btnTemplate[cssCls] = elContainer.childNodes[0];
    }
    var el = this._btnTemplate[cssCls].cloneNode(true);
    if (iconCssCls !== undefined) {
        el.childNodes[0].childNodes[0].childNodes[0].childNodes[0].className += " " + iconCssCls;
    }
    return el;
};

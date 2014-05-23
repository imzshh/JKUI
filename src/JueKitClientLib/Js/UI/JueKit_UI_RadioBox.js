/**
 * Copyright (c) 2007 Tulipmm.cn. All rights reserved.
 * @Author fossil
 */
 
// JueKit.UI.RadioBox
JueKit.Type.registerNamespace("JueKit.UI");

JueKit.UI.RadioBox = JueKit.Type.createClass("JueKit.UI.RadioBox", JueKit.UI.RichClientWebControl,
{
    cssCls : "jueChk",
    //��ʼ������
    onInitProperty : function(objData){
        this._value = objData.value;
        
        this._text = objData.text || "";

        JueKit.UI.RadioBox._base.onInitProperty.call(this, objData);
    },
    // ����DOM
    createDom : function(objData){
        var cssCls = this.cssCls;
        this._el = JueKit.Dom.createEl("span", {className:cssCls + "Wrap"});
        
        if(!objData.name)
        {
            objData.name = objData.id + "name";
        }
        var IEversion = JueKit.Browser.version;
        if (JueKit.Browser.isIE && IEversion < "8") {
            this._elInput = JueKit.Dom.createEl("<input name='" + objData.name + "' />", { type: "radio", id: objData.id });
         } else {
            this._elInput = JueKit.Dom.createEl("input", { type: "radio", id: objData.id });
            this._elInput.name=objData.name;
        }
       
        
        this._elLabel = JueKit.Dom.createEl("label", {className:cssCls + "Lbl", htmlFor:objData.id}, JueKit.String.HTMLEncode(this._text));
        
        this._el.appendChild(this._elInput);
        this._el.appendChild(this._elLabel);
        JueKit.UI.RadioBox._base.createDom.call(this, objData);
    },
    // ����DOM
    parseDom : function(objData){
        this._elInput = JueKit.Dom.getChildElByIndex(this._el, 0);
        this._elLabel = JueKit.Dom.getNextEl(this._elInput);
    },
    // ���¼�
    bindDomEventHandlers : function(){
        JueKit.Event.addHandler(this._elInput, "click", this.__hElInputClick, this);
    },
    //��ʼ������
    onInit : function(objData){
        this._elInput.checked = objData.checked;
        this._elInput.readonly = objData.readOnly;
    },
    // ����¼�
    __hElInputClick: function(evt) {
        if(!this.get_readOnly())
        {
            this.fireEvent("change");
        }
    },
    //���RadioBox�� value ֵ
    get_value : function(){
        return this._elInput.value;
    },
    //����RadioBox�� value ֵ
    set_value : function(value){
        this._elInput.value = value;
    },
    //���RadioBox�� �ı� ֵ
    get_text : function(){
        return this._text;
    },
    //����RadioBox�� �ı� ֵ
    set_text : function(value){
        this._text = value;
        this._elLabel.innerHTML = value;
    },
    //���RadioBox�� �Ƿ���
    get_checked : function(){
        return this._elInput.checked;
    },
    //����RadioBox�� �Ƿ���
    set_checked : function(value){
        if(this._elInput.checked != value)
        {
            this._elInput.checked = value;
            this.fireEvent("change");
        }
    },
    //���RadioBox�� �Ƿ�ֻ��
    get_readOnly : function(){
        return this._elInput.readonly;
    },
    //����RadioBox�� �Ƿ�ֻ��
    set_readOnly : function(value){
        this._elInput.readonly = value;
        if(value)
        {
            this._elInput.setAttribute("disabled","disabled");
        }
        else
        {
           if(this._elInput.getAttribute("disabled"))
           {
              this._elInput.removeAttribute("disabled");
           }
        }
        //this.__refreshCtl();
    },
  //����RadioBox�� �� datagrid ��������
    set_valueColName : function(value){
        this._valueColName = value;
    }
});




// JueKit.UI.RadioBoxList
JueKit.Type.registerNamespace("JueKit.UI");

JueKit.UI.RadioBoxList = JueKit.Type.createClass("JueKit.UI.RadioBoxList", JueKit.UI.RichClientWebControl,
{
    cssCls: "jueChkBoxList",
    // ��������ֵ�
    ctor: function(objData) {
        this._items = new JueKit.Collection.LinkedList();

        JueKit.UI.RadioBoxList._base.ctor.call(this, objData);
    },
    //����DOM
    createDom: function(objData) {
        this._el = JueKit.Dom.createEl("ul", { id: objData.id, className: this.cssCls });

        JueKit.UI.RadioBoxList._base.createDom.call(this, objData);
    },
    //��ʼ������
    onInit: function(objData) {
        if (objData.items) {
            for (var i = 0; i < objData.items.length; i++) {
                this.addItem(new JueKit.UI.RadioBox(objData.items[i]));
            }
        }
        this.set_selectedText(objData.selectedText, true);
    },
    //���¼�
    bindDomEventHandlers: function() {
        JueKit.Event.addHandler(this._el, "click", this.__hElClick, this);
    },
    //�����¼�
    __hElClick: function(evt) {
        var el = JueKit.Event.srcEl(evt);
        if (el.tagName == "INPUT") 
        {
            this.fireEvent("change");
        }
    },
    // ���ѡ�е��ı�
    getSelectItemText: function() {
        var text;
        var node = this._items.get_first(),
            item;

        while (node) {
            item = node.get_value();
            if (item && item.get_checked()) {
                return item.get_text();
            }
            node = node.get_next();
        }

        return text;
    },
    // ������������ѡ�е��ı�
    set_selectedIndex: function (index) {
        var nodeCbk = this._items.getAt(index);
        if (nodeCbk) {
            nodeCbk = nodeCbk.get_value();
            nodeCbk.set_checked(true);
        } 
    },
    // �����ı�����ѡ�е��ı�
    set_selectedText: function(text) {
        var node = this._items.get_first(),
            item;

        while (node) {
            item = node.get_value();
            if (item && item.get_text() == text) {
                item.set_checked(true);
            }

            node = node.get_next();
        }
    },
    // �����Ƿ�ֻ��
    set_readOnly: function(value) {
        var node = this._items.get_first(),
            item;

        while (node) {
            item = node.get_value();

            item.set_readOnly(value);

            node = node.get_next();
        }
    },
    // ��� item
    addItem: function(item) {
        this._items.addLast(item);
        var li = JueKit.Dom.createEl("li", { className: this.cssCls + "Item" });

        li.appendChild(item._el);
        this._el.appendChild(li);
    },
    // ��� ɾ��item
    removeItem: function(item) {
        this._items.remove(item);
        JueKit.Dom.removeEl(item._el.parentNode);
    },
    // ������ʾ���� �� ˮƽ 
    set_direction: function(direction) {
        var cssCls = this.cssCls + "Ver";
        if (direction == JueKit.UI.Direction.vertical) {
            JueKit.Dom.addCssClass(this._el, cssCls);
        }
        else {
            JueKit.Dom.removeCssClass(this._el, cssCls);
        }
    }
});

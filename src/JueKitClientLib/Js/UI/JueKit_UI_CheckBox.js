/**
 * Copyright (c) 2007 Tulipmm.cn. All rights reserved.
 * @Author fossil
 */
 
// JueKit.UI.CheckBox
JueKit.Type.registerNamespace("JueKit.UI");

JueKit.UI.CheckBox = JueKit.Type.createClass("JueKit.UI.CheckBox", JueKit.UI.RichClientWebControl,{
    cssCls : "jueChk",
    //��ʼ������
    onInitProperty : function(objData){
        this._value = objData.value;
        
        this._text = objData.text || "";

        this._valueColName = objData.valueColName || "";

        JueKit.UI.CheckBox._base.onInitProperty.call(this, objData);
    },
    // ����DOM
    createDom : function(objData){
        var cssCls = this.cssCls;
        this._el = JueKit.Dom.createEl("span", {id:objData.id, className:cssCls + "Wrap"});
        
        this._elInput = JueKit.Dom.createEl("input", {type:"checkbox", id:objData.id, className:cssCls});
        this._elBox = JueKit.Dom.createEl("a", {className:cssCls + "Box"});
        this._elLabel = JueKit.Dom.createEl("label", {className:cssCls + "Lbl", htmlFor:objData.id}, JueKit.String.HTMLEncode(this._text));
        
        this._el.appendChild(this._elInput);
        this._el.appendChild(this._elBox);
        this._el.appendChild(this._elLabel);
        JueKit.UI.CheckBox._base.createDom.call(this, objData);
    },
    // ����DOM
    parseDom : function(objData){
        this._elInput = JueKit.Dom.getChildElByIndex(this._el, 0);
        this._elChkBox = JueKit.Dom.getNextEl(this._elInput);
        this._elLabel = JueKit.Dom.getNextEl(this._elChkBox);
    },
    //��ʼ������
    onInit : function(objData){
        this._checked = objData.checked;
        this._elInput.readonly = objData.readOnly;
        this.__refreshCtl();
    },
    // ���¼�
    bindDomEventHandlers : function(){
        JueKit.Event.addHandler(this._el, "click", this.__hElClick, this);
    },
   // ����¼�
    __hElClick : function(evt){
        if(!this.get_readOnly())
        {
            this.set_checked(!this.get_checked());
        }
    },
   // ˢ��checbox ��ѡ�� ֻ��
    __refreshCtl : function(){
        if(this._checked)
        {
            JueKit.Dom.addCssClass(this._elChkBox, this.cssCls + "Checked");
        }
        else
        {
            JueKit.Dom.removeCssClass(this._elChkBox, this.cssCls + "Checked");
        }
        
        if(this._elInput.readonly)
        {
            JueKit.Dom.addCssClass(this._el, this.cssCls + "ReadOnly");
        }
        else
        {
            JueKit.Dom.removeCssClass(this._el, this.cssCls + "ReadOnly");
        }
    },
    //���checbox�� value ֵ
    get_value : function(){
        return this._elInput.value;
    },
    //����checbox�� value ֵ
    set_value : function(value){
        this._elInput.value = value;
    },
    //���checbox�� �ı� ֵ
    get_text : function(){
        return this._text;
    },
    //����checbox�� �ı� ֵ
    set_text : function(value){
        this._text = value;
        this._elLabel.innerHTML = value;
    },
    //���checbox�� �Ƿ���
    get_checked : function(){
        return !!this._checked;
    },
    //����checbox�� �Ƿ���
    set_checked : function(value){
        if(this._state & JueKit.UI.State.updatingCtlData)
        {
            return;
        }
    
        if(this._checked != value)
        {
            this._checked = value;
            this.__refreshCtl();
            this.updateData();
            this.fireEvent("change");
        }
    },
    //���checbox�� �Ƿ�ֻ��
    get_readOnly : function(){
        return this._elInput.readonly;
    },
    //����checbox�� �Ƿ�ֻ��
    set_readOnly : function(value){
        this._elInput.readonly = value;
        this.__refreshCtl();
    },
    //����checbox�� �� datagrid ��������
    set_valueColName : function(value){
        this._valueColName = value;
    }, 
    //DataBindableControl
    // ������Դ�����ı�ʱ�����¿ؼ�
    onUpdateCtlData : function(dataSource){
        if(this._valueColName)
        {
            var value = JueKit.Data.DataRow.getColValue(dataSource, this._valueColName);
            this.set_checked(value ? true : false);
        }
    },
    // ���ؼ����ݷ����ı�ʱ����������Դ
    onUpdateData : function(dataSource){
        if(this._valueColName)
        {
            JueKit.Data.DataRow.setColValue(dataSource, this._valueColName, this.get_checked());
        }
    }
});

JueKit.Type.extend(JueKit.UI.CheckBox.prototype, JueKit.UI.DataBindableControl.prototype);


// JueKit.UI.CheckBoxList
JueKit.Type.registerNamespace("JueKit.UI");

JueKit.UI.CheckBoxList = JueKit.Type.createClass("JueKit.UI.CheckBoxList", JueKit.UI.RichClientWebControl,
{
    cssCls: "jueChkBoxList",
    // ��������ֵ�
    ctor: function (objData) {
        this._items = new JueKit.Collection.LinkedList();

        JueKit.UI.CheckBoxList._base.ctor.call(this, objData);
    },
    //����DOM
    createDom: function (objData) {
        this._el = JueKit.Dom.createEl("ul", { id: objData.id, className: this.cssCls });

        JueKit.UI.CheckBoxList._base.createDom.call(this, objData);
    },
    //���¼�
    bindDomEventHandlers: function () {
        JueKit.Event.addHandler(this._el, "click", this.__hElClick, this);
    },
   //�����¼�
    __hElClick: function (evt) {
        var el = JueKit.Event.srcEl(evt);
        if (el.tagName == "A" || el.tagName == "LABEL") {
            this.fireEvent("change");
        }
    }, 
    // ��ʼ������
    onInit: function (objData) {
        if (objData.items) {
            for (var i = 0; i < objData.items.length; i++) {
                this.addItem(new JueKit.UI.CheckBox(objData.items[i]));
            }
        }
        this.set_selectedText(objData.selectedText, true);
    },
    // ���ѡ�е��ı�����
    getSelectItemText: function () {
        var textList = [];
        var node = this._items.get_first(),
            item;

        while (node) {
            item = node.get_value();
            if (item && item.get_checked()) {
                textList[textList.length] = item.get_text();
            }
            node = node.get_next();
        }

        return textList;
    },
    // �������_items
    get_items: function () {
        return this._items;
    },
    // ������һ������� �Ƿ�ѡ��
    set_selectedIndex: function (index, value) {
        var nodeCbk = this._items.getAt(index);
        if (nodeCbk) {
            nodeCbk = nodeCbk.get_value();
            nodeCbk.set_checked(value);
        }
    },
    // ������һ����ı� �Ƿ�ѡ��
    set_selectedText: function (text, value) {
        var node = this._items.get_first(),
            item;

        while (node) {
            item = node.get_value();
            if (item && item.get_text() == text) {
                item.set_checked(value);
            }

            node = node.get_next();
        }
    },
    // �����Ƿ�ֻ��
    set_readOnly: function (value) {
        var node = this._items.get_first(),
            item;

        while (node) {
            item = node.get_value();

            item.set_readOnly(value);

            node = node.get_next();
        }
    },
    // ��� item
    addItem: function (item) {
        this._items.addLast(item);
        var li = JueKit.Dom.createEl("li", { className: this.cssCls + "Item" }); 
        li.appendChild(item._el);
        this._el.appendChild(li);
    },
    // ��� ɾ��item
    removeItem: function (item) {
        JueKit.Dom.removeEl(item._value._el.parentNode);
        this._items.remove(item);
    },
    // ������ʾ���� �� ˮƽ 
    set_direction: function (direction) {
        var cssCls = this.cssCls + "Ver";
        if (direction == JueKit.UI.Direction.vertical) {
            JueKit.Dom.addCssClass(this._el, cssCls);
        }
        else {
            JueKit.Dom.removeCssClass(this._el, cssCls);
        }
    }
});

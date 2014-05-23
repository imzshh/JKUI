/**
 * Copyright (c) 2007 Tulipmm.cn. All rights reserved.
 * @Author fossil
 */
 
 // JueKit.UI.FormView
JueKit.Type.registerNamespace("JueKit.UI");
// ���ؼ�
JueKit.UI.FormView = JueKit.Type.createClass("JueKit.UI.FormView", JueKit.UI.RichClientWebControl,{
    cssCls : "jueForm",
   //������ݼ�
    ctor : function(objData){
        this._items = new JueKit.Collection.LinkedList();

        JueKit.UI.FormView._base.ctor.call(this, objData);
    },
    // ����DOM
    createDom : function(objData){
        var html = JueKit.String.format("<div class='{0}ItemWrap'></div>", this.cssCls);
        var elCssCls = this.cssCls + "View";
        if(objData.customCssCls)
        {
            elCssCls += " " + objData.customCssCls;
        }
        this._el = JueKit.Dom.createEl("div", {id:objData.id, className:elCssCls}, html);
        
        JueKit.UI.FormView._base.createDom.call(this, objData);
    },
    // ����DOM
    parseDom : function(objData){
        this._elItemsWrap = JueKit.Dom.getChildElByIndex(this._el, 0);
        
        JueKit.UI.FormView._base.parseDom.call(this, objData);
    },
    // ���Item
    addItem : function(formItem){
        this._items.addLast(formItem);
        this._elItemsWrap.appendChild(formItem._el);
        
        return formItem;
    },
    // ��Ӱ�ť
    addOperationBtn : function(btn){
        if(!this._elOpt)
        {
            this._elOpt = JueKit.Dom.createEl("div", {className:this.cssCls + "Opt"});
            this._el.appendChild(this._elOpt);
        }
    
        this._elOpt.appendChild(btn._el);
        
        return btn;
    }
});
// ��ʱ�ò���
JueKit.UI.FormOpt = JueKit.Type.createClass("JueKit.UI.FormOpt", JueKit.UI.RichClientWebControl,{
    cssCls : "jueForm",

    createDom : function(objData)
    {
        var cssCls = this.cssCls;
        var strHtml = JueKit.String.format("<div class='{0}El'></div>", cssCls);
        var elCssCls = this.cssCls + "Option";
        if(objData.customCssCls)
        {
            elCssCls += " " + objData.customCssCls;
        }
        this._el = JueKit.Dom.createEl("div", {id:objData.id, className:elCssCls}, strHtml);
        
        this.parseDom(objData);
        
        JueKit.UI.FormItem._base.createDom.call(this, objData);
    },
    
    parseDom : function(objData)
    {
        this._elEl = JueKit.Dom.getChildElByIndex(this._el, 0);
    },
    
    onInit : function(objData)
    {
        if(objData.parent)
        {
            objData.parent.addItem(this);
        }
    },

    get_formEl : function()
    {
        return this._elEl;
    }
});
// �Զ������
JueKit.UI.FormItem = JueKit.Type.createClass("JueKit.UI.FormItem", JueKit.UI.RichClientWebControl,{
    cssCls : "jueForm",
    // ��ʼ������
    onInitProperty : function(objData){
        this._label = objData.label || "";
        JueKit.UI.FormItem._base.onInitProperty.call(this, objData);
    },
    // ����DOM
    createDom : function(objData){
        var cssCls = this.cssCls;
        var strHtml = JueKit.String.format("<label class='{0}Label'>{1}</label><div class='{0}El'></div>", cssCls, JueKit.String.HTMLEncode(this._label));
        var elCssCls = this.cssCls + "Item";
        if(objData.customCssCls)
        {
            elCssCls += " " + objData.customCssCls;
        }
        this._el = JueKit.Dom.createEl("div", {id:objData.id, className:elCssCls}, strHtml);
        
        this.parseDom(objData);
        
        JueKit.UI.FormItem._base.createDom.call(this, objData);
        
        if(this.createFormEl)
        {
            this.createFormEl(this._elEl, objData);
        }
    },
    // ����DOM
    parseDom : function(objData){
        this._elLabel = JueKit.Dom.getChildElByIndex(this._el, 0);
        this._elEl = JueKit.Dom.getNextEl(this._elLabel);
    },
    //��ʼ������
    onInit : function(objData){
        if(objData.parent)
        {
            objData.parent.addItem(this);
        }
    },
    //���lable
    get_label : function(){
        return this._label;
    },
    //����lable��ֵ
    set_label : function(value){
        this._label = value;
    },
    //��� form����
    get_formEl : function(){
        return this._elEl;
    }
});
//�ı������
JueKit.UI.TextBoxFormItem = JueKit.Type.createClass("JueKit.UI.TextBoxFormItem", JueKit.UI.FormItem, {
    //���������ı������
    createFormEl : function(formEl, objData){
        this._textBox = new JueKit.UI.TextBox({
                container : formEl,
                value : objData.value,
                textMode : objData.textMode,
                readOnly : objData.readOnly,
                dataSource : objData.dataSource,
                valueColName : objData.valueColName
            });
    },
   //����ı������
    get_textBox : function(){
        return this._textBox;
    },
    //�����ı���Ϊֻ��
    set_readOnly : function(value){
        this._textBox && this._textBox.set_readOnly(value);
    }
});
//ѡ������
JueKit.UI.CheckBoxFormItem = JueKit.Type.createClass("JueKit.UI.CheckBoxFormItem", JueKit.UI.FormItem, {
    //��������ѡ������
    createFormEl : function(formEl, objData){
        this._checkBox = new JueKit.UI.CheckBox({
                container : formEl,
                text : objData.text,
                value : objData.value,
                checked : objData.checked
            });
    },
    //���ѡ������
    get_checkBox : function(){
        return this._checkBox;
    },
    //����ѡ���Ϊֻ��
    set_readOnly : function(value){
        this._checkBox && this._checkBox.set_readOnly(value);
    }
});
//��ѡ������
JueKit.UI.CheckBoxListFormItem = JueKit.Type.createClass("JueKit.UI.CheckBoxListFormItem", JueKit.UI.FormItem, {
    //�������Ķ�ѡ������
    createFormEl : function(formEl, objData){
        this._checkBoxList = new JueKit.UI.CheckBoxList({
                container : formEl,
                items : objData.items
            });
    },
    //��ö�ѡ������
    get_checkBoxList : function(){
        return this._checkBoxList;
    }
});
//���������
JueKit.UI.DropdownListFormItem = JueKit.Type.createClass("JueKit.UI.DropdownListFormItem", JueKit.UI.FormItem, {
    //�����������������
    createFormEl : function(formEl, objData){
        this._ddl = new JueKit.UI.DropdownList({
                container : formEl,
                items : objData.items,
                selectedIndex : objData.selectedIndex,
                emptyText : objData.emptyText,
                dataSource : objData.dataSource,
                valueColName : objData.valueColName,
                textColName : objData.textColName,
                canSearch : objData.canSearch
            });
    },
    //������������
    get_dropdownList : function(){
        return this._ddl;
    },
    //������������
    set_readOnly : function(value){
        this._ddl && this._ddl.set_readOnly(value);
    }
});
//���ڿ����
JueKit.UI.DatePickerFormItem = JueKit.Type.createClass("JueKit.UI.DatePickerFormItem", JueKit.UI.FormItem,{
    //�����������ڿ����
    createFormEl : function(formEl, objData){
        this._datePicker = new JueKit.UI.DatePicker({
                container : formEl,
                emptyText : objData.emptyText,
                dataSource : objData.dataSource,
                valueColName : objData.valueColName,
                currentDate : objData.currentDate,
                width: objData.width || 150
            });
    },
        //������ڿ����
    get_datePicker : function(){
        return this._datePicker;
    },
    //�������ڿ�Ϊֻ��
    set_readOnly : function(value){
        this._datePicker && this._datePicker.set_readOnly(value);
    }
});
//������
JueKit.UI.TreeFormItem = JueKit.Type.createClass("JueKit.UI.TreeFormItem", JueKit.UI.FormItem, {
    //�������������� 
    createFormEl: function (formEl, objData) {
        this._tree = new JueKit.UI.Tree({
            container: formEl,
            checkable: objData.checkable,
            topNode: objData.topNode
        });
        this._tree._el.style.display ='inline-block'; 
    },
    //���������
    get_tree: function () {
        return this._tree;
    }
});

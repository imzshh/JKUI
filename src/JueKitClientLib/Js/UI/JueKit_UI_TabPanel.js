/**
 * Copyright (c) 2007 Tulipmm.cn. All rights reserved.
 * @Author fossil
 */
 
 // JueKit.UI.TabPanel
JueKit.Type.registerNamespace("JueKit.UI");

JueKit.UI.TabPanel = JueKit.Type.createClass("JueKit.UI.TabPanel", JueKit.UI.LazyLoadWebControl,{
    _firstActive : true,
    _panelVisible: true,
    //��ʼ������
    onInitProperty : function(objData){
        this._isCurrent = objData.isCurrent;
        this._title = objData.title;
        this._showCloseBtn = objData.showCloseBtn;
        
        JueKit.UI.TabPanel._base.onInitProperty.call(this, objData);
    },
    // ����DOM
    createDom : function(objData){
        var cssClass = this._parent.cssCls;
        
        this._el = JueKit.Dom.createEl("div", {className:cssClass + "Panel"});
        this._el.style.display = "none";
        
        this._elTabSelector = JueKit.Dom.createEl("li", {className: cssClass + "Selector"}, JueKit.String.format("<a href='javascript:void(0);'><span class='{0}SelectorRight'><span class='{0}SelectorCenter'><span class='{0}SelectorText'></span><span class='{0}BtnClose'></span></span></span></a>", cssClass));
        
        objData.container = this._parent._elPanelGroupInner;
        this._parent._elTabSelGroup.appendChild(this._elTabSelector);
        
        this._elTabSelectorText = this._elTabSelector.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        this._elBtnClose = this._elTabSelectorText.nextSibling;
        this._elChildContainer = this._el;
        
        this._elTabSelectorText.innerHTML = this._title;
        this._createByJs = true;
        
        JueKit.UI.TabPanel._base.createDom.call(this, objData);
    },
    //����DOM
    parseDom : function(objData){
        var el = JueKit(this._id + "_selector");
        if(el)
        {
            this._elTabSelector = el;
        }
        el = JueKit(this._id + "_selectorText");
        if(el)
        {
            this._elTabSelectorText = el;
        }
        
        this._elChildContainer = this._el;
    },
    //��ʼ������
    onInit : function(objData){
        this._parent && this._parent._panels.addLast(this);
        
        if(this._createByJs && (this._isCurrent || this._parent._panels.get_count() == 1))
        {
            this._parent.set_currentPanel(this);
        }
        else if(this._isCurrent)
        {
            this._parent._currentPanel = this;
        }
                
        this.set_tip(objData.title);
    },
    //���tabset����
    get_tabset : function(){
        return this._parent;
    },
    //����Ƿ�Ϊ��ǰpanel
    get_isCurrent : function(){
        return this._parent._currentPanel == this;
    },
    //��ñ���
    get_title : function(){
        return this._title;
    },
    //���ñ���
    set_title : function(value){
        if(this._title == value)
        {
            return;
        }
        this._title = value;
        this._elTabSelectorText.innerHTML = JueKit.String.HTMLEncode(JueKit.String.substrEx(value, 40));
        this.set_tip(value);
        this._parent.layoutTabHeader();
    },
    //������ʾ��Ϣ
    set_tip : function(value){
        if(value === undefined || value === null)
        {
            value = "";
        }
        this._elTabSelector.title = value;
    },
    //�����Ƿ���ʾ�رհ�ť
    set_showCloseBtn : function(value){
        if(this._showCloseBtn == value)
        {
            return;
        }
        
        this._showCloseBtn = value;
        
        if(value)
        {
            JueKit.Dom.show(this._elBtnClose);
        }
        else
        {
            JueKit.Dom.hide(this._elBtnClose);
        }
    },
    //�ڻ�ý���֮ǰִ��
    __doBeforeActive : function(){
        var args = {firstActive : this._firstActive, result:true};
        
        this.fireEvent("beforeActive", args);
        
        if(!args.result)
        {
            return false;
        }
        return true;
    },
    //�ڻ�ý���ִ��
    __doActive : function(){
        var args = {firstActive : this._firstActive};
        
        JueKit.Dom.addCssClass(this._elTabSelector, this._parent.cssCls + "SelectorCurrent");
        JueKit.Dom.show(this._el);
        
        if(!this._childLoaded)
        {
            this.__loadNow();
        }
        else
        {
            this.onActive && this.onActive(args);
            this.__layoutChildren();
            this.fireEvent("active", args);
            this._firstActive = undefined;
        }
        
        return true;
    },
    //�ӳټ���
    onLazyLoaded : function(){
        this.onActive && this.onActive();
        this.__layoutChildren();
        var args = {firstActive : this._firstActive};
        this.fireEvent("active", args);
        this._firstActive = undefined;
    },
    //��ý���
    active : function(){
        this.show();
    
        this.get_tabset().set_currentPanel(this);

        var ih = this._parent._innerHeight;
        if(ih && this._el.offsetHeight != ih)
        {
            this._el.style.height = ih + "px";
        }
    },
    //ʧȥ����
    inactive : function(){
        JueKit.Dom.removeCssClass(this._elTabSelector, this._parent.cssCls + "SelectorCurrent");
        JueKit.Dom.hide(this._el);

        this.fireEvent("inactive");
    },
    //��ʾtabpanel
    show : function(visible){
        if(visible === undefined || visible)
        {
            this._panelVisible = true;
            JueKit.Dom.show(this._elTabSelector);
        }
        else
        {
            this._panelVisible = false;
            JueKit.Dom.hide(this._elTabSelector);
            this.get_tabset().__onHidePanel(this);
        }
        if(this.get_isCurrent())
        {
            JueKit.UI.TabPanel._base.show.call(this, visible);
        }
        
        this._parent.layoutTabHeader();
    },
    //�ر�tabpanel
    __doClose : function(){
        var args = {result:true};
        
        this.onBeforeClose && this.onBeforeClose(args);
        if(!args.result)
        {
            return;
        }
        
        this.fireEvent("beforeClose", args);
        if(!args.result)
        {
            return;
        }
    
        JueKit.Dom.removeEl(this._el);
        JueKit.Dom.removeEl(this._elTabSelector);
        
        this.onClose && this.onClose();
        this.fireEvent("close");
        return true;
    },
    //����tabpanel
    close : function(){
        this.get_tabset().closePanel(this);
    }
});

JueKit.Type.extend(JueKit.UI.TabPanel.prototype, JueKit.Collection.LinkedListNode.prototype);


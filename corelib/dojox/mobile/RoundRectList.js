//>>built
define("dojo/_base/array dojo/_base/declare dojo/_base/event dojo/_base/lang dojo/_base/window dojo/dom-construct dojo/dom-attr dijit/_Contained dijit/_Container dijit/_WidgetBase".split(" "),function(c,b,e,f,m,g,d,h,k,l){return b("dojox.mobile.RoundRectList",[l,k,h],{transition:"slide",iconBase:"",iconPos:"",select:"",stateful:!1,syncWithViews:!1,editable:!1,tag:"ul",editableMixinClass:"dojox/mobile/_EditableListMixin",baseClass:"mblRoundRectList",filterBoxClass:"mblFilteredRoundRectListSearchBox",
buildRendering:function(){this.domNode=this.srcNodeRef||g.create(this.tag);this.select&&(d.set(this.domNode,"role","listbox"),"multiple"===this.select&&d.set(this.domNode,"aria-multiselectable","true"));this.inherited(arguments)},postCreate:function(){this.editable&&require([this.editableMixinClass],f.hitch(this,function(a){b.safeMixin(this,new a)}));this.connect(this.domNode,"onselectstart",e.stop);if(this.syncWithViews){var a=function(a,b,d,e,f,g){(b=c.filter(this.getChildren(),function(b){return b.moveTo===
"#"+a.id||b.moveTo===a.id})[0])&&b.set("selected",!0)};this.subscribe("/dojox/mobile/afterTransitionIn",a);this.subscribe("/dojox/mobile/startView",a)}},resize:function(){c.forEach(this.getChildren(),function(a){a.resize&&a.resize()})},onCheckStateChanged:function(){},_setStatefulAttr:function(a){this._set("stateful",a);this.selectOne=a;c.forEach(this.getChildren(),function(a){a.setArrow&&a.setArrow()})},deselectItem:function(a){a.set("selected",!1)},deselectAll:function(){c.forEach(this.getChildren(),
function(a){a.set("selected",!1)})},selectItem:function(a){a.set("selected",!0)}})});
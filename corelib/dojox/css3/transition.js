//>>built
define("dojo/_base/lang dojo/_base/array dojo/Deferred dojo/when dojo/promise/all dojo/on dojo/sniff".split(" "),function(g,f,r,n,t,p,q){var h="transitionend",d="t",k="translate3d(",l=",0,0)";q("webkit")?(d="WebkitT",h="webkitTransitionEnd"):q("mozilla")&&(d="MozT",k="translateX(",l=")");var c=function(a){g.mixin(this,{startState:{},endState:{},node:null,duration:250,"in":!0,direction:1,autoClear:!0});g.mixin(this,a);this.deferred||(this.deferred=new r)};g.extend(c,{play:function(){c.groupedPlay([this])},
_applyState:function(a){var b=this.node.style,e;for(e in a)a.hasOwnProperty(e)&&(b[e]=a[e])},initState:function(){this.node.style[d+"ransitionProperty"]="none";this.node.style[d+"ransitionDuration"]="0ms";this._applyState(this.startState)},_beforeStart:function(){"none"===this.node.style.display&&(this.node.style.display="");this.beforeStart()},_beforeClear:function(){this.node.style[d+"ransitionProperty"]="";this.node.style[d+"ransitionDuration"]="";!0!==this["in"]&&(this.node.style.display="none");
this.beforeClear()},_onAfterEnd:function(){this.deferred.resolve(this.node);this.node.id&&c.playing[this.node.id]===this.deferred&&delete c.playing[this.node.id];this.onAfterEnd()},beforeStart:function(){},beforeClear:function(){},onAfterEnd:function(){},start:function(){this._beforeStart();this._startTime=(new Date).getTime();this._cleared=!1;var a=this;a.node.style[d+"ransitionProperty"]="all";a.node.style[d+"ransitionDuration"]=a.duration+"ms";p.once(a.node,h,function(){a.clear()});this._applyState(this.endState)},
clear:function(){this._cleared||(this._cleared=!0,this._beforeClear(),this._removeState(this.endState),this._onAfterEnd())},_removeState:function(a){var b=this.node.style,e;for(e in a)a.hasOwnProperty(e)&&(b[e]="")}});c.slide=function(a,b){b=new c(b);b.node=a;var e=a="0";b["in"]?a=1===b.direction?"100%":"-100%":e=1===b.direction?"-100%":"100%";b.startState[d+"ransform"]=k+a+l;b.endState[d+"ransform"]=k+e+l;return b};c.fade=function(a,b){b=new c(b);b.node=a;var e=a="0";b["in"]?e="1":a="1";g.mixin(b,
{startState:{opacity:a},endState:{opacity:e}});return b};c.flip=function(a,b){b=new c(b);b.node=a;b["in"]?(g.mixin(b,{startState:{opacity:"0"},endState:{opacity:"1"}}),b.startState[d+"ransform"]="scale(0,0.8) skew(0,-30deg)",b.endState[d+"ransform"]="scale(1,1) skew(0,0)"):(g.mixin(b,{startState:{opacity:"1"},endState:{opacity:"0"}}),b.startState[d+"ransform"]="scale(1,1) skew(0,0)",b.endState[d+"ransform"]="scale(0,0.8) skew(0,30deg)");return b};var m=function(a){var b=[];f.forEach(a,function(a){a.id&&
c.playing[a.id]&&b.push(c.playing[a.id])});return t(b)};c.getWaitingList=m;c.groupedPlay=function(a){var b=f.filter(a,function(a){return a.node}),b=m(b);f.forEach(a,function(a){a.node.id&&(c.playing[a.node.id]=a.deferred)});n(b,function(){f.forEach(a,function(a){a.initState()});setTimeout(function(){f.forEach(a,function(a){a.start()});p.once(a[a.length-1].node,h,function(){for(var b,c=0;c<a.length-1;c++)0===a[c].deferred.fired||a[c]._cleared||(b=(new Date).getTime()-a[c]._startTime,b>=a[c].duration&&
a[c].clear())});setTimeout(function(){for(var b,c=0;c<a.length;c++)0===a[c].deferred.fired||a[c]._cleared||(b=(new Date).getTime()-a[c]._startTime,b>=a[c].duration&&a[c].clear())},a[0].duration+50)},33)})};c.chainedPlay=function(a){var b=f.filter(a,function(a){return a.node}),b=m(b);f.forEach(a,function(a){a.node.id&&(c.playing[a.node.id]=a.deferred)});n(b,function(){f.forEach(a,function(a){a.initState()});for(var b=1,c=a.length;b<c;b++)a[b-1].deferred.then(g.hitch(a[b],function(){this.start()}));
setTimeout(function(){a[0].start()},33)})};c.playing={};return c});
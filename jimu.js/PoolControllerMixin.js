define([
  'dojo/_base/declare',
  'dojo/_base/array',
  'jimu/PanelManager'
], function(declare, array, PanelManager){
  var clazz = declare(null, {
    // summary:
    //    this mixin process the widgets in the widget pool.
    // description:
    //    the controller widget should have two properties setting:
    //    controlledGroups, controlledWidgets. Both of them are optional.
    //controlledGroups: String[]|String
    //    If array, is array of gropus id. If String, "all" means read all of the groups.
    //    If not set, do not read any group.
    //controlledWidgets: String[]|String
    //    If array, is array of widgets id. If String, "all" means read all of the widgets.
    //    If not set, do not read any widget.

    constructor: function(){
      this.panelManager = PanelManager.getInstance();
    },

    postCreate: function(){
      //we set default value to 'all', because of most of the time, we have one controller only.
      if(!this.controlledWidgets){
        this.controlledWidgets = 'all';
      }
      if(!this.controlledGroups){
        this.controlledGroups = 'all';
      }
    },


    getOpenedIds: function(){
      //return the Ids the the controller has opened
      //return [];
    },

    setOpenedIds: function(ids){
      /*jshint unused:false*/
      //set the Ids that should be opened
    },

    getConfigById: function(id){
      var allConfigs = this.getAllConfigs();
      for(var i = 0; i < allConfigs.length; i++){
        if(allConfigs[i].id === id){
          return allConfigs[i];
        }
      }
    },

    getAllConfigs: function(){
      var ret = [];
      ret = ret.concat(this.getWidgetConfigs(), this.getGroupConfigs());
      ret = array.filter(ret, function(o){
        return o.visible;
      });
      return ret.sort(function(a, b){
        return a.index - b.index;
      });
    },

    getAllConfigsIncludeInvisible: function(){
      var ret = [];
      ret = ret.concat(this.getWidgetConfigs(), this.getGroupConfigs());
      return ret.sort(function(a, b){
        return a.index - b.index;
      });
    },

    isControlled: function(id){
      return array.some(this.getAllConfigsIncludeInvisible(), function(config){
        return config.id === id;
      });
    },

    widgetIsControlled: function(widgetId){
      return array.some(this.getAllConfigsIncludeInvisible(), function(config){
        if(config.id === widgetId){
          return true;
        }else{
          return array.some(config.widgets, function(widgetConfig){
            return widgetConfig.id === widgetId;
          });
        }
      });
    },

    getGroupConfigs: function(){
      var ret = [];
      if(!this.appConfig.widgetPool){
        return ret;
      }
      if(this.appConfig.widgetPool.groups){
        array.forEach(this.appConfig.widgetPool.groups, function(g){
          if(this.controlledGroups){
            if(Array.isArray(this.controlledGroups)){
              if(this.controlledGroups.indexOf(g.id) > -1){
                ret.push(g);
              }
            }else if(this.controlledGroups === 'all'){
              ret.push(g);
            }
          }
        }, this);
      }

      return ret;
    },

    getWidgetConfigs: function(){
      var ret = [];
      if(!this.appConfig.widgetPool){
        return ret;
      }
      if(this.appConfig.widgetPool.widgets){
        array.forEach(this.appConfig.widgetPool.widgets, function(w){
          if(this.controlledWidgets){
            if(Array.isArray(this.controlledWidgets)){
              if(this.controlledWidgets.indexOf(w.id) > -1){
                ret.push(w);
              }
            }else if(this.controlledWidgets === 'all'){
              ret.push(w);
            }
          }
        }, this);
      }

      return ret;
    }
  });

  return clazz;
});
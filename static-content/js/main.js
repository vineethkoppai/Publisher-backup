// Original concepts provided by Backbone Boilerplate project: https://github.com/tbranyen/backbone-boilerplate
require.config({
 
 // baseUrl: "../js",
  catchError: {
    define: true
  },
 
  paths: {
    // Libraries
    jquery: "lib/jquery",
    underscore: "lib/underscore.min",
    backbone: "lib/backbone.min",
    fixedHeader:"lib/jquery.fixheadertable.min",
    text:"lib/text",
    bootstrap:"lib/bootstrap.min",
    jqueryui:"lib/jquery-ui.min" ,
    debug:"lib/debug",
    jquerylayoutlatest:"lib/jquery.layout.min",
    facebox:"lib/facebox",
    jqueryfacebookalert:"lib/jquery_facebook.alert",
    jstree:"lib/jquery.jstree",
    datejs:"lib/date.min",
    constants:"utils/constants" ,
    messages:"utils/messages",
    mapping:"utils/xlJsonMapping",
    ajaxform:"lib/jquery.form.min",
    ellipsis:"lib/jquery.autoellipsis-1.0.10.min"
  },
  
  shim: {
    underscore: {
      exports: "_"
    },
 
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
 
    bootstrap:{
        deps: ["jquery"],
        exports: "bootstrap"
    }
  },
  
  waitSeconds: 30
 
});
 
requirejs.onError = function (e) {
    if (e.requireType === 'timeout') {
        console.log(e);
    } else {
        throw e;
    }
};
 
require([
    'jquery',
    'underscore',
    'backbone',
    'router'
],
 
function($, _, Backbone, Router) {
 
  if ( ! window.console ) {
 
    (function() {
      var names = ["log", "debug", "info", "warn", "error",
          "assert", "dir", "dirxml", "group", "groupEnd", "time",
          "timeEnd", "count", "trace", "profile", "profileEnd"],
          i, l = names.length;
 
      window.console = {};
 
      for ( i = 0; i < l; i++ ) {
        window.console[ names[i] ] = function() {};
      }
    }());
  }
 
  //IE fix
     if ($.browser.msie) {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        }
    }
 
 
 $( document ).ajaxError(function(event, jqxhr, settings, exception) {
    if(jqxhr.status==401){
      javascript:logout();
    }
 });
 
  var appRouter = new Router();
 
  Backbone.View.prototype.goTo = function (loc) {
       appRouter.navigate(loc, true);
  };
  Backbone.history.start();
  //Backbone.history.start({pushState: true})     
 
  $.ui.autocomplete.prototype._renderItem = function( ul, item){
      var term = this.term.split(' ').join('|');
      var re = new RegExp("(" + term + ")", "gi") ;
      var t = item.label.replace(re,"<strong>$1</strong>");
      return $( "<li></li>" )
          .data( "item.autocomplete", item )
          .append( "<a>" + t + "</a>" )
          .appendTo( ul );
  };
  
});
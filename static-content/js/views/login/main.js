require.config({

  paths: {
    // Libraries
    jquery: "../../lib/jquery",
    underscore: "../../lib/underscore.min",
    backbone: "../../lib/backbone.min", 
    constants:"../../utils/constants",
    jqplaceholder:"../../lib/Placeholders/Placeholders",
    jqplaceholdermin:"../../lib/Placeholders/Placeholders.min"
  },

  shim: {
    underscore: {
      exports: "_"
    },

    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }
  }
});

define([
'app'
],

function(
App
) {

   $.ajaxSetup({ beforeSend : function(xhr, settings){ 
     xhr.setRequestHeader('Request_Source', 'AuthoringTool');
     xhr.setRequestHeader('Accept', 'application/json');
     xhrFields: {withCredentials: true};
  }});

  new App();
});

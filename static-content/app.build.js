({
    appDir: "${basedir}/src/main/webapp",
    baseUrl: "./static-content/js",
    dir: "${basedir}/src/main/webapp/static-content/final",
    modules: [
        {
            name: "main"
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
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
    }
  }
})

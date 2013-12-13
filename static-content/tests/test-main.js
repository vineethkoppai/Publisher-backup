require.config({
  baseUrl: "../js",
  //urlArgs: 'cb=' + Math.random(),

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
    ellipsis:"lib/jquery.autoellipsis-1.0.10.min",

    //LIBS FOR TESTS
    jasmine: '../tests/lib/jasmine',
    'jasmine-html': '../tests/lib/jasmine-html',
    specs: '../tests/specs/',
    util: '../tests/util/',
    sinon:'../tests/lib/sinon', // FOR MOCKING AJAX 
    consoleRunner:'../tests/lib/console-runner', //FOR PRINTING STACK TRACE ON COMMAND LINE
    phantomsjsReporter:'../tests/lib/jasmine.phantomjs-reporter', 
    dropdown:'../tests/util/misc',
    testTemplates:'../tests/templates'
  },
  

  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    jasmine: {
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
    },
    sinon: {
        exports: 'sinon'
    },
    consoleRunner:{
      deps: ['jasmine'],
      exports:'consoleRunner'
    },
    phantomsjsReporter:{
      deps: ['jasmine'],
      exports:'phantomsjsReporter'
    }
  }
});


//window.store = "TestStore"; // override local storage store name - for testing

require(['backbone', 'underscore', 'jquery', 'jasmine-html', 'consoleRunner', 'phantomsjsReporter'], 
function(Backbone, _, $, jasmine, consoleRunner, phantomsjsReporter){
  
  Backbone.View.prototype.goTo = function (loc) {
         return;
  };
 
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter(),
      phantomsjsReporter = new jasmine.PhantomJSReporter();

   jasmineEnv.addReporter(htmlReporter);  
   //ONLY FOR HEADLESS BROWSER ADD THE PHANTOM JS REPORT
   var data = jQuery.browser
   for(var key in data){
          this.browser = key;
          break; 
   } 
   if(this.browser == 'webkit')
       jasmineEnv.addReporter(phantomsjsReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  var specs = [];

  specs.push('specs/views/teacherEval_spec');
  specs.push('specs/views/subnav_spec');
  specs.push('specs/collections/dlaCollection_spec');
  specs.push('specs/views/dla_spec');
  specs.push('specs/views/page_spec');
  specs.push('specs/views/editDLA_spec');
  specs.push('specs/views/editDLA_author_spec');
  specs.push('specs/views/classification_spec');

  



  $(function(){
    require(specs, function(){
      jasmineEnv.execute();
    });
  });

});

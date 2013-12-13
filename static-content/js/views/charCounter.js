 define(
['jquery', 'underscore', 'backbone'  ],

function($, _ , Backbone ) {

$(function() {

var charCounter =  Backbone.View.extend({
    charLimet:0,
    className:'charcounter',

    initialize: function(){

    },

});

});


	//We want this to run as soon as the page has loaded

	 window.onload = function() {
	  //Character limit
	  var limit = 150; 
	  //the div to contain the background and the textarea
	  var div = document.createElement('div');
	  div.className = 'charcounter';
	  //Append the div into the document before the textarea, so that when we
	  //remove the textarea, it can be inserted inside the div and it'll look like it never moved.
	  var txt = document.getElementById('text');
	  txt.parentNode.insertBefore(div, txt);
	  //this will contain the background numbers
	  var counter = document.createElement('div');
	  div.appendChild(counter);
	  counter.innerHTML = limit;
	  //Add both keypress and keydown handlers to make sure the event always fires
	  txt.onkeypress = txt.onkeydown = function() {
	    //Calculate how many chars the user has remaining
	    var len = limit - txt.value.length;
	    if(len < 0) {
	      return false;
	    }
	    else {
	      counter.className = '';
	    }
	 
	    counter.innerHTML = len;
	  };
	 
	  txt.parentNode.removeChild(txt);
	  div.appendChild(txt);
	};

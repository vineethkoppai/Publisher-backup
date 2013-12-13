define([
'views/subnav/subnavView',
'backbone',
'sinon'
],

function(
View,
Backbone,
sinon
) {

describe("VIEW -- Subnav ", function() { 
  
	beforeEach(function() {   
	    this.server = sinon.fakeServer.create();   	  
		var self = this;     	
     	this.model = new Backbone.Model();
     	this.view = new View({ el:$('#sandbox'), model:this.model}); 
     	this.view.render();
	});     

	afterEach(function() {
	   delete this.view;
	   $('#sandbox').html('');
	   this.server.restore();
	});  

	it('subnav should show result count set on its model', function(){
		  var self = this;
		 this.model.set(
 			{'num-results':100,
 			 'searchVal':'test',
 			 'filterVal':'test',
 			 'isLoading':false});     	
		 expect(this.model.get('num-results')).toBe(parseInt(this.view.$searchResultCount.text().replace('results','').trim()));
	});

	it('Author option should come in auto complete suggestion for search', function(){
		
		this.view.$el.find('#search').trigger('focus');
		var $autocomplete = $('ul.ui-autocomplete')
		expect($autocomplete.is(':visible')).toBe(true);
		expect($autocomplete.find('li').eq(5).text().trim()).toBe('author:');
	})

	it('subnav view should trigger search event with key as author and given value', function(){ 
        var callback = sinon.spy();
		this.view.bind('search', callback);
        this.view.$el.find('#search').trigger('focus');
		var $autocomplete = $('ul.ui-autocomplete')
		this.view.$el.find('input#search').val($autocomplete.find('li').eq(5).text().trim()+'test');
		this.view.$el.trigger({ type:"keypress", keyCode:13});
		expect(callback.args[0][0]).toBe(this.view.$el.find('input#search').val())
		expect(callback.callCount).toBe(1);
	})

	



});



});
define([
'collections/dlaCollection',
'backbone',
'sinon',
'constants'
],

function(
Collection,
Backbone,
sinon,
constants
) {

describe("COLLECTION  -- dla collection ", function() { 
  
	beforeEach(function() {     
		this.server = sinon.fakeServer.create();   
     	this.model = new Backbone.Model();
     	this.collection = new Collection({ subnavModel:this.model }); 
	});     

	afterEach(function() {
		 this.server.restore();
		 delete this.model;
		 $('#sandbox').html('');
	});  


	it('Subnav model should fire a change event when collection does a fetch', function(){
		var callback = sinon.spy();
		this.model.bind('change', callback);

		//URL FOR COLLECTION, THIS URL IS FORMD BY COLLECTION BY DEFAULT SO ITS HARD CODED HERE
		//COLLECTION URL AND SINON FAKE SERVER URL SHOULD BE SAME
		var url = '/contentrepository/api/cms/content/search?profile=combined&undefined&page-index=0&max-count=30&sort-by=created-time&is-asc=false'
		this.server.respondWith("GET", url,
		[200, {"Content-Type": "application/json"},
		'{"response":{"operation-status":"SUCCESS","num-results":0}}']);
		this.collection.fetch();
		this.server.respond(); 
		expect(callback.called).toBeTruthy();	    
  	});//END SPEC

  	it('Subnav model should fire change event twice when filter/serach is done on collection', function(){ 
  		var callback = sinon.spy();
		this.model.bind('change', callback);		
        var url = '/contentrepository/api/cms/content/search?profile=combined&filter-content-type=dla&page-index=0&max-count=30&sort-by=created-time&is-asc=false';
		this.server.respondWith("GET", url,
		[200, {"Content-Type": "application/json"},
		'{"response":{"operation-status":"SUCCESS","num-results":0}}']);
		this.collection.filterAndSearch('dla', 'test');
		this.server.respond(); 
		expect(callback.callCount).toBe(2);	  
  	});//END SPEC

  	xit('On calling filtersearch method with author field proper url should be formed', function(){ 
  		this.collection.filterAndSearch('all', 'author:test')
  	})

}); //END DESCRIBE

}); //END MODULE
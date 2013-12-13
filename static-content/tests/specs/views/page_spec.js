define([
'views/page',
'models/user',
'sinon'
],

function(
View,
UserModel,
sinon
) {

describe("VIEW -- page ( parent view for all )", function() { 
  
	beforeEach(function() {  
		$("<input/>", {
	      type:'hidden',
	      id:'username',
	      value:'admin@cfy.com'
	    }).appendTo("body");

	    $("<input/>", {
	      type:'hidden',
	      id:'userrole',
	      value:'admin'
	    }).appendTo("body");
	    
     	this.view = new View({ el:$('#sandbox') }); 
	});     

	afterEach(function() {
	   delete this.view;
	   $('#sandbox').html('');
	});  

	it('For subnav view search event, page view should respond and call filterAndSearch on collection', function(){ 
		sinon.spy(this.view.collection,"filterAndSearch");
		this.view.subNav.trigger('search','test');	
		expect(this.view.collection.filterAndSearch.callCount).toBe(1);
	})
	


});

});
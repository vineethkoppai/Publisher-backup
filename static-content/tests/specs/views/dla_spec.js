define([
'views/grid/dla',
'util/dlaData',
'models/dla',
'datejs'],

function(
View,
modelData,
Model,
datejs) {

describe("VIEW -- DLA ", function() {  

  
    beforeEach(function() {     
        var self = this;  
        this.model = new Model(modelData);
        this.view = new View({  model:this.model });         
    });     

    afterEach(function() {
        delete this.view;
        $('#sandbox').html('');
    });  

    it('when modified date is not present DLA view should show created date as modified date', function(){  
         var $sandbox  = $('#sandbox')
         //DELETE MODIFIED DATE FROM MODEL
         this.model.unset('modified-date');   
         $('#sandbox').append(this.view.render().el);
         expect($sandbox.find('#dateSpan').text().trim()).toBe(Date.parse(this.view.model.get('created-date').substring(0, 8)).toString('MM/dd/yy') );    
      })

});



});
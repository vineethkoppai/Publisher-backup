
define(
['jquery', 
'underscore', 
'backbone' ,
'constants' , 
'text!templates/subnav/bulkUpload.html',
'mapping',
'messages'
],

function(
$,
_ ,
Backbone ,
constants ,
bulkUploadTemplate,
xlJsonMapping,
messages
) {



var BulkUploadView = Backbone.View.extend({
  el: 'body',
  template:bulkUploadTemplate,

  events:{
    'click #closeBulkupload':'closeBox',
    'click #btnBulkupload': 'readWrite'
  },

  initialize:function(){
    this.rootEl = '#bulkUploadDiv';    
    this.jsonProperties = ['id','url','state','status', 'error-message'];
    this.radioButtons = ['audio-support', 'multi-player', 'teaches-content'];
    this.render();
  },

  render: function() {
    var self=this;
    $(this.rootEl).html(this.template);
  },  

  showBulkUpload:function(){    
    $.extend($.facebox.settings, { modal : true });
      $(document).bind('loading.facebox', function() {
          $("#facebox_overlay").unbind("click").click(function(){
             if (!$.facebox.settings.modal) {
               $(document).trigger('close.facebox');
             }
          })
      })
      
      $.facebox({
            div: '#bulkUploadDiv'
        });
      $('#facebox.content').addClass('bulkupload');
      $('.content').addClass('centerFacebox');
     
  },

  readWrite:function(){
      this.spinner = $('#facebox #imgBulkuploadLoading');
      this.errorMsg = $('#facebox #bulkuploadErrorMsg');
      this.successMsg = $('#facebox #bulkuploadSuccessMsg');
      this.fileControl = $('#facebox #filename');
      this.btnsDiv = $('#facebox #bulkuploadDiv');
      this.btnsDiv.hide();
      this.spinner.show(); 
      this.errorMsg.empty();
      this.successMsg.empty();  
      var inputSheet, resultSheet, fso, file, path, ws, rows, resultArray = new Array(), jsonArray = new Array(), i, j, columnCount;
      
      if(!$.browser.msie){
        this.btnsDiv.show();
        this.spinner.hide();
        this.errorMsg.append('<li>'+messages.activexNotFound+'</li>');
      }else if(! this.fileControl.val()){
         this.errorMsg.append('<li>'+messages.noFile+'</li>');
         this.btnsDiv.show();
         this.spinner.hide();            
      }else{                    
         try{  
            var arr = this.fileControl.val().split('.');
            if(arr[arr.length-1] !== 'xls' && arr[arr.length-1] !== 'xlsx')
               throw messages.incorrectFile; 
             
            this.excel = new ActiveXObject("Excel.Application");  
            this.excel.Visible = false;
            this.excel.DisplayAlerts = false;
            fso = new ActiveXObject("Scripting.FileSystemObject");
            path = fso.getFile(this.fileControl.val());
            this.excelFile = this.excel.Workbooks.Open(path); 
            inputSheet = this.excelFile.Worksheets(1);
            rows =  inputSheet.usedrange.rows.count;
            columnCount = inputSheet.usedrange.columns.count;
            //VALIDATE COLUMN NAMES
            for(i=1; i<columnCount+1; i++){
             if(! inputSheet.Cells(1,i).Value ){
                 throw messages.invalidFile;                
             }else if(!xlJsonMapping[inputSheet.Cells(1,i).Value.trim().toLowerCase()]){
                 throw "Column name "+"'"+inputSheet.Cells(1,i).Value+"'"+" is invalid";
             }else if(this.excelFile.ReadOnly){
                throw messages.fileAlreadyopen;
             }            
            }

            ws = this.excelFile.Worksheets;
            resultSheet = ws.Add(After=this.excelFile.Worksheets(this.excelFile.Worksheets.Count));
            resultSheet.Name = "Bulk-upload Results";
            this.upload(rows, columnCount, inputSheet, resultSheet);
           
        }catch(e){
           this.btnsDiv.show();          
           this.spinner.hide();
           console.log(e);
          if (e.number == -2146827859){
              this.errorMsg.append("<li>"+messages.iesettingMsg+"</li>");
              this.errorMsg.append("<li>"+messages.fileSettings+"</li>");
          }else if(e.number == -2146828235){
              this.errorMsg.append("<li>"+messages.fileSettings+"</li>");
          }else{
             this.errorMsg.append("<li>"+e+"</li>");
          } 
          this.closeResources();      
        }finally{
          this.fileControl.val('');
        }  
      }
   
  },
  
  //ITERATE ON INPUT SHEET AND MAKE ARRAY OF 20 JSONS AND DO AJAX CALL, RECURSIVELY CALL ITSELF 
  upload:function(rowCount, columnCount, inputSheet, resultSheet){ 
            if(!this.rowCounter){
              this.rowCounter = 2;
              this.btnsDiv.hide();
              this.spinner.show(); 

            }
          try{   
            var jsonArray = new Array();
            for( ;this.rowCounter<=rowCount; this.rowCounter++){
                   
                       var json = {};
                      for( j=1; j<columnCount+1; j++){
                         var propertyName = xlJsonMapping[inputSheet.Cells(1,j).Value.trim().toLowerCase()]
                         var data = inputSheet.Cells(this.rowCounter,j).Value; 
                         if(data && propertyName && propertyName !=='invalid'){
                            if(propertyName=='state'){
                              data = String(data).toUpperCase();
                              data=data.replace(/ /g,"_");
                            }                        
                            if(propertyName.indexOf('list') > -1)
                              json[propertyName]= data.split('\n');
                            else
                               json[propertyName]= data;
                         }else if(propertyName && _.contains(this.radioButtons, propertyName)){
                           json[propertyName]= false;
                         }                                   
                     }
                     if(!_.isEmpty(json))
                      jsonArray.push(json);
                     if(jsonArray.length>19 || this.rowCounter == rowCount){  
                          var dlasToPost = {} ; 
                          dlasToPost.dlas = jsonArray;
                          var self = this; 
                            $.ajax({
                            type:"POST",
                             contentType: 'application/json',
                             url: constants.bulkupload,
                             data:JSON.stringify(dlasToPost),
                             success: function (data) {
                                  self.writeToFile(data.response, resultSheet);                  
                                  if(self.rowCounter < rowCount){
                                    jsonArray = [];
                                    self.upload(rowCount, columnCount, inputSheet, resultSheet)
                                  }else{
                                    self.successMsg.append("<li>"+messages.bulkuploadSuccess+"</li>");
                                    self.closeResources();
                                  }
                                    
                             },
                             error: function (e) {
                                      console.log(JSON.stringify(e));
                                      self.closeResources();
                             }
                          })//ajax end
                          this.rowCounter++;
                          break;   
                     } //end if   
            }//end for  
             }catch(e){
                      console.log(e);
                      self.closeResources();
            }               
  },

  writeToFile:function(data, resultSheet){    
      
    try{
         if(!this.writeCounter){
          this.writeCounter = 1;
          for(var i=1;i<=5;i++){
             resultSheet.Cells(1, i).Value = this.jsonProperties[i-1];
          }
        }
        if(data && data.dlas.length > 0){
           data = data.dlas; 
           for(var i=0; i<data.length; i++,this.writeCounter++){
                  var json = data[i];
                   for(j=0; j<5; j++){
                       if(json[this.jsonProperties[j]])
                       resultSheet.Cells(this.writeCounter+1, j+1).Value = json[this.jsonProperties[j]];
                     if(this.jsonProperties[j] == 'state')
                       resultSheet.Cells(this.writeCounter+1, j+1).Value = json[this.jsonProperties[j]].replace(/_/g," ");
                   }               
          }
          //BULK UPLOAD AND WRITE TO FILE COMPLETED
          this.trigger('complete');
        }
    }catch(e){
      console.log(e);
      this.closeResources();
    }  
  },
  
  //On any exception close all resorces
  closeResources:function(){
    try{
       this.excelFile.save();
      this.excel.DisplayAlerts = true;
      this.excel.Quit();
      this.excel.Application.Quit();
      this.excel = null;                                    
      this.fileControl.val('');
      this.btnsDiv.show();
      this.spinner.hide();
      delete this.rowCounter;
      delete this.writeCounter;
      }catch(e){
        console.log(e);
      }
     
  },

  closeBox:function(){
    $("#bulkUploadDiv").trigger('close.facebox');
    $("#bulkUploadDiv").hide();
    this.closeResources();
  },

  hide:function(){
    $("#bulkUploadDiv").trigger('close.facebox');
     $("#bulkUploadDiv").hide();
  } ,

  show:function(){ 
    this.showBulkUpload();  
    this.errorMsg = $('#facebox #bulkuploadErrorMsg');
    this.btnsDiv = $('#facebox #bulkuploadDiv');
     if(!$.browser.msie){
        this.btnsDiv.hide();
        $('#facebox #iemsg').hide();
        this.errorMsg.append('<li>'+messages.activexNotFound+'</li>');
    }

  }
 
});

return BulkUploadView;

});

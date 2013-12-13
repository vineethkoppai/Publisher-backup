//TO LOAD THE FUNCTIONS WHICH ARE EXPECTED TO BE AVAILABLLE IN GLOBAL SCOPE

(function(){	
			DropDown = function (el) {
				if(el){
					this.dd = el;
					this.placeholder = el.children('span');
					this.opts = this.dd.find('ul.dropdown > li');
					this.val = '';
					this.index = 0;
					this.initEvents();
				}
			};

			DropDown.prototype = {
				initEvents : function() {
					var obj = this;
					if(!obj.dd) return;
					obj.dd.on('click', function(event){
						if($(this).hasClass('active'))
						  $(this).removeClass('active');
						else{
						  $('.wrapper-dropdown-3').removeClass('active');
						  $(this).addClass('active');
						}
						
						return false;
					});

					obj.opts.on('click',function(){
						var opt = $(this);
						obj.val = opt.text();
						obj.index = opt.index();
						obj.placeholder.text(obj.val);
						obj.placeholder.val(opt.attr('id'));
					});
				},
				getValue : function() {				
					return this.val;
				},

				getIndex : function() {
					return this.index;
				}
			}

			$(function() {		
				$(document).click(function() {
					$('.wrapper-dropdown-3').removeClass('active');
				});

			});

			CountLeft = function (field, count, max){
				if (field.value.length > max)
					field.value = field.value.substring(0, max);
				else
					count.value = max - field.value.length;
		   }    
}())	


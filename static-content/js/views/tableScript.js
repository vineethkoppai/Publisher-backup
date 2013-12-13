function change()
{
		var srcs="imgs/sort_up.png";
				
				document.getElementById("ima").src=srcs;
				srcs="imgs/sort_down.png";
			
	
//	if(document.getElementById("sort_img").style.visibility="hidden"){
//		
//		document.getElementById("sort_img").style.visibility="visible";
//		document.getElementById("sort_img1").style.visibility="hidden";
//	}
//	else{
//		document.getElementById("sort_img").style.visibility="hidden";
//		document.getElementById("sort_img1").style.visibility="visible";	
//	}
//	  document.getElementById('sort_img').style['-webkit-transform'] = 'rotate(95deg)';
	  }


function toggle(source) 
{
	  var checkboxes = document.getElementsByName('Tchbx');
	  for(var i in checkboxes)
	  {
	    checkboxes[i].checked = source.checked;
	  }
}

function childchk(child)
{
	
	var ch=document.getElementsByName("Tchbx");
	
	  document.getElementById("chbx1").checked=child.checked;

}


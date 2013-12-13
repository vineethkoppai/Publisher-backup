// $(document).ready(function() {
//   var baseURL = '/PMLPublisher/rest-services/user-services/';
//     // show forget pwd div on click of forgot pwd
// 	$("#frgt").click(function(){
// 	console.log("forgot pwd");
// 	$('#loginDiv').hide();
// 	$('#forgotPwd').show();
      
//       //on click of cancel show the login div again
// 		$('#forgot_cancel').click(function(){
// 			$('#loginDiv').show();
// 		    $('#forgotPwd').hide();
// 		    $('#result').html('');
// 		    return false;
// 		});
//     });

//     //setup before functions
//     var typingTimer;                //timer identifier
//     var doneTypingInterval = 1000;  //time in ms, 5 second for example

//     //on keyup, start the countdown
//     $('#forgot-email').keyup(function(){
//         $('#result').removeClass('noEmailExists');
//         $('#result').html('');
//         clearTimeout(typingTimer);
//         if ($('#forgot-email').val) {
//             typingTimer = setTimeout(function(){
//                 //do stuff here e.g ajax call etc....
//                 console.log("done typing");
//                 var data = { username:$('#forgot-email').val()};
//                 jQuery.ajax({
//                   url: baseURL+'isUserExists',
//                   type: "post",
//                   data:JSON.stringify(data) ,
//                   dataType: "json",
//                   contentType: "application/json",
//                   success: function(result) {
//                    console.log("success::"+result);
//                    if(result===false){
//                       $('#result').addClass('noEmailExists');
//                       $('#result').html('This email is not in our database');
//                    }
//                   },
//                   error:function(error){
//                     console.log("error with rest call");
//                   }
//                });
//             }, doneTypingInterval);
//         }
//     });

//     // on click of send btn on forgot pwd form
//     $('#forgot_send').click(function(){
//         var data = { username:$('#forgot-email').val()};
//         console.log(data);

//         jQuery.ajax({
//           url: baseURL+'forgotpwdmail',
//           type: "POST",
//           data:JSON.stringify(data) ,
//           dataType: "json",
//           contentType: "application/json",
//           success: function(result) {
//            console.log("success");
//           },
//           error:function(error){
//             console.log("errr");
//           }
//          });
//     	return false;
//     });



// });

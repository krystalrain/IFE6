var hidden=0;
		$(".menulist").hide();
		$(".divmenu").hide();
		 $(function () {
             $(".listtitle1").bind("click", function () {
                 if ($(".listtitle1+ul").hide()) {
                 $(".listtitle1+ul").show("fast",function(){
                         $("#hidval").val(1);
                         $(".listtitle2+ul").hide("fast");
                         $(".listtitle3+ul").hide("fast");
                         $(".listtitle4+ul").hide("fast");
                         
                     })
                 } 
                 else if ($(".listtitle1+ul").show()) {
                 $(".listtitle1+ul").hide("fast");
                 /*$(".listtitle1").show();*/              
                 }
             })
         });
		 $(function () {
             $(".listtitle2").bind("click", function () {
                 if ($(".listtitle2+ul").hide()) {
                 $(".listtitle2+ul").show("fast",function(){
                         $("#hidval").val(1);
                         $(".listtitle1+ul").hide("fast");
                         $(".listtitle3+ul").hide("fast");
                         $(".listtitle4+ul").hide("fast");
                     })
                 } else if ($(".listtitle2+ul").show()) {
                 $(".listtitle2+ul").hide("fast");
                 /*$(".listtitle2").show();*/
                 }
             })
         });
		 $(function () {
             $(".listtitle3").bind("click", function () {
                 if ($(".listtitle3+ul").hide()) {
                 $(".listtitle3+ul").show("fast",function(){
                         $("#hidval").val(1);
                         $(".listtitle1+ul").hide("fast");
                         $(".listtitle2+ul").hide("fast");
                         $(".listtitle4+ul").hide("fast");
                     })
                 } else if ($(".listtitle3+ul").show())  {
                 $(".listtitle3+ul").hide("fast");
                 /*$(".listtitle3").show();*/
                 }
             })
         });
		 $(function () {
             $(".listtitle4").bind("click", function () {
                 if ($(".listtitle4+ul").hide()) {
                 $(".listtitle4+ul").show("fast",function(){
                         $("#hidval").val(1);
                         $(".listtitle1+ul").hide("fast");
                         $(".listtitle3+ul").hide("fast");
                         $(".listtitle2+ul").hide("fast");
                     })
                 } else if ($(".listtitle4+ul").show()) {
                 $(".listtitle4+ul").hide("fast");
                 /*$(".listtitle4").show();*/
                 }
             })
         });
		 $(function () {
             $(".menubtn img").bind("click", function () {
                 if ($("#hidval").val() == 0) {$(".divmenu").css("border-color","white")
                 $(".divmenu").show("fast",function(){
                         $("#hidval").val(1);
                         $(".menubtn").css("margin-left","33.33%");
                         
                     })
                 } else {
                 $(".divmenu").hide("fast",function(){
                         $("#hidval").val(0);
                         $("ul").hide("fast");
                         $(".menubtn").css("margin-left","0px");
                     })
                 }
             })
         });
		 
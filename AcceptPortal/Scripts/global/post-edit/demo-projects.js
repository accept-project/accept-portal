$(document).ready(function () 
{
    $("#divMainContainerPortal").css("width", "1540px");
    $("#divGlobalHeaderMargin").css("margin-top", "50px");
              
    $('b[id^="deleteProjectAnchor"]').click(function () 
    {                       
        var splittedId = $(this).attr("id").split('&');            
        $("#modalDeleteProject").dialog({              
            width:'auto',
            height:'auto',
            modal: true,
            buttons: [
            {
                text:yesLabel,
                click: function()
                {                                                                                                          
                    var url = $(document).find('a[name="deleteProj_&' + splittedId[1] + '"]').attr("href");
                    window.location.href = url;
                    $(this).dialog("close");                    
                }
            },
            {
                text:noLabel,
                click: function()
                {                                                      
                    $(this).dialog("close");                    
                }
            }]          
        });             
    });
   
    if(updatedProjName != null)
    {
        $("#modalProjectUpdated").dialog({          
            width:'auto',
            height:'auto',
            modal: true,
            buttons: [
            {
                text:"Ok",
                click: function()
                {                                                                              
                    $(this).dialog("close");                    
                }
            }]          
        });

        $("#modalProjectUpdated").dialog('open');
    
    } 
    $("#divMain").show();
   
    createDataTable("#tblProjectsList");  
});
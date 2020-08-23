const baseUrl =  "http://b9eeffe266d3.ngrok.io/";
const userToken = "gAAAAABfQPebdvm2gNf4b1SG0_EWWw7bsik76NWBUwjDi9eFqLf-S9z5Z9K1qt3t1JUJoMeA3D_IYNsLM_QIqNeJkNpfQG-aeXQSHtO8hydKyj7ogl-2NlzDw5oivI5SDFamoa2zz_AASSFyWMKFH9OuIwV6HDfSoEo-Wzvwmun9U8-Ww-yEjcHuqnR45nQTPxNQMLFj63RnUKv2BS3ZMr5crFVMqwkJVQ==";

let fileinfo = null

const getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

const filename = getUrlParameter('filename');

const setupFileOrigin = function(data){
    $("#fileName").html(data.fileTitle);

    $("#preview-original").attr('src', baseUrl+filename+'/generate/original');
    $(".loading-container.original").hide();
    $("#preview-original").show();
}

const setupSignedfile = function(){
    $(".signature-title").html("File Signature");

    $("#preview-signature").attr('src', baseUrl+filename+'/generate/signature');
    $(".loading-container.signature").hide();
    $('.sign-button-container').hide();
    $("#preview-signature").show();

    $(".verify-file").show();
    $(".verify-file").attr("href",'verify.html?filename='+filename );
    $(".download-signature").show();
    $(".download-signature").attr("href",baseUrl+filename+'/generate/signature' );
    $(".download-signature").prop('download', true);
}

$(document).ready(function(x){
    $.ajax({
        'url': baseUrl+filename+'/info',
        'method': 'GET',
        'success': function(data){
            fileinfo = data.data
            setupFileOrigin(data.data);

            if(fileinfo.signatureFile != 'null'){
                setupSignedfile()
            }else{
                $('.sign-button-container').removeClass('d-none');
            }
        }
    });

    $(".generate-signature").click(function(x){
        $(".loading-container.signature").removeClass('d-none');
        $('.loading-container.signature .loading-message').html("Generating signature...");
        setTimeout(function(){
            $.ajax({
                url: baseUrl+filename+'/signature',
                method: "POST",
                data: 'token='+userToken,
                success: function(data){
                    if(data.success){  
                        $('.loading-container.signature .loading-message').html("Generating signed file");

                        setTimeout(function(){
                            setupSignedfile()
                        }, 2000)
                    }
                }
            });
        }, 2000)
    });
});

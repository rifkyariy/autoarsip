const baseUrl =  "http://b9eeffe266d3.ngrok.io/";
const userToken = "gAAAAABfQPebdvm2gNf4b1SG0_EWWw7bsik76NWBUwjDi9eFqLf-S9z5Z9K1qt3t1JUJoMeA3D_IYNsLM_QIqNeJkNpfQG-aeXQSHtO8hydKyj7ogl-2NlzDw5oivI5SDFamoa2zz_AASSFyWMKFH9OuIwV6HDfSoEo-Wzvwmun9U8-Ww-yEjcHuqnR45nQTPxNQMLFj63RnUKv2BS3ZMr5crFVMqwkJVQ==";
const email = "muhadifff@gmail.com";
const docs = [];

const showData = function(){
    for(i = 0; i < docs.length; i++){
        let doc = "<div class='card document'><img data-pdf-thumbnail-file='"+baseUrl+docs[i].fileName+'/generate/original'+"' class='img-thumb card-img-top'/><div class='card-body'><a href='index.html?filename="+docs[i].fileName+"'>"+docs[i].fileTitle+"</a></div></div>";
        $('.documents').append(doc);
    }

    createPDFThumbnails();
}

$(document).ready(function(x){
    $.ajax({
        url: baseUrl+'/my-file',
        success: function(d){
            const data = JSON.parse(d.data)

            console.log(data);
            
            for(i = 0; i< data.length; i++){
                if(data[i].owner == 'resource:org.example.User#'+email){
                    docs.push(data[i]);
                }
            }
            showData();
        }
    });
});
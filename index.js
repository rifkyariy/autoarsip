const baseUrl =  "http://b9eeffe266d3.ngrok.io/";

// get all file 
// $.get( `${baseUrl}/my-file`, function( data ) {
//     $( ".result" ).html( data );
//         console.log(JSON.parse(data.data));
// });
  

const storePDF = () => {
    var data = new FormData();
    // get from form
    const form_data = $('#uploadPdfForm').serializeArray();
    
    //add file data to form data
    const file_data = $(`#uploadPdf `)[0].files[0];
    form_data.push({name: "file" , value : file_data});
    
    // embed pdf preview 
    const embedURL = URL.createObjectURL(file_data);
    
    $.each(form_data, function (key, input) {
        data.append(input.name, input.value);
    });
    
    console.log(...data);

    $.ajax({
        url: `${baseUrl}/file-upload`,
        method: "post",
        processData: false,
        contentType: false,
        data: data,
        success: function (result) {
            // console.log(result);
            $('#preview-pdf').attr('src',embedURL);

            generateForm(result.data);
        },
        error: function (e) {
            console.log(e);
            
        },
        done: () => {  
        }
    });
}

const isArray = (a) => {
    return (!!a) && (a.constructor === Array);
};

const isObject = (a) => {
    return (!!a) && (a.constructor === Object);
};

const generateForm = (data) => {
    Object.keys(data).map(function(key, index) {
        const id = `data${index}`;
        const label = key;
        const val = data[key];
        
        console.log(isArray(val));
        
        if(isArray(val)){
            const table =  `
                <div class="table-responsive">
                    <table class="table" id="preview-table"></table>
                </div>
                `
            $(`#preview-form`).append(table);

            val.forEach((elements, index) => {
                if(index == 0){
                    const tablePreContent = `
                    <thead id="preview-table-head">
                        <tr></tr>
                    </thead>
                    <tbody id="preview-table-body"></tbody>
                    `

                    $(`#preview-table`).append(tablePreContent);

                    // elements.forEach(el => {
                    //         $(`#preview-table-head tr`).append(`
                    //             <th>${el}</th>
                    //         `)
                    // });

                }else{
                    $(`#preview-table-body`).append(`
                        <tr></tr>
                    `);
                    // elements.forEach(el => {
                    //     $(`#preview-table-body tr`).append(`
                    //         <td>${el}</td>
                    // `);
                    // });
                }
            });


        }else{
            const formHtml =  `<div class="form-group">
                                   <label for="${id}">${label}</label>
                                   <input type="text" class="form-control" id="${id}" value="${val}">
                               </div>`
            
            $(`#preview-form`).append(formHtml);
        }
        
      });
}

$(document).ready(function(){
    $('#uploadPdfContainer').dropzone({
      url: `${baseUrl}/file-upload`,
      method: 'post'
    });
});




// store pdf 


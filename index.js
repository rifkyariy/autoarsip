const baseUrl =  "http://b9eeffe266d3.ngrok.io";

// get all file 
$.get( `${baseUrl}/my-file`, function( data ) {
    const totalArchive = JSON.parse(data.data).length;
    $(`#totalArchive h3`).html(totalArchive);
});

const storePDF = (file) => {
    var data = new FormData();
    // get from form
    const form_data = $('#uploadPdfForm').serializeArray();
    
    //add file data to form data
    // const file_data = $(`#uploadPdf`)[0].files[0];
    const file_data = file;
    form_data.push({name: "file" , value : file_data});
    
    console.log(file_data);
    
    // embed pdf preview 
    const embedURL = URL.createObjectURL(file_data);
    
    $.each(form_data, function (key, input) {
        data.append(input.name, input.value);
    });

    $.ajax({
        url: `${baseUrl}/file-upload`,
        method: "post",
        processData: false,
        contentType: false,
        data: data,
        success: function (result) {
            $(`.preview-panel`).show();
            updateProgress(100);
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
        
        if(isArray(val)){
            const table =  `
                <label for="${id}">Tabel ${label}</label>
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
                    
                    Object.keys(elements).forEach(el => {
                            $(`#preview-table-head tr`).append(`
                                <th>
                                    <input type="text" class="form-control" name="${label}[${index}]"  value="${elements[el]}">
                                </th>
                            `)
                    });

                }else{
                    $(`#preview-table-body`).append(`
                        <tr></tr>
                    `); 
                    Object.keys(elements).forEach(el => {
                        $(`#preview-table-body tr`).last().append(`
                            <td>
                                <input type="text" class="form-control" name="${label}[${index}]" value="${elements[el]}">
                            </td>
                        `);

                    });
                }
            });


        }else{
            if(label == 'filename'){
                const formHtml =  `<div class="form-group">
                                       <label for="${id}">${label}</label>
                                       <input type="text" class="form-control" id="${id}" name="${key}" value="${val}" readonly>
                                   </div>`

                $(`#preview-form`).append(formHtml);
            }else{
                const formHtml =  `<div class="form-group">
                                       <label for="${id}">${label}</label>
                                       <input type="text" class="form-control" id="${id}" name="${key}" value="${val}">
                                   </div>`

                $(`#preview-form`).append(formHtml);
            }
            
        }
        
      });
}

$(`#update-detail-form`).on('click', () => {
    const token = localStorage.getItem("Usertoken"); 
    let formData = $('#preview-form').serializeFormJSON();
    
    let arrTemp = [];
    Object.keys(formData).forEach(x => {
        if(isArray(formData[x])){   
            formData[x] = {...formData[x]}
            arrTemp.push(formData[x]);
            delete formData[x];
        }
    });

    // note : items berikut bisa diganti nanti sehingga lebih dinamis
    formData['items'] = arrTemp;
    
    const data = {'data': formData};
    console.log(data);
    
    // console.log(`${baseUrl}/${formData.filename}/save`, token, JSON.stringify(data));
    
    // send to blockchain
    $.ajax({
        url: `${baseUrl}/${formData.filename}/save`,
        method: "post",
        data: {
            "document_data" : JSON.stringify(data),
            "token" : token,
            "file_title" : formData.filetitle
        },
        success: function (result) {
            if(result.success == true){

            }
        },
        error: function (e) {
            console.log(e);
        },
        done: () => {  
        }
    });
})

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        
        return o;
    };
})(jQuery);

let dropArea = document.getElementById("drop-area")

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

let uploadProgress = []
let progressBar = document.getElementById('progress-bar');

function initializeProgress(numFiles) {
    $(`#progress-bar`).show();
    progressBar.value = 0
    uploadProgress = []
  
    for(let i = numFiles; i > 0; i--) {
      uploadProgress.push(0)
    }
  }

  function updateProgress(percent) {
    let total = percent;
    progressBar.value = total
  }
  
  function handleFiles(files) {
    files = [...files]
    initializeProgress(files.length)
    storePDF(files[0]);
  }



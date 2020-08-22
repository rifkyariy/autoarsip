const baseUrl =  "http://b9eeffe266d3.ngrok.io";

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

const verifyPDF = (file) => {
    var data = new FormData();
    // get from form
    const form_data = $('#uploadPdfForm').serializeArray();
    
    //add file data to form data
    // const file_data = $(`#uploadPdf`)[0].files[0];
    const file_data = file;
    form_data.push({name: "file" , value : file_data});
    
    // embed pdf preview 
    const embedURL = URL.createObjectURL(file_data);
    
    $.each(form_data, function (key, input) {
        data.append(input.name, input.value);
    });

    $.ajax({
        url: `${baseUrl}/${filename}/verify`,
        method: "post",
        processData: false,
        contentType: false,
        data: data,
        success: function (result) {
            if(result.message == "Signature Verified"){
                $(`.file-verified`).toggle();
            }else{
                $(`.file-unverified`).toggle();
            }
            
            $('#preview-pdf').attr('src',embedURL);
            $(`.preview-panel`).show();
            $('#preview-pdf')
            updateProgress(100);
        },
        error: function (e) {
            console.log(e);
        },
        done: () => {  
        }
    });
}


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
    verifyPDF(files[0]);
  }



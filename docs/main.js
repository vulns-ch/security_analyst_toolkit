const inputFiles = [];
const outputFiles = [];

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);

    };
    reader.onerror = error => reject(error);
  });
}

function addInputFile(file) {
var filename = file.name;
getBase64(file).then(
function(encoded) {dataDevice.writeFile("/."+filename+".b64", encoded).then(
function(args) {cx.run("/bin/bash", ["-c", "cat '/data/."+filename+".b64' | base64 -d > '/home/user/input/"+filename+"'"], {
        env: [
          "HOME=/home/user",
          "USER=user",
          "SHELL=/bin/bash",
          "EDITOR=vim",
          "LANG=en_US.UTF-8",
          "LC_ALL=C",
        ],
        cwd: "/home/user",
        uid: 0,
        gid: 0,
      })}
)

;});

}

async function listOutputFiles() {
await cx.run("/bin/bash", [
  "-c",
  "ls -1 /home/user/output > /home/user/output/.list",
]);
outputfilelist=(await (await idbDevice2.readFileAsBlob("/.list")).text()).split("\n")
outputfilelist.pop()
return outputfilelist

}


function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function createFileItem(file, index, fileArray, listElement, area, prompt) {
    const item = document.createElement('div');
    item.className = 'file-item';
    
    const info = document.createElement('div');
    info.className = 'file-info';
    
    const name = document.createElement('div');
    name.className = 'file-name';
    name.textContent = file.name;
    name.title = file.name;
    
    const size = document.createElement('div');
    size.className = 'file-size';
    size.textContent = formatFileSize(file.size);
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'file-remove';
    removeBtn.textContent = '×';
    removeBtn.onclick = (e) => {
        e.stopPropagation();
        fileArray.splice(index, 1);
        renderFileList(fileArray, listElement, area, prompt);
    };
    
    info.appendChild(name);
    info.appendChild(size);
    item.appendChild(info);
    item.appendChild(removeBtn);
    
    return item;
}


function renderFileList(fileArray, listElement, dropZone) {
    listElement.innerHTML = '';
    if (fileArray.length > 0) {
        dropZone.classList.add('has-files');
    } else {
        dropZone.classList.remove('has-files');
    }
    fileArray.forEach((file, index) => {
        listElement.appendChild(createFileItem(file, index, fileArray, listElement, dropZone));
    });
}

function handleFiles(files, fileArray, listElement, area, prompt) {
    Array.from(files).forEach(file => {
      fileArray.push(file);
      // Execute addInputFile function when file is added
      if (area.id === 'inputArea' && typeof addInputFile === 'function') {
          addInputFile(file);
      }
    });
    renderFileList(fileArray, listElement, area, prompt);
}

function setupDropZone(dropZone, fileInput, fileArray, listElement, area) {
    dropZone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files, fileArray, listElement, dropZone);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        area.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('dragover');
            area.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('dragover');
            area.classList.remove('dragover');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files, fileArray, listElement, dropZone);
    });
}

var saveBlob = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (blob, fileName) {
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

async function downloadOutputFile(filename) {
    blob = await idbDevice2.readFileAsBlob("/"+filename)
    saveBlob(blob, filename)
}

function createOutputFileItem(filename, index) {
    const item = document.createElement('div');
    item.className = 'file-item';
    
    const info = document.createElement('div');
    info.className = 'file-info';
    
    const name = document.createElement('div');
    name.className = 'file-name';
    name.textContent = filename;
    name.title = filename;
    
    const size = document.createElement('div');
    size.className = 'file-size';
    size.textContent = 'Output file';
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'file-download';
    downloadBtn.textContent = ' ↓ ';
    downloadBtn.onclick = async (e) => {
        e.stopPropagation();
        await downloadOutputFile(filename);
    };
    
    info.appendChild(name);
//    info.appendChild(size);
    item.appendChild(info);
    item.appendChild(downloadBtn);
    
    return item;
}

document.getElementById('refreshBtn').addEventListener('click', async (e) => {
    e.stopPropagation();
    console.log('Refreshing output files...');
    
    try {
        const filenames = await listOutputFiles();
        const outputListElement = document.getElementById('outputFileList');
        const outputArea = document.getElementById('outputArea');
        const outputPrompt = document.getElementById('outputPrompt');
        
        outputListElement.innerHTML = '';
        
        if (filenames.length > 0) {
            outputArea.classList.add('has-files');
        } else {
            outputArea.classList.remove('has-files');
        }
        
        filenames.forEach((filename, index) => {
            outputListElement.appendChild(createOutputFileItem(filename, index));
        });
        
        console.log(`Output files refreshed: ${filenames.length} file(s) found`);
    } catch (error) {
        console.log(`Error refreshing output files: ${error.message}`);
    }
});

setupDropZone(
    document.getElementById('inputArea'),
    document.getElementById('inputFileInput'),
    inputFiles,
    document.getElementById('inputFileList'),
    document.getElementById('inputPrompt')
);

//setupDropZone(
//    document.getElementById('outputArea'),
//    document.getElementById('outputFileInput'),
//    outputFiles,
//    document.getElementById('outputFileList'),
//    document.getElementById('outputPrompt')
//);


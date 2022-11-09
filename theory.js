const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'Data');

function getFiles(){
    let result = [];
    let files = fs.readdirSync(directoryPath);
    files.forEach(function (file) {
        if (fs.lstatSync(directoryPath+"\\"+file).isFile()) {
            result.push({name: path.parse(file).name, file: file});
        }
    });
    return result;
}

function searchFile(text){
    let result = [];
    if (text.trim() == "") {
        result = getFiles();
    }
    else {
        let files = fs.readdirSync(directoryPath);
        files.forEach(function (file) {
            if (fs.lstatSync(directoryPath + "\\" + file).isFile()) {
                if (path.parse(file).name.toLowerCase().includes(text.trim().toLowerCase()) || 
                    fs.readFileSync(directoryPath + "\\" + file, 'utf8').toLowerCase().includes(text.trim().toLowerCase())) {
                        
                    result.push({name: path.parse(file).name, file: file});
                }
            }
        });
    }
    return result;
}

function readFile(file){
    let text  = fs.readFileSync(directoryPath + "\\" + file, 'utf8');
    text = text.replace("\n","<br>");
    let fileInfo = {
        name: path.parse(file).name,
        text: text
    };
    return fileInfo;
}

function deleteFile(file){
    fs.unlink(directoryPath+"\\"+file, err => {
        if(err) throw err;
        console.log('Файл видалено');
    });
}

function openEditor(name){
    let text = "";
    if (name != "") {
        text += fs.readFileSync(directoryPath + "\\" + name, 'utf8');
    }
    let fileInfo = {
        fullName: name,
        name: path.parse(name).name,
        text: text
    };
    return fileInfo;
}

function save(name, text) { 	
    fs.writeFileSync(directoryPath+"\\"+name+".txt", text);
    console.log('Файл збережено');
}

function edit (name, text, oldname) {
    fs.writeFileSync(directoryPath+"\\"+oldname, text);
    fs.rename(directoryPath+"\\"+oldname, directoryPath+"\\"+name + ".txt", err => {
        if(err) throw err;
        console.log('Файл відредаговано');
     });
}

module.exports.getFiles = getFiles;
module.exports.readFile = readFile;
module.exports.deleteFile = deleteFile;
module.exports.openEditor = openEditor;
module.exports.save = save;
module.exports.edit = edit;
module.exports.searchFile = searchFile;
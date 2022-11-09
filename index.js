const express = require("express");

let matrix = require("./matrix");
let theory = require("./theory");
   
const app = express();

app.set('view engine', 'ejs');
   
app.use(express.static('public'));

const urlencodedParser = express.urlencoded({extended: false});
  
app.get("/", function (request, response) {
    response.render("../views/index");
});
app.get("/theory", function (request, response) {
    let files = theory.getFiles();
    response.render("../views/theory", {files: files});
});
app.get("/editor", function (request, response) {
    let files = theory.getFiles();
    response.render("../views/editor", {files: files});
});
 
app.get("/calculator", function (request, response) {
    response.render("../views/calculator");
});
app.get("*", function(request,response){
    response.status(404).render("../views/error");
});

app.post("/", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
   
    if (request.body.category === "theory") {
        response.redirect("/theory");
    }
    else if (request.body.category === "calculator") {
        response.redirect("/calculator");
    }
});


app.post("/theory", urlencodedParser, function (request, response) {
  
    if (request.body.themeName != undefined) {
        let fileInfo = theory.readFile(request.body.themeName);
        response.render("../views/fileInfo", {file: fileInfo});
    }
    else if (request.body.editor != undefined) {
        response.redirect("/editor");
    }
    else if (request.body.searchBtn != undefined) {
        let files = theory.searchFile(request.body.search);
        response.render("../views/theory", {files: files});
    }
});

app.post("/editor", urlencodedParser, function (request, response) {
   
    if (request.body.delete != undefined) {
        theory.deleteFile(request.body.theme);
        response.redirect("/editor");
    }
    else if (request.body.new != undefined) {
        let fileInfo = theory.openEditor("");
        response.render("../views/fileEditor", {fileInfo: fileInfo});
    }
    else if (request.body.edit != undefined) {
        let fileInfo = theory.openEditor(request.body.theme);
        response.render("../views/fileEditor", {fileInfo: fileInfo});
    }
    else if (request.body.save != undefined) {
        if (request.body.name != "" && request.body.text != "") {
            if (request.body.oldName != "") {
                theory.edit(request.body.name, request.body.text, request.body.oldName );
            }
            else {
                theory.save(request.body.name, request.body.text);
            }
            response.redirect("/editor");
        }
    }
});

app.post("/calculator", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    
    if (request.body.back != undefined) {
        response.redirect("/calculator");
    }

    let matrix1 = request.body.digits.slice(0, request.body.row[0] * request.body.col[0]);
    let matrix2 = request.body.digits.slice(request.body.row[0] * request.body.col[0]);

    let resMatrix;
    let resultMatrix;
    let transposition = "";
    if (request.body.transposition != undefined) {
        matrix1 = matrix.matrixToTwoDimensionalArray(matrix1, request.body.row[0], request.body.col[0]);
        matrix2 = matrix.matrixToTwoDimensionalArray(matrix2, request.body.row[1], request.body.col[1]);

        resMatrix = (request.body.transposition == 1) ? matrix.transposition(matrix1) : matrix.transposition(matrix2);

        resultMatrix = matrix.printResult((request.body.transposition == 1) ? matrix1 : matrix2, "<i>T</i>", resMatrix, '');
    }

    else if (request.body.mulBtn != undefined) {
        matrix1 = matrix.matrixToTwoDimensionalArray(matrix1, request.body.row[0], request.body.col[0]);
        matrix2 = matrix.matrixToTwoDimensionalArray(matrix2, request.body.row[1], request.body.col[1]);
        
        resMatrix =  (request.body.mulBtn == 1) ? matrix.mulOnNumber(matrix1, request.body.mulDigit[0]) : matrix.mulOnNumber(matrix2, request.body.mulDigit[1]);

       resultMatrix = matrix.printResult((request.body.mulBtn == 1) ? matrix1 : matrix2, (request.body.mulBtn == 1) ? request.body.mulDigit[0] : request.body.mulDigit[1], resMatrix, '×');
    }

    else {
        matrix1 = matrix.matrixToTwoDimensionalArray(matrix1, request.body.row[0], request.body.col[0]);
        matrix2 = matrix.matrixToTwoDimensionalArray(matrix2, request.body.row[1], request.body.col[1]);

        switch(request.body.operation){
            case '+':
                resMatrix = matrix.plus(matrix1, matrix2);
                break;
            case '-':
                resMatrix = matrix.minus(matrix1, matrix2);
                break;
            case '×':
                resMatrix = matrix.mul(matrix1, matrix2);
                break;
        }
        
        resultMatrix = matrix.printResult(matrix1, matrix2, resMatrix, request.body.operation);
        
        if (request.body.T && Array.isArray(resMatrix)) {
                transposition += "<div style='margin-top:20px;' class='text result'>Транспонування</div>";
                let resT = matrix.transposition(resMatrix);
                transposition = matrix.printResult(resMatrix, "<i>T</i>", resT, '');
        }
    }

    response.render("../views/result", {result: resultMatrix, transposition: transposition});
});
   
app.listen(3000, ()=>console.log("Server start... "));
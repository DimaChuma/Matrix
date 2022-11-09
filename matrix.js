function create(row, col, values){
    let matrix = '';
    for (let r = 1; r <= row; r++){
        for(let c = 1; c <= col; c++){
            matrix += `<input type='text' name='digits' value='` + values[r-1][c-1] + `' placeholder='0' readonly='true' class='digit `;
            let classes = "";
            if (c == 1 && r == 1) {
                classes += "topLeft ";
            }
            else if (c == col && r == 1) {
                classes += "topRight "; 
            }
            else if (c == 1 && r == row) {
                classes += "bottomLeft "; 
              
            }
            else if (c == col && r == row) {
                classes += "bottomRight "; 
              
            }
			if(c%col != 0){
				if(r > 1){
                    classes += "top right "; 
				}
				else{
                    classes += "right "; 
				}
			}
			else if(c%col == 0 && r > 1) {
                classes += "top "; 
			}
            matrix += classes + "'/>";
        }
    }
    return matrix;
}

function plus(matrix1, matrix2){
    let resMatrix = new Array();
    if (matrix1.length != matrix2.length || matrix1[0].length != matrix2[0].length) {
        return "<div class='text res'>Для операції додавання, матриці повинні бути одинакового розміру!</div>"
    }
    for (let r = 0; r < matrix1.length; r++) {
        let array = new Array();
        for (let c = 0; c < matrix1[0].length; c++) {
            array[c] = matrix1[r][c] + matrix2[r][c];
        }
        resMatrix[r] = array;
    }

    return resMatrix;
}

function minus(matrix1, matrix2){
    let resMatrix = new Array();
    if (matrix1.length != matrix2.length || matrix1[0].length != matrix2[0].length) {
        return "<div class='text res'>Для операції віднімання, матриці повинні бути одинакового розміру!</div>"
    }
    for (let r = 0; r < matrix1.length; r++) {
        let array = new Array();
        for (let c = 0; c < matrix1[0].length; c++) {
            array[c] = matrix1[r][c] - matrix2[r][c];
        }
        resMatrix[r] = array;
    }
    return resMatrix;
}

function mul (matrix1, matrix2) {
    let resMatrix = new Array();
    if (matrix1[0].length != matrix2.length) {
        return "<div class='text res'>Для операції множення, кількість стовпців матриці <i>A</i> повинні дорівнювати кількості рядків матриці <i>B</i>!</div>"
    }
    for (let r = 0; r < matrix1.length; r++) {
        let array = new Array();
        for (let cb = 0; cb < matrix2[0].length; cb++) {
            let res = 0;
            for (let ca = 0; ca < matrix1[0].length; ca++) {
                res += matrix1[r][ca] * matrix2[ca][cb];
            }
            array[cb] = res;
        }
        resMatrix[r] = array;
    }
    return resMatrix;
}

function transposition(matrix){
    let newMatrix = new Array();
    for (let c = 0; c < matrix[0].length; c++) {
        let array = new Array();
        for (let r = 0; r < matrix.length; r++) {
            array[r] = matrix[r][c];
        }
        newMatrix[c] = array;
    }
    return newMatrix;
}

function mulOnNumber(matrix, number){
    let newMatrix = new Array();
    for (let r = 0; r < matrix.length; r++) {
        let array = new Array();
        for (let c = 0; c < matrix[0].length; c++) {
            array[c] = matrix[r][c] * number;
        }
        newMatrix[r] = array;
    }
    return newMatrix;
}

function matrixToTwoDimensionalArray(matrix, row, col){
    let count = 0;
    let newMatrix = new Array();
    for (let r = 0; r < row; r++) {
        let array = new Array();
        for (let c = 0 ; c < col; c++) {
            if (matrix[count] == "") {
                array[c] = 0;
            }
            else{
                array[c] = Number(matrix[count]);
            }
            count ++;
        }
        newMatrix[r] = array;
    }
   return newMatrix;
}

function printResult (matrix1, matrix2, resMatrix, operation){

    let matrix = `
    <div class='matrix' style="grid-template-columns: repeat(` + matrix1[0].length + `, 1fr);">` +
    create(matrix1.length, matrix1[0].length, matrix1) + `
    </div>
    <div class='symbol'>` + operation + `</div>`;
    if (Array.isArray(matrix2)) {
        matrix += `<div class='matrix' style="grid-template-columns: repeat(` + matrix2[0].length + `, 1fr);">`
        + create(matrix2.length, matrix2[0].length, matrix2) + `
        </div>`;
    }
    else {
        matrix += `<div class='symbol' style='margin-left:0px; font-size:50px;'>` + ((matrix2 == "") ? 0 : matrix2) + `</div>`; 
    }

    let result = "";
    if (Array.isArray(resMatrix)) {
        result += `<div class='matrix' style="grid-template-columns: repeat(` + resMatrix[0].length + `, 1fr);">` +
        create(resMatrix.length, resMatrix[0].length, resMatrix) + `
        </div>`;
    }
    else {
        result += resMatrix;
    }

    let resultMatrix = {
        matrix: matrix,
        result: result
    };
    return resultMatrix;
}



module.exports.create = create;
module.exports.transposition = transposition;
module.exports.mulOnNumber = mulOnNumber;
module.exports.matrixToTwoDimensionalArray = matrixToTwoDimensionalArray;
module.exports.plus = plus;
module.exports.minus = minus;
module.exports.mul = mul;
module.exports.printResult = printResult;
 
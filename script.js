'use strict'

let butBlWh = document.getElementById("blackwhite");

let butSimp = document.getElementById("simplif");
let simpRange = document.getElementById("simplrange");

let butToBlack = document.getElementById("toblack");

let myImgPlace = document.getElementById("file");
let myImg;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let canvasOut = document.getElementById("output");
let ctxOut = canvasOut.getContext("2d");

let img = new Image();
let ch;


butBlWh.onclick = function() {
    myImg = myImgPlace.files[0];
    img.src = URL.createObjectURL(myImg);
    ch = 1;
}

butSimp.onclick = function() {
    myImg = myImgPlace.files[0];
    img.src = URL.createObjectURL(myImg);
    ch = 2;
}

butToBlack.onclick = function() {
    myImg = myImgPlace.files[0];
    img.src = URL.createObjectURL(myImg);
    ch = 3;
}

img.onload = function() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxOut.clearRect(0, 0, canvas.width, canvas.height);
    
    canvas.height = canvasOut.height = img.naturalHeight;
    canvas.width = canvasOut.width = img.naturalWidth;

    ctx.drawImage(img, 0, 0);

    switch (ch) {
        case 1:
            blackWhite();
            break;
    
        case 2:
            simplification();
            break;

        case 3:
            negative();
            break;

        default:
            break;
    }
}




function blackWhite() {

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Данные идут в следующем порядке: красная компонента, синяя, зеленая и компонента прозрачность


    // Создание черно-белого изображения

    let red, green, blue, grayscale;

    for (let i = 0; i < imageData.data.length; i += 4) {
        red = imageData.data[i]; // получаем компоненту красного цвета
        green = imageData.data[i + 1];  // получаем компоненту зеленого цвета
        blue = imageData.data[i + 2];   // получаем компоненту синего цвета
        grayscale = red * 0.3 + green * 0.59 + blue * 0.11; // получаем серый фон
        imageData.data[i] = grayscale;  // установка серого цвета
        imageData.data[i + 1] = grayscale;
        imageData.data[i + 2] = grayscale;
    }

    ctxOut.putImageData(imageData, 0, 0);

}

function simplification() {

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let newImageData = imageData;

    let redArr = [], greenArr = [], blueArr = [], alphaArr = [];
    let w = canvas.width, check = 0;

    let value = simpRange.value;

    if (value == 1) {
        ctxOut.putImageData(newImageData, 0, 0);
        return;
    }


    for (let i = 0, j = 0; i < imageData.data.length; i += 4, j++) {
        redArr[j] = imageData.data[i];
        greenArr[j] = imageData.data[i + 1];
        blueArr[j] = imageData.data[i + 2];
    }


    newImageData = imageData;

    let red = 0, blue = 0, green = 0, last = 0;

    let sq = value ** 2, secD = 0;
    let count = 0;

    for (let j = 0; j < redArr.length; j++) { // Перебираем кубики (i+1) x (i+1), а точнее столбцы

        if ((j - last == value || j % w == 0) && check) {

            let divider;

            if (j - last == value && secD == value) divider = sq, secD = value;
            else divider = (j - last) * secD;


            let finalRed = Math.round(red / divider);
            let finalGreen = Math.round(green / divider);
            let finalBlue = Math.round(blue / divider);

            for (let k = last; k < j; k++) {
                for (let n = 0; n < secD; n++) {

                    if (!newImageData.data[(k + w * n) * 4]) {
                        break;
                    }

                    newImageData.data[(k + w * n) * 4] = finalRed;
                    newImageData.data[(k + w * n) * 4 + 1] = finalGreen;
                    newImageData.data[(k + w * n) * 4 + 2] = finalBlue;
                    count++;
                }
            }

            last = j;

            red = blue = green = 0;
        }


        if (j % w == 0 && check) {
            j = last += (value - 1) * w;
        }

        check = 1;

        for (let n = 0; n < value; n++) {

            if (!redArr[j + n * w]) {
                break;
            }

            red += redArr[j + n * w];
            blue += blueArr[j + n * w];
            green += greenArr[j + n * w];

            secD = n + 1;

        }

    }

    console.log(count);
    console.log(redArr.length);

    ctxOut.putImageData(newImageData, 0, 0);
}

function negative() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log("check");

    let red, green, blue, difRed, difGreen, difBlue;

    for (let i = 0; i < imageData.data.length; i += 4) {
        red = imageData.data[i]; // получаем компоненту красного цвета
        green = imageData.data[i + 1];  // получаем компоненту зеленого цвета
        blue = imageData.data[i + 2];   // получаем компоненту синего цвета

        console.log(red);

        if (red == 0 && green == 0 && blue == 0) {
            difRed = red;
            difGreen = green;
            difBlue = blue;
        }
        else{
            difRed = 255 - red;
            difGreen = 255 - green;
            difBlue = 255 - blue; 
        }

        imageData.data[i] = difRed;
        imageData.data[i + 1] = difGreen;
        imageData.data[i + 2] = difBlue;
    }

    ctxOut.putImageData(imageData, 0, 0);


}
/* jshint esversion: 6*/

// var count = 0,
//     imgs = [];

// function loadImgs(imgList, cb) {
//     imgList.forEach((url, i) => {
//         imgs[i] = new Image();
//         imgs[i].onload = function() {
//             if (++count == imgList.length) {
//                 cb && cb();
//             }
//         };
//         imgs[i].src = url;
//     });
// }

// loadImgs(["nicegirl.jpeg", "nicegirl.jpeg"], function() {
//     console.log('bundle');
// });

async function loadImgs(imgList, cb) {

    console.log("start");
    for( var i =0; i<imgList.length; i++) {
        await imgLoader(imgList[i], i);
        console.log("finish"+i);
    }
    cb();
}

async function imgLoader(url, num){
    return new Promise((resolve, reject) => {
        console.log("request"+num);
        
        setTimeout(resolve, 1000);
        // let img = new Image();
        // img.onload = () => resolve(img);
        // img.onerror = reject;

        console.log("return"+num);
    })
}

loadImgs(["nicegirl.jpeg","nicegirl.jpeg"],function() {
	console.log("开始干活");
});
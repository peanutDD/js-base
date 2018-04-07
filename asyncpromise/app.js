/* jshint esversion: 6 */
async function main(){
    var urls = ['https://www.baidu.com/a.html','https://www.baidu.com/b.html','https://www.baidu.com/c.html'];
    var tasks = [];

    urls.forEach(url=>{
        tasks.push(fetch('https://www.baidu.com/s?wd=nba',{method:'POST'}));
    });

    var respArr = await Promise.all(tasks);
    var textArr = await Promise.all(respArr.map(resp=> resp.text()));

    textArr.forEach(text=> console.log(text));
}

main();
/* jshint esversion:6 */

//求和函数，得到的结果赋值到result
function sum(result,...values){
    //打印values看看是什么
    console.log(values);
    //结果：[1,2,3,4]

    //进行求和
    values.forEach(function (v,i) {
        //求和得到的结果存到result
        result += v;
    });
    //打印出求和的结果看看
    console.log(result);
    //结果：10
}

//存储求和结果的变量res
var res = 0;
//调用sum函数
sum(res,1,2,3,4);

// 表示法：...values（三个点+变量名）；其次，values是一个数组；我们要学会这两点即可。

// 注意: rest参数必须是函数的最后一个参数，后面不能再跟其他参数

//错误写法
function sum(result, ...values, mult){
    //rest参数...values后面还有一个参数mult
}
//正确的写法
function sum(result, mult, ...values){
    //rest参数...values放在最后
}
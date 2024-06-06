---
title: 如何在 JavaScript 中使用 Async Await  
date: 2018-05-06 09:00:00
categories : [技术]  
tags: [javascript]  
urlname: javascript-async-await  
url: http://www.caiyunlin.com/2018/05/javascript-async-await/
---

JavaScript 是一个同步的单线程执行的语言，这意味着，JS代码是从头到挨着顺序执行的，这肯定跟我们大多数多JS开发的人心里的想法不符，因为写JS需要很多异步操作，包括请求网络资源(Web)，本地文件资源(NodeJS)，甚至异步的逻辑写太多了，以至于出现回调地狱，而JS也提出了Promise, Async Await等方法来避免回调地狱。

![image](https://images.caiyunlin.com/20200327113611.png)

## 复习JavaScript的回调机制
做一个小实验，如果你的浏览器是Chrome内核的，可以直接按F12打开`开发者工具`，首先执行一下需要的辅助函数

```javascript
function write_log(str){
    var now = new Date();
    var log = now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+" "+str;
    console.log(log);
}
```

然后输入下面一段脚本执行

```javascript
write_log("hello")
setTimeout(function(){
    write_log("great")
},2000)
write_log("world");
```

我们会看到 系统顺序输出了 `hello`,`world` 并且在两秒后输出了 `great` ， 那既然是同步的为什么不是依次输出 `hello`, 然后隔两秒输出 `great` 最后再输出 `world` 呢？  

这里需要了解一下JS的执行机制，JS在顺序执行的时候，有一个主线程自顶而下依次执行，当它遇到耗时的异步操作，比如此处的setTimeout 或者其他ajax请求等，会给他分配一个编号，并且放到队列里面然后去执行(此处的执行可能是JS引擎分配的一个新线程去执行，和JS的主线程无关)，然后主线程在执行完当前所有代码之后，会去队列里面查看分配出去的任务有没有执行完毕，如果完成了，则调用其定义的回调代码，这样就完成了一个异步操作。

下图可以说明这个运行机制，至始自终只有一个主线程在不停的轮询

![image](https://images.caiyunlin.com/20200327122132.png)

我们再用一段代码来测试一下

```javascript
//强制sleep
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime){
            return;    
        }
    }
}

write_log("hello")
setTimeout(function(){
    write_log("great")
},2000)
write_log("world")
sleep(5000);
```

观察结果，我们发现`great`并不是在2秒之后输出的，而是在5秒之后，那是因为，主线程在sleep里面循环了5秒钟之后才有机会去检查回调队列里面的事件，才有机会执行 `write_log("great")` 这句脚本。

![image](https://images.caiyunlin.com/20200327032516.png)

## 回调地狱的由来

如果是在网页端写一些代码，异步的操作主要是访问后台service, 下面是一段封装的示例代码，call_svc是调用后台服务，传入 data 并且得到 result, 这里还没有做异常处理。
```javascript
    call_svc(serviceUrl, data, function(result){
        //do someing
    });
```



【全文完】
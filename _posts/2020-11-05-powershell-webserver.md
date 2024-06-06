---
title: 基于 PowerShell 的 Web Server 简单实现
date: 2020-11-05 09:00:00  
categories: [技术]  
tags: [sublime,markdeep]  
urlname: powershell-webserver  
url: https://www.caiyunlin.com/2020/11/powershell-webserver/
---

最近项目中有个需求，就是现有很多已经存在的PowerShell脚本，但是命令行的方式不是很方便使用，希望能集成到一个Web界面，简化用户操作难度。
经过简单调研，发现可以使用 HttpListener 创建一个对象在本地侦听在自对应端口，就可以实现一个简单的Web服务器，具体实现如下。

## 简单实现
先创建一个POC，代码如下，保存到 webserver.ps1
```powershell
$http = [System.Net.HttpListener]::new()
$http.Prefixes.Add("https://localhost:8080/")
$http.Start()

if ($http.IsListening) {
    write-host "HTTP Server Ready!  " -f 'black' -b 'gre'
    write-host "$($http.Prefixes)" -f 'y'
}

# INFINTE LOOP, Used to listen for requests
while ($http.IsListening) {
    $context = $http.GetContext()
    $body = "Hello World!"
    $buffer = [System.Text.Encoding]::UTF8.GetBytes($body)
    $context.Response.ContentLength64 = $buffer.Length
    $context.Response.OutputStream.Write($buffer, 0, $buffer.Length)
    $context.Response.Close()
}
```
打开管理员模式运行 PowerShell 窗口，执行 `.\webserver.ps1` , 注意如果遇到执行权限的问题，则先执行 `Set-ExecutionPolicy ByPass`
执行后，输入 https://localhost:8080，应该可以看到 Hello World! 页面

![image](https://images.caiyunlin.com/20210508061910.png)

![image](https://images.caiyunlin.com/20210508061955.png)


## 前端页面

上一步，我们实现了一个简单的POC，输入 https://localhost:8080 之后，就能看到 Hello World!。 此时无论输入任何的路径，都是只能返回同样的内容。
所以这一步我们需要做一个实现，即，用户输入 html 文件的 url 时候，读取 wwwroot 目录下该文件的内容，显示到浏览器。
我们先要获取到用户请求的URL,然后匹配到本地的文件路径，如果存在读取文件，不存在，则返回404
```powershell
# 在while循环里面 增加如下代码

$RequestUrl = $context.Request.Url.LocalPath

Write-Host "$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss')) : $($context.Request.Url)" -f 'mag'

# Get Request Url
if ($context.Request.HttpMethod -eq 'GET') {       
    # Redirect root to index.html
    if($RequestUrl -eq "/") {
      $RequestUrl = "/index.html"
    }
    if(Test-Path "$scriptPath\$webPath\$RequestUrl"){
        $ContentStream = [System.IO.File]::OpenRead( "$scriptPath\$webPath\$RequestUrl" );
        $ContentStream.CopyTo( $Context.Response.OutputStream );
    }
    else{
        Send-WebResponse $context "404 : Not found $RequestUrl"            
    }
    $context.Response.Close()
}

# 注意这里为404封装了一个函数 Send-WebResponse，这样可以统一返回文本消息
function Send-WebResponse($context, $content) {
    $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
    $context.Response.ContentLength64 = $buffer.Length
    $context.Response.OutputStream.Write($buffer, 0, $buffer.Length)
}

```

## 后端控制器

在上面一步，我们用 Get 可以获取到文件的内容，那么涉及到后台交互时，如何处理呢。  
我们可以假定，所有的 POST 请求，都是作为调用后端逻辑来处理的。 当前台 html 页面使用 ajax 提交 POST 请求时， 如 /dosomething， 则调用到 controller/dosomething.ps1。  
然后 controller/dosomething.ps1 处理具体的逻辑，在返回最终 json 到前台，完成一次前后台的交互。 简单实现如下
```powershell
if($context.Request.HttpMethod -eq "POST"){
    $controllerFile = "$scriptPath/$controllerPath/$RequestUrl.ps1"
    if(Test-Path $controllerFile){
        try{
            $postData = Get-PostData $context           
            . $controllerFile
        }
        catch{
            $jsonObj = @{
                'status' = 'error'
                'message' = $_.ToString()
            }
            $json =  ConvertTo-JSON $jsonObj
            Send-WebResponse $context $json
        }
    }
    else{
        Send-WebResponse $context "{`"status`":`"error`",`"message`":`"Unsupported API $RequestUrl`"}";
    }
    $context.Response.Close()
}
```

## 参数传递
前台直接提交数据到后台是，有时PowerShell不能处理特殊的控制字符，所以前台会将数据进行 URL ENCODE 和 BASE64 ENCODE，后台则统一拦截反向解码，再传入 controller 中，controller 中的代码直接使用 $postData.property 即可访问前台传递过来的数据，这样一个简单的MVC框架就搭建好了。
```javascript
// 前端
//get encoded data and post to powershell backend
function get_encoded_data(data){
    var jsonString = JSON.stringify(data);
    var urlEncodedData = encodeURIComponent(jsonString);
    // use base64 so powershell could parse
    var base64Data = btoa(urlEncodedData);
    // '=' has special meaning in querystring, like a=b, need replace them
    var resultData = base64Data.replace(/=/g,"%3D");
    return resultData
}
```

```powershell
# 后端
function Get-PostData{
    $reader = new-object System.IO.StreamReader($context.Request.InputStream)
    $text = $reader.ReadToEnd()
    $text = $text.Replace("%3D","=")
    $text = ConvertFrom-Base64 $text
    $text = [System.Web.HttpUtility]::UrlDecode($text)
    Write-Host "$text"
    return ConvertFrom-Json $text
}
```

## 中文编码
为了兼容中文处理，前端返回到后台的数据统一用UTF8格式，文件编码也统一为UTF8，html头部也需加上 &lt;meta charset="utf-8" /&gt; 否则会出现乱码

## 使用场景
除了文章最开始的提到的整合本地 PowerShell 脚本到web界面外，这个方案还适合发布最简单的 web 原型应用到用户本地，因为默认Windows机器都自带了 PowerShell，所以不需要安装任何其他东西，比较方便。

## 详细代码
本文的详细代码发布在 [https://github.com/cylin2000/powershell-webserver](https://github.com/cylin2000/powershell-webserver)

## 缺点
1. 目前此方案只支持单线程，即在Web端如果开启多个页面，当第一个页面请求没有完成的时候，第二个页面会是一直处于等待状态，直到第一个页面的代码处理结束。 
如果只是本地个人小规模应用，应该问题不大。
2. $httpListener 对象因为一直处于无限循环的侦听中，所以当启动起来后，普通的`Ctrl+C`不能终止程序的运行，必须关掉整个powershell的进程才行。

【全文完】
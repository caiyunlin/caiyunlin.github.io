---
title: PowerShell小说爬虫  
date: 2016-06-20 09:59:45  
categories : [技术]   
tags: [powershell]  
urlname: powershell-spider  
url: https://www.caiyunlin.com/2016/06/powershell-spider/  
---

老婆最近迷上了网络小说，在线一张一张网页看的十分的累，而且广告不停弹出，非常烦人。
我就赶紧发挥一把，写个简单的脚本把文件内容批量抓取下来，让她知道编程也是有点实际用处的。

虽然知道Python在爬虫方面是个强项，但是暂时不是很熟悉，就先用 PowerShell 勉强实现一下，直接上代码：

```powershell
$url = "https://m.d8qu.com/104/104936/12850949.html"
$out = "c:\novel.html"

$wc = New-Object System.Net.WebClient
#$index = $wc.DownloadString($url)
#$reg = [regex]'<a href="(/read/31485/.*?)".*?>(.*?)</a>'
#$mm = $reg.Matches($index)

$fullContent = ""

for($i = 1 ; $i -le 614; $i++)
{
    $chapterUrl = $url    
    $chapterContent = $wc.DownloadString($chapterUrl)

    $chapterReg = [regex]'(?s)<div id="nr1".*?>(.*?)</div>' #(?s)表示多行/跨行匹配
    $chapterMatch = $chapterReg.Matches($chapterContent)
    $chapterText = $chapterMatch.Groups[1].Value

    $titleReg = [regex]'(?s)<div.*?id="nr_title">(.*?)</div>'
    $titleMatch = $titleReg.Matches($chapterContent)
    $chapterTitle = $titleMatch.Groups[1].Value

    $nextReg = [regex]'<a id="pb_next" href="(.*?)">下一章</a>'
    $nextMatch = $nextReg.Matches($chapterContent)
    $nextUrl = $nextMatch.Groups[1].Value

    $title = $chapterTitle.Trim()
    Write-Host "处理 $url $title"

    #Add-Content $out "$chapterTitle <br/>"
    #Add-Content $out "$chapterText <br/><br/>"
    $fullContent = $fullContent+"$chapterTitle <br/>"
    $fullContent = $fullContent+"$chapterText <br/><br/>"

    $url = "https://m.d8qu.com$nextUrl"
}

Add-Content $out $fullContent #一起写入，防止不停Add-Content出现文件占用错误
```


【全文完】


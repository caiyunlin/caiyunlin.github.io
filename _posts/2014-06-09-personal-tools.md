---
title: 分享几个.NET写的小工具  
date: 2014-06-09 11:06:45  
categories : [技术]  
tags: [xslt,regex]  
urlname: personal-tools  
url: http://www.caiyunlin.com/2014/06/personal-tools/
---

整理下之前写的几个小工具

- ForceXslt XSLT 测试工具
- ForceRegex 正则表达式测试工具
- ForceEmail 邮件发送模板工具

## ForceXslt
ForceXslt是我是用C#编写的Xslt测试工具，它可以让你专注于测试某段Xpath或者XSLT的template是否有效，而不需要一遍一遍的运行整个程序去检查某段xslt是否正确。
工具提供了常用的模板，你可以选择模板，改模板达内容到测试XSLT代码的效果。

![image](http://www.caiyunlin.com/dev/ForceXslt/ForceXslt.jpg)

下载地址：[http://www.caiyunlin.com/dev/ForceXslt/ForceXslt.exe](http://www.caiyunlin.com/dev/ForceXslt/ForceXslt.exe)

## ForceRegex
ForceRegex是我使用C#编写的正则表达式测试工具，可以让你专注于测试某段正则表达式是否有效，而不用在VS的调试器里面单步调试去测试正则表达式。  
当初写这个工具是给自己练练手，另外自己的用着顺手，一旦有啥问题还可以改改。  
网上类似的工具很多，可以参考 https://regex101.com/

![image](http://www.caiyunlin.com/dev/ForceRegex/ForceRegex.jpg)

下载地址：[http://www.caiyunlin.com/dev/ForceRegex/ForceRegex.exe](http://www.caiyunlin.com/dev/ForceRegex/ForceRegex.exe)

## ForceEmail

ForceEmail是我使用C#编写的邮件模板测试工具，这个小程序可以让你预先定义好邮件模板和替换符号
这样在你再次发送类似邮件的时候，只需要编写占位符的地方，然后点击发送即可调出邮件发送程序。
模板内容可以自己定义，具体的参数会自动生成到界面上去。

![image](http://www.caiyunlin.com/dev/ForceEmail/ForceEmail.jpg)

下载地址：[http://www.caiyunlin.com/dev/ForceEmail/ForceEmail.exe](http://www.caiyunlin.com/dev/ForceEmail/ForceEmail.exe)

## 后记

工具使用 `Force` 作为前缀，一是源于星球大战 `May the Force be with you`, 而是我参加工作参与的第一个内部项目名称叫 `Force`，特此纪念。



【全文完】
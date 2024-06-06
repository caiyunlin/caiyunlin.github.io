---
title: 常用前端类库整理  
categories : [技术]  
tags: [javascript]
date: 2017-06-05 15:44:00  
urlname: useful-frontend-library  
url: http://www.caiyunlin.com/2017/06/useful-frontend-library/  
---

做前端开发免不了要使用一些静态公共库，如果代码部署在互联网上面，我们可以使用CDN，如：
* 新浪的CDN http://lib.sinaapp.com/  
* 百度的CDN http://cdn.code.baidu.com/   

但是如果我们需要部署在内网，或者需要使用一些不太常见的类库，那么这个时候公共CDN也就不好办了  

这里提供一个思路，我们可以创建一个自己的静态公共库方便重复使用


## 约定

1. 以下假设文件部署到 http://www.caiyunlin.com/public 路径下

1. 所有文件存放在public文件夹之下，这样在本地的话，类库的根路径就是 http://www.caiyunlin.com/public, 开发代码中对类库有引用则从路径 /public 开始引用即可

1. 和公共CDN命名方式一样，类库以名称和版本分级目录存在，如：jQuery类库3.2.1版本使用下面链接, http://www.caiyunlin.com/public/jquery/3.2.1/jquery.min.js, 这样有多个版本时不会冲突

1. 引用类库中可以包含相关的demo文件，这样可以方便参考和查错，如： http://www.caiyunlin.com/public/fullcalendar/3.2.0/demos/agenda-views.html

1. 类库文件只会按规则增加，不会删除和修改，这样方便旧版正在运行的项目

## 几个优点

1. 方便重用，同一个网站部署，只需要部署一次public文件夹，部署方式也仅仅是复制一下，各个子应用就可以直接使用，且子应用的文件夹只包含自己的内容
1. 移植方便，当需要部署到不同的服务器，或者线上环境，只需要拷贝public文件夹，不需要的内容直接从public中删除即可
1. 临时性的项目可以直接引用在线路径，不用部署public代码

【全文完】
---
title: Angular项目结构思考  
date: 2016-05-16 11:34:45   
categories : [技术]   
tags: [angular,javascript]   
urlname: angular-refact  
urlpath: http://www.caiyunlin.com/2014/06/angular-refactor/  
---

最近在重构项目组的两个前端项目，都是基于AngularJS(1.0版本)的，重构的过程中有些思考，在此记录下来备忘以及参考

## 重构目的

1. 创建公共的web前端项目，在启动其他类似项目的时候，可以最小修改的去使用
1. 规范前端js代码，去除不必要的全局变量，统一命名风格
1. 异常处理、日志记录、诊断、安全性和本地数据储藏等模块，许多地方都可以用，可以抽取到同一个地方

# 约定

## 命名

* js/css/html 文件，如果有多个单词，用连字符-，如 jquery datagrid，则写作 jquery-datagird

## 目录结构 

* 按功能模块划分 按照它们代表的功能来给创建的文件夹命名，当文件夹包含的文件超过7个,就考虑新建文件夹

为什么？
* 开发者可以快速定位代码，快速识别文件代表的意思，结构尽可能扁平
* 路由和controll对应关系可以很容易找到
* 如果按照类型划分功能，如当controller里文件很多时，在到对应view里找相应的文件，就会变得比较麻烦
* 路由和controller/view的对应关系，可以很容易找到

一般目录网站目录结构

```
web/
    css/              #所有自定义样式，包括字体
        reset.css     #重置浏览器样式
        app.css       #应用程序自定义样式
    img/              #所有自定义图片文件
    js/               #所有自定义js脚本
        app.js        #应用程序引导脚本
    lib/              #所有第三方文件，每个目录表示一个第三方文件
        angularjs     #引入angularjs类库
        jquery        #引入jquery类库
        bootstrap     #引入bootstrap
```

AngularJs网页目录结构，按模块划分

```
app/
    css/
    img/
    js/
        controllers/    #angular controller 定义，一般和view匹配
        directives/     #angular directive定义
        services/       #angular service定义
        app.js          #app定义，定义这个app使用了多少其他模块
        config.js       #app配置，定义路由信息
    lib/                #第三方类库，同上
    views/              #所有视图文件，独立出来是方便可以使用其他视图
    
```
为什么?
* 将views单独出来，可以较为容易的替换皮肤，因为js的逻辑可以不变
* 单独定义directive和service，因为这两块内容可以直接迁移到其他项目，如果做得很稳定，可以放到lib中
* app.js/config.js 定义使用到的模块和路由信息，可以提供基础模块，使用到新项目是再自由添加和修改
* controllers 一般新项目都会单独重写

【全文完】
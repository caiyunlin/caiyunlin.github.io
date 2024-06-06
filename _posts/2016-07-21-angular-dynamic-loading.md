---
title: AngularJS 动态加载的思考  
date: 2016-07-21 11:37:45  
categories : [技术]  
tags: [angular,javascript]  
urlname: angular-dynamic-loading  
url: http://www.caiyunlin.com/2016/07/angular-dynamic-loading/  
---

本文使用的AngularJS是基于1.x版本的。

使用AngularJS做前端，路由都是静态配置的，久而久之发现每次新增加一个模块都要配置一下路由，实在有些麻烦，遂研究了一下能否动态配置路由信息

## 现状

项目中使用的是ui-router，因为要支持多级路由，所以没有使用默认的路由，代码如下



```javascript
angular.module('app')
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");
    $stateProvider
        .state('home', {
            url: '/home',
            controller: 'homeController',
            templateUrl: 'views/home.html'
        })
        .state('feature1', {
            url: '/feature1',
            controller: 'feature1Controller',
            templateUrl: 'views/feature1.html'
        })
        .state('feature2', {
            url: '/feature2',
            controller: 'feature2Controller',
            templateUrl: 'views/feature2.html'
        })
    });
```
如此对 /home, /feature1, /feature2 这样的模块，每次增加一个就要做如下动作
1. 添加state记录
2. state,url,controller,templateurl都按照约定写好，否则不容易直接找到
3. index.html 页面里要添加controller的js文件
这样下来，当模块达到十几或几十个的时候，首页就是一串JS的文件引入，config里面state也是很多定义，关键是，任何一个地方写错一个字母，功能就直接没用了。

## 解决
开始尝试像后台MVC一样，比如#/home, 就动态载入 views/home.html 配合 controllers/home.js，后来发现state不配置还是很难的。

退而求其次。

预定义一个数组，然后按自定义规则加载
```javascript
var states = ["home","about","about.company","contact"];
```
然后根据名称，自动约定加载controller和view信息，关于controller的自动加载，使用了ocLazyLoad模块

核心代码如下

```javascript
angular.module('app')
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    var states = ["home","about","about.company","contact"];

    angular.forEach(states, function(state) {

        var controllerName = state.replace(/\../g,function(m){
            return m.replace(".","").toUpperCase()}
        );
        var state_parts = state.split(".");
        var controllerFile = state_parts[0];
        var url = "/"+state_parts[state_parts.length - 1];
        $stateProvider.state(state, {
            url: url, 
            templateUrl: 'views/' + state + '.html',
            controller: controllerName + 'Controller',
            resolve: {
                deps:['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load ([
                        {
                            name: 'controllers',
                            files: [
                                'js/controllers/'+controllerFile+'.js'
                            ]
                        }
                    ])
                }]
            }
        }) ;
    })
});
```

使用此方法，还是不能像后端MVC那样自动解析，但是已经可以少些很多重复代码了。

【全文完】
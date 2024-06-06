---
title: 基于REST的接口定义思考  
date: 2016-08-08 09:01:10  
categories : [技术]  
tags: [angular,rest]  
urlname: rest-study  
url: http://www.caiyunlin.com/2016/08/rest-study/  
---
因前后台分离，使用AngularJS作为纯前端，需要设计一组基于JSON的API，统一前后台的接口规范。

该组API需要有如下特性:

* 统一接口调用风格
* 统一接口返回码
* 以尽可能简单的方式提供调用说明
* 接口支持增删改查等基本功能，也有其他自定义功能，如 软删除(IsDeleted = 1)


## 调查
首先想到的是REST，设计一套RESTful的方案，如 http://www.dummy.com/api/menu 提供最MENU的管理
使用HTTP动词作为操作管理

GET : 获取菜单
POST : 创建菜单
PUT : 创建或更新菜单
DELETE : 删除菜单

现实使用的时候发现如下问题：

* GET 接口可以返回一个数据{menu} 或者一组数据[{menu},{menu},{menu}], 后台要单独处理
```
    如 GET /menu 返回 一组[{menu},{menu},{menu}]
    GET /menu/1 通过路由映射到后台 Menu(int id) 方法，返回一个menu
    但是 如果我的查询条件中就有包含 {id:1} 这样的条件，那么会出现
    GET /menu , post data {id:1}, 这样会自动路由到 Menu(int id) 方法，期望的是返回menu数组，其中包含一个menu [{menu}]，后台只返回了一个{menu}
```
  按照wikipedia的举例，menu和menus是分开的

```
GET http://www.store.com/products
GET http://www.store.com/product/12345
```
* REST推荐通过状态码返回出错信息

  对于HTTP的状态吗，常规的我只记得
  - 200 返回正常
  - 401 认证错误
  - 404 找不到页面
  - 500 服务器错误

其他的只能现用现查，这样当后台返回409，我查完得知表示资源冲突，但是具体冲突是因为什么，还是需要和后台沟通好。

另一个问题是，直观的感觉，返回200就代表正常，如果4xx，5xx就感觉是服务器错误，和我的应用程序无关才是，3xx基本没碰到过。

但是这里409是我们自己后台抛出的，和服务器无关。我不希望将系统错误，传输错误和应用程序错误混为一谈。

* 只有四个动词，不够描述后台所有的操作，按照REST的推荐，应该都封装到PUT里

而微信公众号的接口设计却没有完全使用这种方式
```
https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN
https://api.weixin.qq.com/cgi-bin/menu/get?access_token=ACCESS_TOKEN
https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=ACCESS_TOKEN
```
百度地图的API也是
```
http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-placeapi
```

* 虽然HTTP的动作只有4个，但是后台为了操作明了，同样还是需要创建多个function来表示不同的操作内容，前台AngularJS同样需要创建多个function来表示动作
* 某些浏览器不支持PUT,DELETE等从此（这个问题现在好像不成问题了）


## 安全
按照微信API的方式，统一使用access_token，就是说每次请求都需要带入access_token，防止跨站攻击

## 思考
我一直想强行用REST的方法整理接口，因为这个标准存在了，与别人沟通的时候，公认约定总归好于个人约定

但是使用过程中诸多不顺，因此查找文章以及知名开放API的提供者，比如微信公众号API

终于找到了支撑自己的几个理由：
1. REST是设计风格而不是标准，这也是很多地方说RESTful的原因，既然是风格那也就是可以有选择的使用
2. 微信的API设计，并不是完全的REST，他的动词都是放在资源的后面，这点结合后台api的function非常方便，微信API的使用频率和使用量应该可以打消我们其他的顾虑，比如效率，安全
3. SOAP也是一种WEB访问协议，他封装了操作，用XMLSpy访问SOAP的wsdl，可以得到可以操作的方法，只是使用方法复杂，我们为何不可把操作结合到REST风格的url里，这样既可知道调用方法，又不需通过复杂的方式取得


## 结论
找到了理由，自然要设计适合自己的API，而不是用REST就全部REST

结论很简单，即使用REST那样清晰明了的URL风格，结合SOAP的动作的描述方式，对动作在URL进行描述。
所有的返回都是200，应用程序错误用errcode表示

接口只使用GET 和POST 两种动词 , 这样不存在浏览器兼容问题
``` javascript
http://www.dummy.com/api/menu/get    表示获取菜单(单个记录)
http://www.dummy.com/api/menu/query  表示查询菜单(多条记录)，post数据中加入查询条件
http://www.dummy.com/api/menu/create 表示创建菜单
http://www.dummy.com/api/menu/update 表示更新菜单
http://www.dummy.com/api/menu/delete 表示删除菜单

结合 AngularJS的 Resource

app.controller('TableCtrl',function($scope, $routeParams, $resource) {
    var User = $resource('/api/user/:_action',
      {id:"@id"}, 
      {
        get:   {method:"GET",  params:{_action:"get"}},
        query: {method:"POST", params:{_action:"query"}, isArray:true},
        create:{method:"POST", params:{_action:"create"}},
        update:{method:"POST", params:{_action:"update"}},
        delete:{method:"GET",  params:{_action:"delete"}},
      });

    $scope.users = User.query({ticket:"1155"});
    $scope.id = $routeParams.id;
    if($scope.id){
      $scope.user = User.get({id:$scope.id})
    }
});

```
* 不需要参数的，或者参数在URL中提供的使用GET方法
```
http://www.dummy.com/api/menu/get 
http://www.dummy.com/api/menu/get?id=5
http://www.dummy.com/api/menu/delete?id=6
```
* 需要提交数据的使用POST方法

``` javascript
http://www.dummy.com/api/menu/create
POST数据如下
{
    name:"测试菜单"
}
http://www.dummy.com/api/menu/update
{
    id:"5",
    name:"新菜单"
}
```
* 返回格式

``` javascript
操作正确
{
    "errcode":0,
    "errmsg":"ok"
}
操作错误
{
    "errcode": 401,
    "errmsg":"No Access"
}
操作正确有数据
{
    "errcode":0,
    "errmsg":"ok",
    "menu":{
        "name":"测试菜单"
    }
}
```

http://www.dummy.com/api/menu/help 获取menu下的接口说明文档，以json返回，这样接口就可以像SOAP那样，自说明
这个只是一个设想，需完善

``` javascript
{
    "get":{
        "http":"get",
        "request":{},
        "response":{
            "errcode":0,
            "errmsg":"ok"
        }
    },
    "create":{
        "request":{
        },
        "response":{
        }
    }
}
```

## 参考文章

https://zh.wikipedia.org/zh-cn/REST
https://zh.wikipedia.org/zh-cn/SOAP 
http://www.infoq.com/cn/articles/rest-introduction
http://mp.weixin.qq.com/wiki/10/0234e39a2025342c17a7d23595c6b40a.html
http://mindhacks.cn/2009/01/16/hammers-and-nails/
http://blog.csdn.net/pongba/article/details/3796771

## 多年以后的后记

后来又了解了很多这方面的内容，才知道了 Restful 和 Json RPC 之争，我上述的设计方法就试属于 Json RPC, 但是也是有缺点的，比如动词设置不规范，不遵守HTTP原生规则，导致调用方多出很多沟通成本，微信公众号的API也是被吐槽已久。

关于设计 Restful 的API也是可以的，只是需要花更多的时间理清实体，比如 github 的 api, 其中做 migration https://docs.github.com/en/rest/reference/migrations  就是如下风格

```bash
POST /orgs/{org}/migrations
```

下载一个 mrgration 

```
GET /orgs/{org}/migrations/{migration_id}/archive
```

解锁一个 migration 的 repo

```
DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock
```

并没有用到 migrate, lock 等动词

关于优秀的API设计，可以参考如下 微软 和 Paypal 的 API Guideline

https://github.com/microsoft/api-guidelines

https://github.com/paypal/api-standards/blob/master/api-style-guide.md



【全文完】
---
title: 微信小程序TLS大于等于1.2版本的问题解决
categories : [技术]  
date: 2017-07-02 07:00:00  
urlname: wechat-tls  
url: http://www.caiyunlin.com/2017/07/wechat-tls/
---

## 问题描述
使用Windows官网提供的开发端载入Windows小程序，设置了自己架设的php后台服务器程序，显示如下错误  
![image](https://images.caiyunlin.com/20200326064338.png)

## 解决方法

关于TLS的支持，先去微软官网查询一下，Windows对2008R2以下的版本是不支持TLS1.2的，所以xp 2003的系统就不用折腾了。
![image](https://images.caiyunlin.com/20200326064411.png)

如果你的系统是Windows 2008 R2 或以上的，可以使用以下网址测试一下你搭好的服务器（需要几分钟时间）  
https://www.ssllabs.com/ssltest/index.html   
查询后大家可以在下面看到自己服务器支持的TLS版本，大部分都是只支持1.0  

当大家查询到自己服务器不支持1.1、1.2后，可以下载下面网址的软件 `IISCrypto.exe` ，进行配置   
https://www.pianyissl.com/support/page/60  
选择 `Best Practice` ，再点击 `Apply`， 搞定。  
![image](https://images.caiyunlin.com/20200326064440.png)


【全文完】
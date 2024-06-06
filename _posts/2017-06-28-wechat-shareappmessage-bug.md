---
title: 微信使用 JSSDK 分享 OAuth 链接的问题  
categories : [技术]  
date: 2017-06-28 07:33:00  
urlname: wechat-shareappmessage-bug  
url: https://www.caiyunlin.com/2017/06/wechat-shareappmessage-bug/
---

使用微信的JSSDK，可以在转发图文给朋友或者转发到朋友圈的时候，对转发的标题，描述以及图片进行自定义，这是个很好的功能，然而最近测试的时候发现一个Bug，当转发的链接是OAuth链接的时候，这段定义就失效了。

## 问题描述
先简单说一下什么是OAuth链接，参考微信的说明文档 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842

微信OAuth的链接格式是这样的 https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect 其中的 REDIRECT_URI 就是我们自己的网页链接，这段链接只能在微信里面访问，微信会得到通过用户授权得到用户的信息，然后跳转到 REDIRECT_URL 将用户信息传过来


关于JSSDK的分享自定义，微信的说明文档在此处 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115

``` javascript
获取“分享给朋友”按钮点击状态及自定义分享内容接口
wx.onMenuShareAppMessage({
    title: '', // 分享标题
    desc: '', // 分享描述
    link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: '', // 分享图标
    type: '', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () { 
        // 用户确认分享后执行的回调函数
    },
    cancel: function () { 
        // 用户取消分享后执行的回调函数
    }
});
```

上面的代码中，注意link的描述，"该链接域名或路径必须与当前页面对应的公众号JS安全域名一致"，就是说你转发的链接必须与你公众号的JS安全域名一致，因为安全问题，这个设置无可厚非。 你不能自己的图文在 https://www.mydomain.com 而分享其他链接如 https://www.baidu.com， 当你这么设置的时候，这段分享自定义的脚本就全部失效。

现在问题来了，如果我想使用微信自己的OAuth链接进行分享的话，也会失效，虽然是他自家的域名，微信同样认为这个链接和JS安全域名不一致，而如果直接分享 https://www.mydomain.com/xxx 的链接时，是无法从微信里得知用户信息的。

JS安全域名是可以在公众号管理后台设置的，但是无法把open.weixin.qq.com或者qq.com设置为JS安全域名的。

<img src="https://www.caiyunlin.com/img/wechat-js-domain.png" />

看起来似乎是无解了

## 解决方法

经过思考，归纳一下问题就是在于两点
1. JSSDK只能转发同域名下的链接 https://www.mydomain.com
2. 必须使用 https://open.weixin.qq.com 开头的OAuth链接才能识别微信用户的身份

解决方法其实很简单，把OAuth的链接编码，并且传给自己的代码，使用后台跳转如
```
$oauth_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";
$encoded_url = base64_encode($oauth_url);
$new_url = "https://www.mydomain.com/jump?url="+encoded_url;
此处 $new_url 代替之前的转发url，他的域名是符合JSSDK安全域名定义的
```
Jump里的处理规则就是解码以及后台跳转，伪代码如下
```
$encoded_url = request['url'];
$url = base64_decode($encoded_url);
header("location: ".$url);
```

这个问题困扰了我好久，还好终于解决了

## 2019-02-27 补充

这个问题不是微信的bug，其实转发的时候可以直接转发自己域名下的地址，比如 https://www.mydomain.com/share/news/123 然后，在这个具体的页面里面，如果需要OAuth，进行二次跳转，而不是必须一开始就拼接OAuth的地址，这个问题是开始钻了牛角尖了。。。

【全文完】
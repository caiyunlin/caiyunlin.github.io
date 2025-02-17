import{_ as e,c as a,o as s,ai as r}from"./chunks/framework.CtWg-Y9G.js";const d=JSON.parse('{"title":"微信小程序TLS大于等于1.2版本的问题解决","description":"","frontmatter":{"title":"微信小程序TLS大于等于1.2版本的问题解决","categories":["技术"],"date":"2017-07-02T07:00:00.000Z","urlname":"wechat-tls","url":"https://www.caiyunlin.com/posts/wechat-tls/"},"headers":[],"relativePath":"posts/2017-07-02-wechat-tls.md","filePath":"posts/2017-07-02-wechat-tls.md"}'),o={name:"posts/2017-07-02-wechat-tls.md"};function i(p,t,l,c,n,h){return s(),a("div",null,t[0]||(t[0]=[r('<h2 id="问题描述" tabindex="-1">问题描述 <a class="header-anchor" href="#问题描述" aria-label="Permalink to &quot;问题描述&quot;">​</a></h2><p>使用Windows官网提供的开发端载入Windows小程序，设置了自己架设的php后台服务器程序，显示如下错误<br><img src="https://images.caiyunlin.com/20200326064338.png" alt="image"></p><h2 id="解决方法" tabindex="-1">解决方法 <a class="header-anchor" href="#解决方法" aria-label="Permalink to &quot;解决方法&quot;">​</a></h2><p>关于TLS的支持，先去微软官网查询一下，Windows对2008R2以下的版本是不支持TLS1.2的，所以xp 2003的系统就不用折腾了。 <img src="https://images.caiyunlin.com/20200326064411.png" alt="image"></p><p>如果你的系统是Windows 2008 R2 或以上的，可以使用以下网址测试一下你搭好的服务器（需要几分钟时间）<br><a href="https://www.ssllabs.com/ssltest/index.html" target="_blank" rel="noreferrer">https://www.ssllabs.com/ssltest/index.html</a><br> 查询后大家可以在下面看到自己服务器支持的TLS版本，大部分都是只支持1.0</p><p>当大家查询到自己服务器不支持1.1、1.2后，可以下载下面网址的软件 <code>IISCrypto.exe</code> ，进行配置<br><a href="https://www.pianyissl.com/support/page/60" target="_blank" rel="noreferrer">https://www.pianyissl.com/support/page/60</a><br> 选择 <code>Best Practice</code> ，再点击 <code>Apply</code>， 搞定。<br><img src="https://images.caiyunlin.com/20200326064440.png" alt="image"></p><p>【全文完】</p>',7)]))}const w=e(o,[["render",i]]);export{d as __pageData,w as default};

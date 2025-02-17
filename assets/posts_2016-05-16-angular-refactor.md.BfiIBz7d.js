import{_ as s,c as n,o as l,ai as p}from"./chunks/framework.CtWg-Y9G.js";const h=JSON.parse('{"title":"Angular项目结构思考","description":"","frontmatter":{"title":"Angular项目结构思考","date":"2016-05-16T11:34:45.000Z","categories":["技术"],"tags":["angular","javascript"],"urlname":"angular-refact","urlpath":"https://www.caiyunlin.com/posts/angular-refactor/"},"headers":[],"relativePath":"posts/2016-05-16-angular-refactor.md","filePath":"posts/2016-05-16-angular-refactor.md"}'),e={name:"posts/2016-05-16-angular-refactor.md"};function i(t,a,r,c,o,u){return l(),n("div",null,a[0]||(a[0]=[p(`<p>最近在重构项目组的两个前端项目，都是基于AngularJS(1.0版本)的，重构的过程中有些思考，在此记录下来备忘以及参考</p><h2 id="重构目的" tabindex="-1">重构目的 <a class="header-anchor" href="#重构目的" aria-label="Permalink to &quot;重构目的&quot;">​</a></h2><ol><li>创建公共的web前端项目，在启动其他类似项目的时候，可以最小修改的去使用</li><li>规范前端js代码，去除不必要的全局变量，统一命名风格</li><li>异常处理、日志记录、诊断、安全性和本地数据储藏等模块，许多地方都可以用，可以抽取到同一个地方</li></ol><h1 id="约定" tabindex="-1">约定 <a class="header-anchor" href="#约定" aria-label="Permalink to &quot;约定&quot;">​</a></h1><h2 id="命名" tabindex="-1">命名 <a class="header-anchor" href="#命名" aria-label="Permalink to &quot;命名&quot;">​</a></h2><ul><li>js/css/html 文件，如果有多个单词，用连字符-，如 jquery datagrid，则写作 jquery-datagird</li></ul><h2 id="目录结构" tabindex="-1">目录结构 <a class="header-anchor" href="#目录结构" aria-label="Permalink to &quot;目录结构&quot;">​</a></h2><ul><li>按功能模块划分 按照它们代表的功能来给创建的文件夹命名，当文件夹包含的文件超过7个,就考虑新建文件夹</li></ul><p>为什么？</p><ul><li>开发者可以快速定位代码，快速识别文件代表的意思，结构尽可能扁平</li><li>路由和controll对应关系可以很容易找到</li><li>如果按照类型划分功能，如当controller里文件很多时，在到对应view里找相应的文件，就会变得比较麻烦</li><li>路由和controller/view的对应关系，可以很容易找到</li></ul><p>一般目录网站目录结构</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>web/</span></span>
<span class="line"><span>    css/              #所有自定义样式，包括字体</span></span>
<span class="line"><span>        reset.css     #重置浏览器样式</span></span>
<span class="line"><span>        app.css       #应用程序自定义样式</span></span>
<span class="line"><span>    img/              #所有自定义图片文件</span></span>
<span class="line"><span>    js/               #所有自定义js脚本</span></span>
<span class="line"><span>        app.js        #应用程序引导脚本</span></span>
<span class="line"><span>    lib/              #所有第三方文件，每个目录表示一个第三方文件</span></span>
<span class="line"><span>        angularjs     #引入angularjs类库</span></span>
<span class="line"><span>        jquery        #引入jquery类库</span></span>
<span class="line"><span>        bootstrap     #引入bootstrap</span></span></code></pre></div><p>AngularJs网页目录结构，按模块划分</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>app/</span></span>
<span class="line"><span>    css/</span></span>
<span class="line"><span>    img/</span></span>
<span class="line"><span>    js/</span></span>
<span class="line"><span>        controllers/    #angular controller 定义，一般和view匹配</span></span>
<span class="line"><span>        directives/     #angular directive定义</span></span>
<span class="line"><span>        services/       #angular service定义</span></span>
<span class="line"><span>        app.js          #app定义，定义这个app使用了多少其他模块</span></span>
<span class="line"><span>        config.js       #app配置，定义路由信息</span></span>
<span class="line"><span>    lib/                #第三方类库，同上</span></span>
<span class="line"><span>    views/              #所有视图文件，独立出来是方便可以使用其他视图</span></span></code></pre></div><p>为什么?</p><ul><li>将views单独出来，可以较为容易的替换皮肤，因为js的逻辑可以不变</li><li>单独定义directive和service，因为这两块内容可以直接迁移到其他项目，如果做得很稳定，可以放到lib中</li><li>app.js/config.js 定义使用到的模块和路由信息，可以提供基础模块，使用到新项目是再自由添加和修改</li><li>controllers 一般新项目都会单独重写</li></ul><p>【全文完】</p>`,17)]))}const g=s(e,[["render",i]]);export{h as __pageData,g as default};

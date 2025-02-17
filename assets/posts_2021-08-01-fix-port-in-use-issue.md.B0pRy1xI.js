import{_ as i,c as a,o as e,ai as t}from"./chunks/framework.CtWg-Y9G.js";const r=JSON.parse('{"title":"解决端口占用问题","description":"","frontmatter":{"title":"解决端口占用问题","date":"2021-08-01 17:15:00 +0800","categories":["技术"],"tags":["windows","linux"],"urlname":"fix-port-in-use-issue","url":"https://www.caiyunlin.com/posts/fix-port-in-use-issue/"},"headers":[],"relativePath":"posts/2021-08-01-fix-port-in-use-issue.md","filePath":"posts/2021-08-01-fix-port-in-use-issue.md"}'),n={name:"posts/2021-08-01-fix-port-in-use-issue.md"};function p(l,s,d,h,o,c){return e(),a("div",null,s[0]||(s[0]=[t(`<p>端口被占用是指当你的可执行程序运行时需要在某个端口侦听时，发现该端口被其他程序给占用了，导致该应用程序无法执行。</p><p>如: jekyll 默认需要在端口 4000 侦听，当被占用的时候，会显示错误 Permission denied - bind for 127.0.0.1:4000</p><p>本地的 <code>4000</code> 端口被占用。</p><h2 id="解决方法" tabindex="-1">解决方法 <a class="header-anchor" href="#解决方法" aria-label="Permalink to &quot;解决方法&quot;">​</a></h2><ol><li><p>查看端口的占用情况</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 查看端口占用情况</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">netstat</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -ano</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 也可以使用 find 过滤</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">netstat</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -ano</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> |</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> find</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">4000</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span></span></code></pre></div><p>参数：</p><ul><li><code>-a</code>：显示所有链接和侦听端口</li><li><code>-n</code>：以数字形式显示地址和端口号</li><li><code>-o</code>：显示拥有的与每个连接关联的进程 ID 即 <code>PID</code></li></ul></li><li><p>查看当前占用端口服务</p><div class="language-cmd vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">tasklist</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> /</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">svc</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> /</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">FI</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">PID eq 1172</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span></span></code></pre></div><p>显示如下，我们知道 端口被 FoxitProtect.exe 福昕阅读器占用了</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>映像名称                       PID 服务</span></span>
<span class="line"><span>========================= ======== ============================================</span></span>
<span class="line"><span>FoxitProtect.exe              1172 FxService</span></span></code></pre></div><p>参数：</p><ul><li><code>/svc</code>：如果这个进程是一个 <code>Windows</code> 服务的话同时显示这个服务的名称</li><li><code>/FI</code>：使用筛选器对结果进行筛选</li></ul></li><li><p>对目标服务进行关闭</p><div class="language-cmd vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cmd</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"># 停止 FxService 服务程序， 或者使用 services.msc 打开服务管理器,停止或禁用该服务</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">net stop FxService</span></span></code></pre></div></li></ol><h2 id="linux-下的解决办法" tabindex="-1">Linux 下的解决办法 <a class="header-anchor" href="#linux-下的解决办法" aria-label="Permalink to &quot;Linux 下的解决办法&quot;">​</a></h2><p>在 Linux 下也可以使用同样方式查询和关闭服务，命令参数有少许区别</p><ol><li>根据端口号，查询进程名称和进程ID</li></ol><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">netstat</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -tunlp</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> |</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> grep</span><span style="--shiki-light:#2F798A;--shiki-dark:#4C9A91;"> 8080</span></span></code></pre></div><p>输出如下：如果最后一个 PID/Program name 只显示了 - ，没有显示具体的进程，则在 <code>netstat</code> 前面加上 <code>sudo</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span>calvin@yic:~$ sudo netstat -tunlp | grep 8080</span></span>
<span class="line"><span>tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN      9299/nginx: master</span></span>
<span class="line"><span>tcp6       0      0 :::8080                 :::*                    LISTEN      9299/nginx: master</span></span></code></pre></div><p>参数说明：</p><ul><li><p>-t: 显示 TCP 连接</p></li><li><p>-u: 显示 UDP 连接</p></li><li><p>-n: 显示数字地址</p></li><li><p>-l: 列出状态是 LISTEN 的统计信息</p></li><li><p>-p: 显示程序的PID和名称</p></li></ul><ol start="2"><li><p>停止相关服务</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> systemctl</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> stop</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> nginx</span></span></code></pre></div></li></ol><p>【全文完】</p>`,15)]))}const g=i(n,[["render",p]]);export{r as __pageData,g as default};

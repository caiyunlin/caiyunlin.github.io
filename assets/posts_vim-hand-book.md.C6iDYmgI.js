import{_ as a,c as n,o as p,ah as e}from"./chunks/framework.ytAaTfF9.js";const k=JSON.parse('{"title":"VIM 快速上手指南","description":"VIM 编辑器快速入门指南，以实际使用场景为导向，整理常用的模式切换、编辑操作、搜索替换等实用快捷键和命令","frontmatter":{"title":"VIM 快速上手指南","date":"2014-07-02T00:00:00.000Z","category":"技术","tags":["vim","editor"],"urlname":"vim-hand-book","url":"https://www.caiyunlin.com/posts/vim-hand-book/","description":"VIM 编辑器快速入门指南，以实际使用场景为导向，整理常用的模式切换、编辑操作、搜索替换等实用快捷键和命令"},"headers":[],"relativePath":"posts/vim-hand-book.md","filePath":"posts/vim-hand-book.md"}'),i={name:"posts/vim-hand-book.md"};function l(t,s,c,o,d,h){return p(),n("div",null,[...s[0]||(s[0]=[e(`<blockquote><p>VIM 是linux下一款优秀的编辑器，但是上手难度略大，网络上可以找到的教程很多，快捷键也非常多，一时很难记住。</p></blockquote><p>本文换一种思路，就是根据平时自己的常用需要，去反查VIM如何操作的，再记录下来，这样不常用的也不需要拿出来干扰。</p><h2 id="入门" tabindex="-1">入门 <a class="header-anchor" href="#入门" aria-label="Permalink to &quot;入门&quot;">​</a></h2><p>VIM和平常的编辑器有一个很大的不同，就是<code>控制模式</code>，当你使用 <code>vim test.txt</code> 进入编辑界面后，你会发现按什么键都不太起作用，然后也不知道怎么退出。 进入<code>控制模式</code>之后，按 <code>i</code> 键，就可以进入编辑模式，这时候就可以随便输入一些内容 然后按<code>ESC</code>键，又会回到<code>控制模式</code>，这时候按<code>:</code>键，会在屏幕最下面出现 <code>:</code> 提示符 接着输入 <code>wq</code>，就可以保存当前文件退出，或者 <code>q!</code> 放弃当前的内容退出。 至此就完成了最简单的打开文件，编辑文件，和保存退出的操作了，应急编辑一下配置文件应该足够了。</p><p>下面记录一些使用场景，中文括号【】里面为助记词</p><h2 id="切换模式" tabindex="-1">切换模式 <a class="header-anchor" href="#切换模式" aria-label="Permalink to &quot;切换模式&quot;">​</a></h2><p><code>ESC</code> : 回到控制模式</p><p>控制模式下输入 <code>:</code> 切换到命令模式， 输入 <code>:wq</code>【write&amp;quit】 保存退出， <code>:q!</code> 放弃保存退出</p><p><code>i</code>【insert】: 切换到编辑模式 <code>o</code> 切换编辑模式，且在下方插入一个新行</p><h2 id="跳转" tabindex="-1">跳转 <a class="header-anchor" href="#跳转" aria-label="Permalink to &quot;跳转&quot;">​</a></h2><p><code>gg</code> : 跳转到第一行第一个字符<br><code>G</code> : 跳转到最后一行<br><code>G$</code> : 跳转到最后一行最后一个字符<br><code>0</code> : 跳转到当前行的第一个字符</p><h2 id="选择" tabindex="-1">选择 <a class="header-anchor" href="#选择" aria-label="Permalink to &quot;选择&quot;">​</a></h2><p><code>v</code> : 在控制模式下按 <code>v</code>【visual】，再按光标键，可以选择区域</p><h2 id="复制" tabindex="-1">复制 <a class="header-anchor" href="#复制" aria-label="Permalink to &quot;复制&quot;">​</a></h2><p><code>y</code> : 选择区域后，按 <code>y</code> 复制当前区域到缓冲区<br><code>yy</code> : 直接复制一整行<br><code>nyy</code> : n为数字，表示复制几行<br><code>yG</code> : 复制到文档最末尾</p><p>现在实践一个常用操作，全选整个文本，拷贝内容。 操作如下<br><code>gg</code> 跳转到文件首 <code>v</code> 开启视图选择模式 <code>G$</code> 跳转到文件尾， <code>y</code> 复制所有内容.</p><h2 id="剪切" tabindex="-1">剪切 <a class="header-anchor" href="#剪切" aria-label="Permalink to &quot;剪切&quot;">​</a></h2><p><code>d</code> : 选择区域后，按 <code>d</code> 剪切当前区域到缓冲区<br><code>dd</code> : 直接剪切当前行<br><code>ndd</code> : n为数字，表示剪切几行<br><code>dG</code> : 剪切到文档最末尾</p><h2 id="粘贴" tabindex="-1">粘贴 <a class="header-anchor" href="#粘贴" aria-label="Permalink to &quot;粘贴&quot;">​</a></h2><p><code>p</code>【paste】 : 粘贴缓冲区内容到光标处</p><h2 id="撤销操作" tabindex="-1">撤销操作 <a class="header-anchor" href="#撤销操作" aria-label="Permalink to &quot;撤销操作&quot;">​</a></h2><p><code>u</code> : 如果想取消前面的步骤，按<code>u</code>【undo】，重做则是 <code>ctrl+r</code>【redo】</p><h2 id="查找-查找下一个" tabindex="-1">查找/查找下一个 <a class="header-anchor" href="#查找-查找下一个" aria-label="Permalink to &quot;查找/查找下一个&quot;">​</a></h2><p>vim 中用 / 和 ? 来查找字符串 输入 / ，然后输入要查找的关键字，找到后，按回车<br> 继续 按 <code>n</code> 【next】查找下一个， <code>N</code> 查找上一个，找到后输入 <code>i</code> 开始编辑</p><h2 id="替换" tabindex="-1">替换 <a class="header-anchor" href="#替换" aria-label="Permalink to &quot;替换&quot;">​</a></h2><p>vim 中可以使用 😒 命令来替换字符串<br> 😒/vivian/sky/ 替换当前行第一个 vivian 为 sky<br> 😒/vivian/sky/g 替换当前行所有 vivian 为 sky<br> :n，$s/vivian/sky/g 替换第 n 行开始到最后一行中每一行所有 vivian 为 sky，其中n为数字，$表示最末行。</p><h2 id="xshell-vim-小键盘乱码问题" tabindex="-1">xshell vim 小键盘乱码问题 <a class="header-anchor" href="#xshell-vim-小键盘乱码问题" aria-label="Permalink to &quot;xshell vim 小键盘乱码问题&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">修改</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> session</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 属性</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> -</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 终端</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Terminal</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) -</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> VT模式</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">VT</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Modes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) -</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 初始数字键盘模式</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Initial</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Numeric</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Kepad</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Mode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">DECNKM</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">选择</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 设置为普通</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">set</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> to</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> normal</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><h2 id="vim-常用快捷键" tabindex="-1">VIM 常用快捷键 <a class="header-anchor" href="#vim-常用快捷键" aria-label="Permalink to &quot;VIM 常用快捷键&quot;">​</a></h2><h3 id="一-移动光标" tabindex="-1">一. 移动光标 <a class="header-anchor" href="#一-移动光标" aria-label="Permalink to &quot;一. 移动光标&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 左移h. 右移l. 下移j. 上移k</span></span>
<span class="line"><span>2. 向下翻页ctrl + f，向上翻页ctrl + b</span></span>
<span class="line"><span>3. 向下翻半页ctrl + d，向上翻半页ctrl + u</span></span>
<span class="line"><span>4. 移动到行尾$，移动到行首0（数字），移动到行首第一个字符处^</span></span>
<span class="line"><span>5. 移动光标到下一个句子 ），移动光标到上一个句子（</span></span>
<span class="line"><span>6. 移动到段首{，移动到段尾}</span></span>
<span class="line"><span>7. 移动到下一个词w，移动到上一个词b</span></span>
<span class="line"><span>8. 移动到文档开始gg，移动到文档结束G</span></span>
<span class="line"><span>9. 移动到匹配的{}.().[]处%</span></span>
<span class="line"><span>10. 跳到第n行 ngg 或 nG 或 :n</span></span>
<span class="line"><span>11. 移动光标到屏幕顶端H，移动到屏幕中间M，移动到底部L</span></span>
<span class="line"><span>12. 读取当前字符，并移动到本屏幕内下一次出现的地方 *</span></span>
<span class="line"><span>13. 读取当前字符，并移动到本屏幕内上一次出现的地方 #</span></span></code></pre></div><h3 id="二-查找替换" tabindex="-1">二. 查找替换 <a class="header-anchor" href="#二-查找替换" aria-label="Permalink to &quot;二. 查找替换&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 光标向后查找关键字 #或者g#</span></span>
<span class="line"><span>2. 光标向前查找关键字 *或者g*</span></span>
<span class="line"><span>3. 当前行查找字符 fx， Fx， tx， Tx</span></span>
<span class="line"><span>4. 基本替换 :s/s1/s2 （将下一个s1替换为s2）</span></span>
<span class="line"><span>5. 全部替换 :%s/s1/s2</span></span>
<span class="line"><span>6. 只替换当前行 :s/s1/s2/g</span></span>
<span class="line"><span>7. 替换某些行 :n1，n2 s/s1/s2/g</span></span>
<span class="line"><span>8. 搜索模式为 /string，搜索下一处为n，搜索上一处为N</span></span>
<span class="line"><span>9. 制定书签 mx， 但是看不到书签标记，而且只能用小写字母</span></span>
<span class="line"><span>10. 移动到某标签处 \`x，1旁边的键</span></span>
<span class="line"><span>11. 移动到上次编辑文件的位置 \`.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PS：.代表一个任意字符 *代表一个或多个字符的重复</span></span>
<span class="line"><span>         正则表达式的内容将会在后续文章中整理</span></span></code></pre></div><h3 id="三-编辑操作" tabindex="-1">三. 编辑操作 <a class="header-anchor" href="#三-编辑操作" aria-label="Permalink to &quot;三. 编辑操作&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 光标后插入a， 行尾插入A</span></span>
<span class="line"><span>2. 后插一行插入o，前插一行插入O</span></span>
<span class="line"><span>3. 删除字符插入s， 删除正行插入S</span></span>
<span class="line"><span>4. 光标前插入i，行首插入I</span></span>
<span class="line"><span>5. 删除一行dd，删除后进入插入模式cc或者S</span></span>
<span class="line"><span>6. 删除一个单词dw，删除一个单词进入插入模式cw</span></span>
<span class="line"><span>7. 删除一个字符x或者dl，删除一个字符进入插入模式s或者cl</span></span>
<span class="line"><span>8. 粘贴p，交换两个字符xp，交换两行ddp</span></span>
<span class="line"><span>9. 复制y，复制一行yy</span></span>
<span class="line"><span>10. 撤销u，重做ctrl + r，重复.</span></span>
<span class="line"><span>11. 智能提示 ctrl + n 或者 ctrl + p</span></span>
<span class="line"><span>12. 删除motion跨过的字符，删除并进入插入模式 c{motion}</span></span>
<span class="line"><span>13. 删除到下一个字符跨过的字符，删除并进入插入模式，不包括x字符 ctx</span></span>
<span class="line"><span>14. 删除当前字符到下一个字符处的所有字符，并进入插入模式，包括x字符，cfx</span></span>
<span class="line"><span>15. 删除motion跨过的字符，删除但不进入插入模式 d{motion}</span></span>
<span class="line"><span>16. 删除motion跨过的字符，删除但不进入插入模式，不包括x字符 dtx</span></span>
<span class="line"><span>17. 删除当前字符到下一个字符处的所有字符，包括x字符 dfx</span></span>
<span class="line"><span>18. 如果只是复制的情况时，将12-17条中的c或d改为y</span></span>
<span class="line"><span>19. 删除到行尾可以使用D或C</span></span>
<span class="line"><span>20. 拷贝当前行 yy或者Y</span></span>
<span class="line"><span>21. 删除当前字符 x</span></span>
<span class="line"><span>22. 粘贴 p</span></span>
<span class="line"><span>23. 可以使用多重剪切板，查看状态使用:reg，使用剪切板使用”，例如复制到w寄存器，”wyy，或者使用可视模式v”wy</span></span>
<span class="line"><span>24. 重复执行上一个作用使用.</span></span>
<span class="line"><span>25. 使用数字可以跨过n个区域，如y3x，会拷贝光标到第三个x之间的区域，3j向下移动3行</span></span>
<span class="line"><span>26. 在编写代码的时候可以使用]p粘贴，这样可以自动进行代码缩进</span></span>
<span class="line"><span>27.  &gt;&gt; 缩进所有选择的代码</span></span>
<span class="line"><span>28.  &lt;&lt; 反缩进所有选择的代码</span></span>
<span class="line"><span>29. gd 移动到光标所处的函数或变量的定义处</span></span>
<span class="line"><span>30. K 在man里搜索光标所在的词</span></span>
<span class="line"><span>31. 合并两行 J</span></span>
<span class="line"><span>32. 若不想保存文件，而重新打开 :e!</span></span>
<span class="line"><span>33. 若想打开新文件 :e filename，然后使用ctrl + ^进行文件切换</span></span></code></pre></div><h3 id="四-窗口操作" tabindex="-1">四. 窗口操作 <a class="header-anchor" href="#四-窗口操作" aria-label="Permalink to &quot;四. 窗口操作&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 分隔一个窗口:split或者:vsplit</span></span>
<span class="line"><span>2. 创建一个窗口:new或者:vnew</span></span>
<span class="line"><span>3. 在新窗口打开文件:sf {filename}</span></span>
<span class="line"><span>4. 关闭当前窗口:close</span></span>
<span class="line"><span>5. 仅保留当前窗口:only</span></span>
<span class="line"><span>6. 到左边窗口 ctrl + w， h</span></span>
<span class="line"><span>7. 到右边窗口 ctrl + w， l</span></span>
<span class="line"><span>8. 到上边窗口 ctrl + w， k</span></span>
<span class="line"><span>9. 到下边窗口 ctrl + w， j</span></span>
<span class="line"><span>10. 到顶部窗口 ctrl + w， t</span></span>
<span class="line"><span>11. 到底部窗口 ctrl + w， b</span></span></code></pre></div><h3 id="五-宏操作" tabindex="-1">五. 宏操作 <a class="header-anchor" href="#五-宏操作" aria-label="Permalink to &quot;五. 宏操作&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 开始记录宏操作q[a-z]，按q结束，保存操作到寄存器[a-z]中</span></span>
<span class="line"><span>2. @[a-z]执行寄存器[a-z]中的操作</span></span>
<span class="line"><span>3. @@执行最近一次记录的宏操作</span></span></code></pre></div><h3 id="六-可视操作" tabindex="-1">六. 可视操作 <a class="header-anchor" href="#六-可视操作" aria-label="Permalink to &quot;六. 可视操作&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 进入块可视模式 ctrl + v</span></span>
<span class="line"><span>2. 进入字符可视模式 v</span></span>
<span class="line"><span>3. 进入行可视模式 V</span></span>
<span class="line"><span>4. 删除选定的块 d</span></span>
<span class="line"><span>5. 删除选定的块然后进入插入模式 c</span></span>
<span class="line"><span>6. 在选中的块同是插入相同的字符 I&lt;String&gt;ESC</span></span></code></pre></div><h3 id="七-跳到声明" tabindex="-1">七. 跳到声明 <a class="header-anchor" href="#七-跳到声明" aria-label="Permalink to &quot;七. 跳到声明&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. [[ 向前跳到顶格第一个{  </span></span>
<span class="line"><span>2. [] 向前跳到顶格第一个}</span></span>
<span class="line"><span>3. ]] 向后跳到顶格的第一个{</span></span>
<span class="line"><span>4. ]] 向后跳到顶格的第一个}</span></span>
<span class="line"><span>5. [{ 跳到本代码块的开头</span></span>
<span class="line"><span>6. ]} 跳到本代码块的结尾</span></span></code></pre></div><h3 id="八-挂起操作" tabindex="-1">八. 挂起操作 <a class="header-anchor" href="#八-挂起操作" aria-label="Permalink to &quot;八. 挂起操作&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 挂起Vim ctrl + z 或者 :suspend</span></span>
<span class="line"><span>2. 查看任务 在shell中输入 jobs</span></span>
<span class="line"><span>3. 恢复任务 fg [job number]（将后台程序放到前台）或者 bg [job number]（将前台程序放到后台）</span></span>
<span class="line"><span>4. 执行shell命令 :!command</span></span>
<span class="line"><span>5. 开启shell命令 :shell，退出该shell exit</span></span>
<span class="line"><span>6. 保存vim状态 :mksession name.vim</span></span>
<span class="line"><span>7. 恢复vim状态 :source name.vim</span></span>
<span class="line"><span>8. 启动vim时恢复状态 vim -S name.vim</span></span></code></pre></div><p>【全文完】</p>`,46)])])}const b=a(i,[["render",l]]);export{k as __pageData,b as default};

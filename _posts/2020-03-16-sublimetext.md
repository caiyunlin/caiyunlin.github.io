---
title: Sublime Text 使用小结
date: 2020-03-18 09:00:00  
categories: [技术]  
tags: [sublime]  
urlname: sublimetext  
url: http://www.caiyunlin.com/2020/03/sublimetext/
---

## Sublime Text 简介
Sublime Text 是一个轻量、简洁、高效、跨平台的编辑器。 它启动速度快，颜值高，对各类变成语言都有很好的支持。


## Sublime Text 使用技巧

### 竖行选择
首先将光标移到要操作内容的第一行，按住 Shift 键，再按住鼠标右键，往下拖动，就可以出现多个光标。 
此时，再输入文字，或者做其他操作，都会在多行同时执行。 可以使用下面文字做测试，如：将 class1 替换改成 class2
```html
<ul>
	<li class="class1">1</li>
	<li class="class1">2</li>
	<li class="class1">3</li>
	<li class="class1">4</li>
	<li class="class1">5</li>
	<li class="class1">6</li>
</ul>
```

## 开启 Shell 

Sublime 自带的 shell ，可以使用 ctrl+` 唤起，但是它是基于 Python 的，不能运行其他 cmd, powershell 等命令。  
是否可以像 VS Code 那样，自带 cmd 或者 powershell 的 shell 呢，答案是可以的，方法如下。  


1. 安装 `Package Control`   
如果你没有安装过 `Package Control`, 按下 `Ctrl+Shift+P`， 在输入框中输入 `Package Control`, 然后选中 `Install Package Control`, 回车确认

2. 安装 `Terminus`   
`Package Control` 安装好之后，再次按下 `Ctrl+Shift+P`，在输入框中输入 `Install Package`, 选中 `Package Control : Install Package`, 回车   
在弹出的窗口中，搜索 `Termius` 回车安装

3. 配置快捷键
选中菜单 `Preferences -> Package Settings -> Terminus -> Key bindings`   
在弹出的 json 中，输入以下快捷键配置，保存
```json
{ "keys": ["ctrl+`"], "command": "toggle_terminus_panel" }
```

4. 按下 Ctrl + \` 则会弹出 `cmd` 的 `shell，` 在其中输入 `powershell` 就会进入到 `PowerShell` 
## Sublime Text 插件
- All Autocomplete
　　`Sublime Text` 默认的 `Autocomplete` 功能只考虑当前的文件，而 AllAutocomplete 插件会搜索所有打开的文件来寻找匹配的提示词。 
- Terminus
	可以像VSCode那样打开真正的控制台
- SFTP
	可以将本地文件快速同步到远程服务器，支持 `ftp,sftp,ftps` 等
- MarkdownPreview
	快速预览 Markdown 文件
- LiveReload
	配合 Markdown Preview 自动刷新预览的 Markdown 文件
- ImagePaste
	可以粘贴剪贴板图片到 markdown 文件所在的图片文件夹


## Sublime Text 开启 Markdown 预览

1. 使用组合键 Ctrl+Shift+P 调出命令面板
2. 输入 Install Package ，选中 Package Control : Install Package, 回车 在弹出的窗口中，搜索 MarkdownPreview 回车安装
3. 安装完成之后，再次按 Ctrl+Shift+P，输入 Markdown Preview 找到并选中Markdown Preview： Preview in Browser
4. 界面出现三个选项：github,gitlab和markdown。任选其一即可，github/gitlab是利用他们的在线API来解析.md文件，支持在线资源的预览，如在线图片它的解析速度取决于你的联网速度。markdown就是传统的本地打开，不支持在线资源的预览。
5. 按回车，会在默认浏览器中显示预览结果

注意此时 Markdown 的预览是静态的，如果需要自动预览还需要再安装一下 LiveReload 插件

1. 按下 `Ctrl+Shift+p`, 输入 `Install Package`，输入 `LiveReload`, 回车安装
2. 安装成功后, 再次 `Ctrl+shift+p`, 输入 `LiveReload: Enable/disable plug-ins`, 回车, 选择 `Simple Reload with delay (400ms)` 或者 `Simple Reload`，两者的区别在于后者没有延迟。

默认 `MarkdownPreview` 的 `enable_autoreload` 设置是 `true` 的，如果没有，参考下面步骤设置一下
打开其配置文件 `Preferences -> Package Settings -> Markdown Preview -> Settings`，在右侧栏加一条下面这个自定义参数，然后重启 `Sublime`:
```json
{
    "enable_autoreload": true
}
```

## Sublime Text 常用快捷键

- `ctrl+shift+n` 打开新Sublime 
- `ctrl+shift+w` 关闭Sublime，关闭所有打开文件 
- `ctrl+shift+t` 重新打开最近关闭文件
- `ctrl+n` 新建文件 
- `ctrl+s` 保存 
- `ctrl+shift+s` 另存为 
- `ctrl+f4` 关闭文件 
- `ctrl+w` 关闭 
- `ctrl+k, ctrl+b` 切换侧边栏显示状态 
- `f11` 切换全屏状态 
- `shift+f11` 免打扰模式状态切换 
- `backspace` 删除左侧 
- `shift+backspace` 左侧删除 
- `ctrl+shift+backspace` 左侧全部删除 
- `delete` 右侧删除 
- `enter` 插入 
- `shift+enter` 插入 
- `ctrl+z` 撤消 
- `ctrl+shift+z` 重做 
- `ctrl+y` 重做或重复 
- `ctrl+u` 软撤消 
- `ctrl+shift+u` 软重做 
- `ctrl+shift+v` 粘贴并格式化 
- `shift+delete` 剪切 
- `ctrl+insert` 拷贝 
- `shift+insert` 粘贴 
- `shift+left` 移动并选择 
- `shift+right` 移动并选择 
- `shift+up` 移动并选择 
- `shift+down` 移动并选择 
- `ctrl+left` 按\w规则移动（跳跃） 
- `ctrl+right` 按\w规则移动（跳跃） 
- `ctrl+shift+left` 按\w规则移动并选择


## Sublime Text 设置

按下 `Preferences -> Settings` 菜单，可以打开 Sublime Text 的用户设置，下面是我配置的一些默认设置：
```javascript
{
	// 设置Sans-serif（无衬线）等宽字体，以便阅读
	"font_face": "YaHei Consolas Hybrid",
	// 字体大小
	"font_size": 12,
	// 使光标闪动更加柔和
	"caret_style": "phase",
	// 高亮当前行
	"highlight_line": true,
	// 高亮有修改的标签
	"highlight_modified_tabs": true,
	// 主题设置
	"theme": "Default.sublime-theme",
	"color_scheme": "Packages/Color Scheme - Default/Monokai.sublime-color-scheme",
	// Sublime Merge
	"sublime_merge_path": "SublimeMerge/sublime_merge.exe"
}

```

【全文完】
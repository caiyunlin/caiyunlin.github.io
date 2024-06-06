---
title: 给 Sublime Text 创建一个 markdeep 插件
date: 2020-03-18 09:00:00  
categories: [技术]  
tags: [sublime,markdeep]  
urlname: sublimetext-markdeep  
url: http://www.caiyunlin.com/2020/03/sublimetext-markdeep/
---

> 本文介绍如何创建一个Sublime Text 3的插件，并用这个插件自动预览markdown文件

## markdeep 简介
markdeep 是一个轻巧的markdown解析器，只需要一行代码就可以直接解析本地的markdown文件。
使用方法是将md文件改名为html结尾，如 test.md 改成 test.md.html，并且在文件最后面增加如下代码，双击用浏览器打开即可

```html
<!-- Markdeep: --><style class="fallback">body{visibility:hidden;white-space:pre;font-family:monospace}</style><script src="markdeep.min.js"></script><script src="https://casual-effects.com/markdeep/latest/markdeep.min.js?"></script><script>window.alreadyProcessedMarkdeep||(document.body.style.visibility="visible")</script>

```

markdeep 支持很多插件，如,LaTeX,流程图,日历等，非常强大，详细的使用方法参考： http://casual-effects.com/markdeep/ 

但是它有个缺点，就是需要手动将文件名改名为html结尾,这样使用代码编辑器的时候，md的高亮效果就会丢失，且改掉后缀也不是很好的做法。

## Sublime Text 3 的 markdeep 插件

因为我经常使用 Sublime 编辑 markdown 文件，所以希望能够在编辑过程只直接按一个快捷键，或者一个右键菜单，就能快速用markdeep来预览当前文件。   寻找了一下，没有现成的插件，所以决定自己写一个，开发步骤如下： 

1. 创建插件文件

打开Sublime Text 3, 选择 Tools -> Developer -> New Plugin ... 菜单，系统会自动创建如下文件

```python 
import sublime
import sublime_plugin

class ExampleCommand(sublime_plugin.TextCommand):
	def run(self, edit):
		self.view.insert(edit, 0, "Hello, World!")

```

将文件修改为下面内容，为了加速我把`markdeep.min.js`部署到了七牛云上

```python
import sublime
import sublime_plugin
import tempfile
import webbrowser

class MarkdeepPreviewCommand(sublime_plugin.TextCommand):
	def run(self, edit):
		# get all contents from current view
		contents = self.view.substr(sublime.Region(0, self.view.size()))
		# save to temp file
		tempfilename = tempfile.mkstemp(".html")
		f = open(tempfilename[1], 'w')
		f.write(contents)
		f.write('<!-- Markdeep: --><style class="fallback">body{visibility:hidden;white-space:pre;font-family:monospace}</style><script src="http://public.caiyunlin.com/markdeep.min.js"></script><script>window.alreadyProcessedMarkdeep||(document.body.style.visibility="visible")</script>')
		f.close()
		webbrowser.open(tempfilename[1])
```
这里稍微解释一下，首先就是 `MarkdeepPreviewCommand` 这个class，插件系统会自动将这个驼峰命名解析为 `markdeep_preview` 的 command, 这个command在后面菜单和快捷键的地方会用到。   

代码内容比较简单，就是获取当前编辑器的所有内容，然后追加一个markdeep的脚本信息，保存到临时文件，最后用默认浏览器打开。  

有关Sublime Text 3的插件API，可以参考这里 http://www.sublimetext.com/docs/api-reference
中文翻译： https://www.oschina.net/translate/sublime-text-plugin-api-reference  

将文件内容保存到Sublime Text 3的Packges路径下，如 `sublime\Data\Packages\MarkDeep\main.py` 这里是创建MarkDeep目录，并且将脚本保存为main.py，系统会自动加载
<br/>

2. 创建右键菜单
在MarkDeep目录下面，创建 `Context.sublime-menu` 文件，内容如下，这里的command就是对应第一个脚本的名称

```python
[
	{ "caption": "-" },
	{
		"caption": "MarkDeep Preview",
		"command" : "markdeep_preview"
	}
]
```

3. 绑定快捷键，这里是绑定了F12键
在MarkDeep目录下面，创建 `Default (Windows).sublime-keymap` 文件，如果要支持Mac系统，则创建 `Default (OSX).sublime-keymap`，Linux系统，则是 `Default (Linux).sublime-keymap`

```json
[ 
    { "keys": ["f12"], "command": "markdeep_preview" } 
] 
```

4. 测试，新建一个md文件，如 test.md，黏贴以下内容，右键选择 "Markdeep Preview"，或者直接按 F12 键，预览一下吧！

```markdown

**Example**

Welcome to Markdeep. It's the simple 
way to write plain text with _style_.
                          
*************************************
*                _______            *
* .-------.     /      /   .-----.  *
* | Write +-+->/ Edit ++->| Share | *
* '-------' ^ /______/ |   '-----'  *
*           |          |            *
*            '--------'             *
*************************************

1. Write a text document
2. Add the Markdeep line at the end
3. Save with file extension `.md.html`
4. Double-click to view

**Notes**
!!!
    I'm a note. Don't mind me, I'm just sitting here.

!!!
    I'm a note. Don't mind me, I'm just sitting here.

!!! note
    Another note.

!!! Tip
    Close the door on the way out.

!!! WARNING
    I'm a warning, perhaps. *Something might happen!*

!!! ERROR: Seriously
    Watch out, something **bad** could happen.

    This is still more error text.

Learn more at
https://casual-effects.com/markdeep

```

【全文完】
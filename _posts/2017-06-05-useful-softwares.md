---
title: Windows 下好用的软件整理  
date: 2017-06-05 14:50:00   
categories : [技术]  
tags: [vim,editor,powershell]  
urlname: windows-useful-softwares  
url: https://www.caiyunlin.com/2017/06/windows-useful-softwares/  
---

工欲善其事必先利其器。

给大家分享一下我常用的感觉比较好的软件。


## 桌面截屏 - FSCapture

[桌面截屏 - FSCapture](https://public.caiyunlin.com/fscapture-8.4.zip)
	非常简单的截图小软件，可以添加水平印，也可以对图像进行简单处理。 可设置水印、撕边、阴影等效果！ 软件还附带放大镜，拾色器，屏幕标尺等小功能。 本站的截图基本是用它在处理的。   
	![image](https://images.caiyunlin.com/20200406123633.png) 

## 桌面动态截屏 - LICEcap

[桌面动态截屏 - LICEcap](https://public.caiyunlin.com/licecap-1.28.zip)
	LICEcap 是一款短小精悍、免费开源的屏幕录像 GIF 动画制作软件，启动软件后，会显示一个中间透明的窗口框，LICEcap 可以将框框范围内的屏幕内容变化全部捕捉录制下来并保存成 GIF 格式的动画图片。    
	![image](https://images.caiyunlin.com/20200406122712.png) 

## 动态截屏+GIF编辑

[动态截屏+GIF编辑 - ScreenToGif](https://public.caiyunlin.com/screentogif_2.17.1.zip)
    上面一款工具的增强版，除了截屏，还可以编辑GIF文件，增加字幕等   
    ![image](https://images.caiyunlin.com/20200407100625.png)

## 磁盘空间分析 - SpaceSniffer

[磁盘空间分析 - SpaceSniffer](https://public.caiyunlin.com/spacesniffer-1.2.zip)
	磁盘渐满却不知如何清理文件? SpaceSniffer是一个可以让您硬盘中文件和文件夹的分布情况的应用程序。 SpaceSniffer可以很直观的以区块，数字和颜色来显示硬盘上文件夹，文件大小，还能用筛选器过滤出要找的文件。 点击每个区块能进入该文件夹得到更详细的资料。   
	![image](https://images.caiyunlin.com/20200406124702.png) 

## 密码管理 - KeePass

[密码管理 - KeePass](https://public.caiyunlin.com/keypass-2.42.1.zip)
	想保存自己众多的密码，但是又不太相信各大厂商？ KeePass 就是专门为了解决这个问题的，它是一款开源的密码管理软件，包含了一个强大的密码产生引擎与加密储存机能，能够提供一个安全的密码储存空间。它所有的数据都是保存在你本地的密码文件里，你也可以用云盘去同步它，但是没有主密码没有人能打开它。 保存好密码，就可以按快捷键Ctrl+Alt+A自动填充网页上的密码输入框，高效又安全。   
	![image](https://images.caiyunlin.com/20200406011137.png)

## 远程桌面管理 - MultiDesk

[远程桌面管理 - MultiDesk](https://public.caiyunlin.com/multidesk-3.0.zip)
	MultiDesk 是一款小巧的远程桌面连接工具（只有一个执行文件，绿色免安装），可以完美替代MSTSC。   
	![image](https://images.caiyunlin.com/20200406043433.png)

## 热键管理 - AutoHotKey

[热键管理 - AutoHotKey](https://public.caiyunlin.com/autohotkey-1.0.47.zip)
	AutoHotkey 是一个可以让你定义自己的热键、热字串或设定的条件自动执行重复性工作，说一下我使用的两个场景，1是我经常随手会记录一个日志，所以我定义了按 Ctrl+T，就会自动在当前光标处插入当前时间，如`2020-04-06 16:11`， 非常方便。    2是我经常写markdown文件的时候，需要截图，我就定义了一个热键，比如`Ctrl+U`，这样我先截图复制图片内容，然后通过这个热键，就会自动调用一个脚本，将内存中的图片保存并且上传到七牛云的空间，然后返回图片URL，再自动粘贴到文档中，非常方便，下面是示例效果。 
	![image](https://images.caiyunlin.com/20200406051445.gif)


## 其他软件整理

为方便管理，软件统一成固定的格式的压缩包softwarename-1.0.zip，如flashfxp-3.6.0.zip，就是FlashFxp的3.6.0版本
下载地址为 ： https://public.caiyunlin.com/flashfxp-3.6.0.zip 

## 自动安装

自动安装使用PowerShell命令行的方式，只需要使用两行代码即可安装需要的软件
```
iex (new-object net.webclient).downloadstring('https://www.caiyunlin.com/dev/powertask')
install FlashFxp 
```
具体使用说明

1. 打开PowerShell命令行
1. 复制 iex (new-object net.webclient).downloadstring('https://www.caiyunlin.com/dev/powertask') 到PowerShell命令行执行
1. 如果遇到错误，可能是执行脚本权限问题，可以先执行 Set-ExecutionPolicy bypass再执行上一步
1. 切换到需要安装的目录，如c:\softwares，执行需要安装的软件 如： install FlashFxp
1. 也可以直接指定安装目录 如：install FlashFxp c:\softwares\FlashFxp
1. 注意：软件的安装只是简单的解压缩，如果是绿色软件，可以直接使用，如果是需要进一步安装的，需要打开目录，执行安装文件
1. 注意：下载的zip文件在安装后会自动删除，如需要可自行压缩，或者使用 get xxx 直接下载一份，如 get flashfxp

目前可以支持的软件，会在使用过程中慢慢更行此列表，直接执行 install 可以显示可用的软件清单
```
install FlashFxp
install 7Zip
install Git
install MongoDB
install MultiDesk
install NCFtp
install php
install Putty
install SublimeText
install Svn
```

## 实现思路
1. 申请一个存放软件的空间，我使用的是七牛云，免费的可以支持10G
1. 整理软件包资源，上传到空间里
1. 使用PowerShell实现下载文件Get-WebFile，解压缩Expand-Zip等功能，并且提交到github上，获得可在线访问的地址
1. 封装PowerShell脚本到Module，使用动态加载脚本的方式载入在线脚本，具体实现可参考 https://github.com/cylin2000/powertask 
1. 执行脚本下载和安装软件

这件事情没有用到太复杂的技术，但是可以省下不少时间。

【全文完】
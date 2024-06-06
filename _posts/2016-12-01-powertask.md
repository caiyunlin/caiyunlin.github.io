---
title: 在线的PowerShell类库 - PowerTask  
date: 2016-12-01 11:37:45  
categories : [技术]   
tags: [powershell]  
urlname: powertask  
url: https://www.caiyunlin.com/2016/12/powertask/  
---

在公司的项目中，写了大量的PowerShell脚本去安装软件和部署新的Release，偶尔也会分享PowerShell脚本给其他Team的同事。  
闲暇之余，研究了一下，发现只要打开权限，PowerShell也有远程下载执行脚本并且执行的功能，遂产生一个念头，如果将通用的PowerShell脚本封装成在线的功能库，然后本地只用一行脚本载入一下，这样不是能很好的复用了吗？ 而且可以实时载入最新的版本，那不是很快活。

说干就干，在GitHub上面开了项目，暂且命名为 PowerTask，地址 https://github.com/cylin2000/powertask


## 主要功能

1. 用管理员模式打开PowerShell

2. 如果你是第一次使用PowerShell，输入以下命令，打开脚本执行权限（执行一次即可，后面再打开不需要重复执行）
```powershell
Set-ExecutionPolicy bypass
```

3. 复制粘贴，执行以下命令
```powershell
iex (new-object net.webclient).downloadstring('https://www.soft263.com/dev/PowerTask/PowerTask.ps1')
# 或者
iex (new-object net.webclient).downloadstring('https://raw.githubusercontent.com/cylin2000/powertask/master/PowerTask.ps1?t='+(Get-Random))
```
系统出现以下界面代表载入成功  

![image](https://images.caiyunlin.com/20200326043852.png)


## 获取使用帮助

比如我们要使用 Get-StringHash , 这是个字符串加密工具，可以使用标准的powershell命令`Get-Help Get-StringHash`查询使用帮助

![image](https://images.caiyunlin.com/20200326044535.png)

执行 Get-StringHash 获得 MD5 编码
```powershell
PS C:\Users\ycai8> Get-StringHash "abc"
900150983cd24fb0d6963f7d28e17f72
```

## 功能简介

PowerTask 目前包含的功能还不是很多，但是在不断完善中，下面是一个简要的介绍

```powershell
Add-FtpFile            # 上传文件到FTP服务器
Compress-Zip           # 压缩 Zip 文件
Expand-Zip             # 解压 Zip 文件
Get-DoubanMovieRate    # 获取电影的豆瓣评分(调用的豆瓣API)
Get-FtpFile            # 下载FTP文件
Get-InstalledSoftware  # 获取本地安装的软件清单
Get-Software           # 下载在线软件
Get-StringHash         # 获取文本的加密编码
Get-WebContent         # 获取Web地址的文本内容，类似于 wget
Get-WebFile            # 下载Web地址的文件
Install-PowerTask      # 安装PowerTask到本地
Install-Software       # 安装在线软件
Invoke-Batch           # 调用本地bat文件
Invoke-FlashWindow     # 调用闪屏窗口
Invoke-Sql             # 执行本地SQL脚本
New-RandomPassword     # 生成一个随机密码
Send-Sms               # 发送短信(使用webchinese接口)
Set-TaskbarProgress    # 设置Taskbar进度条
Show-BalloonTip        # 显示桌面右下角气泡提示
```

【全文完】
---
title: 如何创建标准的 PowerShell 函数   
date: 2016-12-02 06:46:00  
categories : [技术]   
tags: [powershell]  
urlname: how-to-create-ps-function   
url: http://www.caiyunlin.com/2016/12/how-to-create-ps-function/  
---

PowerShell有很多内置的命令，我们自己也会创建很多自定义的脚本，上一篇介绍了我创建的一个在线PowerTask类库就是自定义的脚本，其显示的方式跟默认的命令很类似，如何使自己创建的脚本能有系统自带的命令一样的体验呢？

答案就在于Function，在Windows PowerShell 2.0 中引入了一种新类型的Function，叫Advanced Function，通过它你可以创建出跟Windows PowerShell的cmdlet体验完全一样命令。

本文从以下几个方面讨论如何创建自己的 Advanced Function。

## 命名一个 Function  

我们自己创建一个脚本，命名可能比较随意，比如 DownloadFile.ps1，用于下载一个文件，但是我们观察PowerShell自带的命令，一般是以 动词-名字 来组织命令的。 
所以对于刚才的DownloadFile.ps1我们可以命名为 Download-File.ps1

我们最开始创建的脚本可能是这样的    
创建 C:\Download-File.ps1 内容如下
``` powershell
param(
        [Parameter(Mandatory=$True)][String] $Url,
        [Parameter(Mandatory=$True)][String] $LocalFile 
)

$client = New-Object System.Net.WebClient
$client.DownloadFile($Url, $LocalFile)
```
这样一个基本的下载文件的Function就创建好了，测试一下，效果应该如下
```
PS C:\> .\Download-File.ps1 "http://ss.bdimg.com/static/superman/img/logo/bd_logo1_31bdc765.png" c:\logo.png
PS C:\> ls c:\logo.png

    Directory: C:\

Mode                LastWriteTime     Length Name
----                -------------     ------ ----
-a---         2016/12/8     14:52       3706 logo.png
PS C:\>
```

## 内置帮助信息   
当我们不知道一个PowerShell命令如何使用的时候，我们一般会输入 Get-Help Cmdlet 的方式来获取信息，那么我们如何为Download-File提供帮助信息呢？  
我们可以使用内置的注释模块如下：

``` powershell
<#
.SYNOPSIS
    Download a file
.DESCRIPTION
    Download a file from internet, you must provided a valid url of the file
.EXAMPLE 
    Download-File "http://ss.bdimg.com/static/superman/img/logo/bd_logo1_31bdc765.png" c:\logo.png
.EXAMPLE 
    Download-File -Url "http://ss.bdimg.com/static/superman/img/logo/bd_logo1_31bdc765.png" -LocalFile c:\logo.png
.PARAMETER Url
    The Url information for the file to download
.PARAMETER LocalFile
    The destination file will dave in local
#>
param(
        [Parameter(Mandatory=$True)][String] $Url,
        [Parameter(Mandatory=$True)][String] $LocalFile 
)

$client = New-Object System.Net.WebClient
$client.DownloadFile($Url, $LocalFile)

```
执行Get-Help 会出现下面效果，我们看到在上面书写的注释已经正确显示出来了，我们也可以用 get-help C:\Download-File.ps1 -examples 去获取示例  
对这几个参数简单说明一下：

> .SYNOPSIS 对命令的简要描述   
> .DESCRIPTION 对命令的详细描述  
> .EXAMPLE 命令的使用范例，可以写多个范例  
> .PARAMETER 对命令需要的参数做描述，可以对列举多个参数   
> .NOTE 除以上外还可以用NOTE写一些备注信息，NOTE信息只是做参考，不会在 Get-Help 时出现  

```
PS C:\> Get-Help .\Download-File.ps1

NAME
    C:\Download-File.ps1

SYNOPSIS
    Download a file

SYNTAX
    C:\Download-File.ps1 [-Url] <String> [-LocalFile] <String> [<CommonParameters>]


DESCRIPTION
    Download a file from internet, you must provided a valid url of the file

RELATED LINKS

REMARKS
    To see the examples, type: "get-help C:\Download-File.ps1 -examples".
    For more information, type: "get-help C:\Download-File.ps1 -detailed".
    For technical information, type: "get-help C:\Download-File.ps1 -full".
```

## 发布一个模块   
至此我们已经写好一个模块，但是是以单个脚本文件存在的，调用时需要输入路径，还是和内置的Cmdlet有些区别。   
这时候我们可以借助PowerShell Module。将以上脚本封装到Function里，然后统一放到PowerShell Module里

创建文件: MyModule.psm1，内容如下
``` powershell
Function Download-File {
    <#
    .SYNOPSIS
        Download a file
    .DESCRIPTION
        Download a file from internet, you must provided a valid url of the file
    .EXAMPLE 
        Download-File "http://ss.bdimg.com/static/superman/img/logo/bd_logo1_31bdc765.png" c:\logo.png
    .EXAMPLE 
        Download-File -Url "http://ss.bdimg.com/static/superman/img/logo/bd_logo1_31bdc765.png" -LocalFile c:\logo.png
    .PARAMETER Url
        The Url information for the file to download
    .PARAMETER LocalFile
        The destination file will dave in local
    #>
    param(
            [Parameter(Mandatory=$True)][String] $Url,
            [Parameter(Mandatory=$True)][String] $LocalFile 
    )

    $client = New-Object System.Net.WebClient
    $client.DownloadFile($Url, $LocalFile)
}

Export-ModuleMember "*-*"

```
导入Module文件，我们看到PowerShell提示了一个Warning，原来是我们使用的动词不规范，Download并不在被认可的动词清单之中。  
```
PS C:\> Import-Module .\MyModule.psm1
WARNING: The names of some imported commands from the module 'MyModule' include unapproved verbs that might make them
less discoverable. To find the commands with unapproved verbs, run the Import-Module command again with the Verbose
parameter. For a list of approved verbs, type Get-Verb.
PS C:\> Get-Command -Module MyModule

CommandType     Name                                               ModuleName
-----------     ----                                               ----------
Function        Download-File                                      MyModule

```
使用 Get-Verb，选取一个合适的动词，如：Get-WebFile

## 最后一步  

将多个Function封装到Module文件中，取一个合适的Module名字，再借助于GitHub，我们可以将自己的类库分享给更多的朋友使用啦

在此我也安利一下我整理的PowerShell类库，存放在 https://github.com/cylin2000/powertask ,只需一句话调用即可使用，方便快捷

```
iex (new-object net.webclient).downloadstring('https://raw.githubusercontent.com/cylin2000/powertask/master/PowerTask.ps1?t='+(Get-Random))
```

## 参考资料
https://blogs.msdn.microsoft.com/timid/2013/07/03/why-use-approved-verbs/  
https://msdn.microsoft.com/en-us/library/windows/desktop/ms714428(v=vs.85).aspx  
https://visualstudiogallery.msdn.microsoft.com/f017b10c-02b4-4d6d-9845-58a06545627f   
https://technet.microsoft.com/en-us/library/hh360993.aspx

【全文完】
---
title: 解决端口占用问题
date: 2021-08-01 17:15:00 +0800
categories: [技术]  
tags: [windows,linux]  
urlname: fix-port-in-use-issue
url: https://www.caiyunlin.com/2021/08/fix-port-in-use-issue/
---

端口被占用是指当你的可执行程序运行时需要在某个端口侦听时，发现该端口被其他程序给占用了，导致该应用程序无法执行。

如: jekyll 默认需要在端口 4000 侦听，当被占用的时候，会显示错误 Permission denied - bind for 127.0.0.1:4000

本地的 `4000` 端口被占用。

## 解决方法

1. 查看端口的占用情况

   ```bash
   # 查看端口占用情况
   netstat -ano
   # 也可以使用 find 过滤
   netstat -ano | find "4000"
   ```

   参数：

   - `-a`：显示所有链接和侦听端口
   - `-n`：以数字形式显示地址和端口号
   - `-o`：显示拥有的与每个连接关联的进程 ID 即 `PID`

2. 查看当前占用端口服务

   ```cmd
   tasklist /svc /FI "PID eq 1172"
   ```

   显示如下，我们知道 端口被 FoxitProtect.exe 福昕阅读器占用了

   ```
   映像名称                       PID 服务
   ========================= ======== ============================================
   FoxitProtect.exe              1172 FxService
   ```

   参数：

   - `/svc`：如果这个进程是一个 `Windows` 服务的话同时显示这个服务的名称
   - `/FI`：使用筛选器对结果进行筛选

3. 对目标服务进行关闭

   ```cmd
   # 停止 FxService 服务程序， 或者使用 services.msc 打开服务管理器,停止或禁用该服务
   net stop FxService
   ```

   

## Linux 下的解决办法

在 Linux 下也可以使用同样方式查询和关闭服务，命令参数有少许区别

1. 根据端口号，查询进程名称和进程ID

```bash
netstat -tunlp | grep 8080
```

输出如下：如果最后一个 PID/Program name 只显示了 - ，没有显示具体的进程，则在 `netstat` 前面加上 `sudo`

```
calvin@yic:~$ sudo netstat -tunlp | grep 8080
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN      9299/nginx: master
tcp6       0      0 :::8080                 :::*                    LISTEN      9299/nginx: master
```

参数说明：

- -t: 显示 TCP 连接

- -u: 显示 UDP 连接

- -n: 显示数字地址

- -l: 列出状态是 LISTEN 的统计信息

- -p: 显示程序的PID和名称

  

2. 停止相关服务

   ```bash
   sudo systemctl stop nginx
   ```

   

【全文完】


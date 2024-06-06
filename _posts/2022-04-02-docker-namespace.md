---
title: Docker 是如何运行的
date: 2022-04-02 10:03:00 +0800
categories: [技术]   
tags: [docker]  
urlname: docker-namespace
url: https://www.caiyunlin.com/2022/04/docker-namespace/
---

之前有篇博客介绍了 docker 的一些常用使用命令，这篇博客来详细研究一下 docker 是如何运行的。

我们可以使用 docker exec 在这个容器(container)内来执行一个进程。  

或者说，在这个容器内，我们是 root，这里的容器是什么呢，在 linux 里面，容器实现的方法就是 namespace . 


## 什么是 namespace

我们查询一下官方文档 https://docs.docker.com/get-started/overview/#the-underlying-technology 里面提到

> Docker is written in the Go programming language and takes advantage of several features of the Linux kernel to deliver its functionality. Docker uses a technology called namespaces to provide the isolated workspace called the container. When you run a container, Docker creates a set of namespaces for that container.

> These namespaces provide a layer of isolation. Each aspect of a container runs in a separate namespace and its access is limited to that namespace.

Docker 使用了一个叫 namespaces 的技术用来提供一个隔离的工作区，叫做 container. 

## 我们来做个试验
宿主机： 用户 calvin 机器名 yic
Docker : 用户 root 机器名 89e9c8fdb4e8


### 查看用户 id
在宿主机上，我们运行 id 会显示当前登录的 id 信息，比如下面
```bash
calvin@yic:~$ id
uid=1000(calvin) gid=1000(calvin) groups=1000(calvin),4(adm),20(dialout),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),108(lxd),114(netdev),999(docker)
calvin@yic:~$
```
在 docker 里面执行 id 会显示如下信息
```bash
# 运行一个 ubuntu docker ，打开共享目录
docker run -v $PWD/shared_data:/opt/shared -it ubuntu /bin/bash

# 查询id，我们会发现用户是 root
root@89e9c8fdb4e8:/# id
uid=0(root) gid=0(root) groups=0(root)
root@89e9c8fdb4e8:/#

```

### 文件测试

在 docker 里创建一个文件，我们发现文件的拥有者是 root
```bash
root@e5343d96c0d6:/# touch file 
root@89e9c8fdb4e8:/# ls -lah file
-rw-r--r-- 1 root root 0 Apr 28 12:02 file
```

我们回到宿主机看文件，你会发现文件的创建者是 calvin，但是如果用户是共享的那么就会是 root，下面用户 namespace 会提到

```bash
calvin@yic:~/shared_data$ ls -lah file
-rw-r--r--  1 calvin   calvin      0 Apr 28 12:05 file
```

### 进程测试

我们在 docker 里面运行 watch 命令，watch 会每隔2秒执行一次需要watch的指令

```bash
root@e5343d96c0d6:/# watch -d "ps ax" 
Every 2.0s: ps ax                                                                 
  PID TTY      STAT   TIME COMMAND
    1 pts/0    Ss     0:00 /bin/bash
   14 pts/0    S+     0:00 watch -d ps ax
  237 pts/0    S+     0:00 watch -d ps ax
  238 pts/0    S+     0:00 sh -c ps ax
  239 pts/0    R+     0:00 ps ax
```

同时我们在宿主机执行 "ps ax | grep watch"，你会发现同样的右 watch -d ps ax 命令，这个其实就说明了 watch 命令也是运行在主机里面的。 
他的 pid 和 docker 里面的 pid 不一样，这个就可以说明 docker container 不是 VM ，他和宿主机是共享了某些东西。  
但是肯定也是有隔离，因为 container 里面是无法感知到宿主机的进程的。 

```bash
calvin@yic:~/shared_data$ ps ax | grep watch
   86 ?        S      0:00 [watchdogd]
24450 pts/0    S+     0:00 watch -d ps ax
24806 pts/0    S+     0:00 grep --color=auto watch
```

我们在宿主机运行 pstree 会看到 watch 的 process 是被 containerd-shim -> bash 启动的
```bash
calvin@yic:~/shared_data$ pstree
systemd─┬─accounts-daemon───2*[{accounts-daemon}]
        ├─2*[agetty]
        ├─apache2───7*[apache2]
        ├─atd
        ├─containerd───11*[{containerd}]
        ├─containerd-shim─┬─bash───watch
        │                 └─12*[{containerd-shim}]
        ├─cron
        ├─dbus-daemon
```
我们查一下 containerd 是什么， 官方文档 https://containerd.io/ 

> containerd is available as a daemon for Linux and Windows. It manages the complete container lifecycle of its host system, from image transfer and storage to container execution and supervision to low-level storage to network attachments and beyond.

再去看一下 containerd 的源码仓库 https://github.com/containerd/containerd
从 Runtime Requirements 段落可以看到

> Runtime requirements for containerd are very minimal. Most interactions with the Linux and Windows container feature sets are handled via runc and/or OS-specific libraries (e.g. hcsshim for Microsoft). The current required version of runc is described in RUNC.md.

它是通过 runc 来完成交互的。

我们再来查一下 runc, 它的仓库位于 https://github.com/opencontainers/runc 
runc 是一个用于生成和运行容易的 cli 工具


我们知道 docker client 是通过 rest api 与 docker 的后台服务，即 dockerd 来交互的， dockerd 后面的 d 就是 daemon 守护进程的意思。 
我们继续查看 docker 的文档 https://docs.docker.com/engine/reference/commandline/dockerd/#docker-runtime-execution-options

> The Docker daemon relies on a OCI compliant runtime (invoked via the containerd daemon) as its interface to the Linux kernel namespaces, cgroups, and SELinux.

By default, the Docker daemon automatically starts containerd. If you want to control containerd startup, manually start containerd and pass the path to the containerd socket using the --containerd flag. 

我们知道 docker client 调用了 dockerd,  dockerd 调用了 containerd, containerd 调用了 runc 


### 如何改变了Docker里的进程id

这部分有点跳跃，直接说答案，是 unshare，文档链接：https://www.man7.org/linux/man-pages/man1/unshare.1.html

unshare 命令创建了一个新的 namespaces ， 然后执行需要的程序，如果没有指定程序，则 执行 ${SHELL} 默认为 /bin/bash
我们查看文档中的 CLONE_NEWPID 参数， 他的意思是取消共享进程ID的namespace，一边调用进程(calling process)有一个新的PID为子进程，其子进程的 namespace 不与任何先前存在的进程共享。 
调用进程不会进入到新的 namespace ，调用进程创建的第一个子进程的ID为1，并将认为其在新的 namespace 中的身份为 init(1)
namespace 里的进程再创建新的pid 为2 ，而且映射到最外成的id则是host里面的pid。


我们再回到 watch 进程，在宿主机中查看他的 namespace，我们可以看到数字标识的不同的 namespace , 这个 namespace 和宿主机，比如 $$ shell进程的 namespace 有些是不一样的，有些则是一样的，比如 cgroup, user 等。 用户可以通过参数指定选择那些是共享的，哪些是不共享的，用此方式达到资源的隔离。
```bash
calvin@yic:~/shared_data$ ps ax | grep watch
   86 ?        S      0:00 [watchdogd]
 3415 pts/0    S+     0:00 grep --color=auto watch
26924 pts/0    S+     0:00 watch -d ps ax

calvin@yic:~/shared_data$ sudo ls -lah /proc/26924/ns
total 0
dr-x--x--x 2 root root 0 Apr 28 12:37 .
dr-xr-xr-x 9 root root 0 Apr 28 12:20 ..
lrwxrwxrwx 1 root root 0 Apr 28 12:37 cgroup -> 'cgroup:[4026531835]'
lrwxrwxrwx 1 root root 0 Apr 28 12:37 ipc -> 'ipc:[4026532175]'
lrwxrwxrwx 1 root root 0 Apr 28 12:37 mnt -> 'mnt:[4026532173]'
lrwxrwxrwx 1 root root 0 Apr 28 12:37 net -> 'net:[4026532178]'
lrwxrwxrwx 1 root root 0 Apr 28 12:37 pid -> 'pid:[4026532176]'
lrwxrwxrwx 1 root root 0 Apr 28 12:48 pid_for_children -> 'pid:[4026532176]'
lrwxrwxrwx 1 root root 0 Apr 28 12:37 user -> 'user:[4026531837]'
lrwxrwxrwx 1 root root 0 Apr 28 12:37 uts -> 'uts:[4026532174]'

calvin@yic:~/shared_data$ sudo ls -lah /proc/$$/ns
total 0
dr-x--x--x 2 calvin calvin 0 Apr 28 12:19 .
dr-xr-xr-x 9 calvin calvin 0 Apr 28 12:09 ..
lrwxrwxrwx 1 calvin calvin 0 Apr 28 12:19 cgroup -> 'cgroup:[4026531835]'
lrwxrwxrwx 1 calvin calvin 0 Apr 28 12:19 ipc -> 'ipc:[4026531839]'
lrwxrwxrwx 1 calvin calvin 0 Apr 28 12:19 mnt -> 'mnt:[4026531840]'
lrwxrwxrwx 1 calvin calvin 0 Apr 28 12:19 net -> 'net:[4026531992]'
lrwxrwxrwx 1 calvin calvin 0 Apr 28 12:19 pid -> 'pid:[4026531836]'
lrwxrwxrwx 1 calvin calvin 0 Apr 28 12:53 pid_for_children -> 'pid:[4026531836]'
lrwxrwxrwx 1 calvin calvin 0 Apr 28 12:19 user -> 'user:[4026531837]'
lrwxrwxrwx 1 calvin calvin 0 Apr 28 12:19 uts -> 'uts:[4026531838]'
```


### 关于unshare的快速测试

我们写一段c代码，用来获取当前的id，如下
```c
#include <sys/types.h>
#include <unistd.h>
#include <stdio.h>

int main(void){
    printf("pid:%d\n",getpid());
    return 0;
}
```

编译一下输出可执行文件
```bash
calvin@yic:~$ gcc -o getpid ./getpid.c
calvin@yic:~$ chmod u+x ./getpid
```

使用 unshare 命令或 unshare()系统调用来创建一个新的 namespace，其中也包括 pid namespace（内核版本至少需要是3.8）
需要注意的一个小点是，默认情况下，unshare 创建的 pid namespace 是作用在被调程序的子进程上，如下所示：
```bash
calvin@yic:~$ sudo unshare -p ./getpid
pid:11246
````

使用 --fork 表示创建一个子进程，并在子进程中运行命令。从下面的示例可以看到，新的 pid namespace 在子进程上生效了，第一个子进程的 pid 为 1，即该 pid namespace 中的 init 进程。

```bash
calvin@yic:~$ sudo unshare -p --fork ./getpid
pid:1
````

### 总结一下

Docker Client --> dockerd --> containerd --> runC --> unshare syscall(namespace 隔离)

### 参考文档
- https://docs.docker.com/get-started/overview/#the-underlying-technology
- https://containerd.io/ 
- https://github.com/containerd/containerd
- https://github.com/opencontainers/runc 
- https://www.man7.org/linux/man-pages/man1/unshare.1.html

【全文完】
---
title: Bash 踩坑指南
date: 2020-04-07 17:44:00 +0800
categories: [技术]  
tags: [bash,shell]  
urlname: bash-experience  
url: http://www.caiyunlin.com/2020/04/bash-experience/
---

> 最近项目逐步迁移到AWS平台上，相关的代码管理和自动化部署也由TFS迁移到GitHub+Jenkins方案上，为此写了不少的bash脚本用来自动化部署和测试，也踩了相当多的坑，在此总结一下。

## Shell的种类
和Windows平台不一样，在Linux系统下，有多种Shell，所以同样的脚本，不同的解释器执行结果可能是不一样的，下面列举了常见的Shell种类。

- sh : sh 的全称是 Bourne shell，由 AT&T 公司的 Steve Bourne开发，为了纪念他，就用他的名字命名了，是第一个流行的shell
- bash : Bourne-Again SHell
- dash ： theDebian Almquist Shell， Ubuntu的/bin/sh默认链接到dash
- csh, tcsh, zsh, oh-my-zsh
- busybox : 小巧的工具套件，1M大小，集成了上百个内置命令

其中Bash是使用比较广泛的一种，大部分Linux系统的默认登陆Shell就是Bash，市面上大部分脚本也是Bash脚本。

如何查看当前系统支持的shell呢，执行`cat /etc/shells`

```bash
$ cat /etc/shells
# /etc/shells: valid login shells
/bin/sh
/bin/bash
/bin/rbash
/bin/dash
```

下面几种方法可以查询当前使用的Shell相关信息

1. `ps -p $$` – 查询你当前正在使用的Shell
1. `echo "$SHELL"` – 查询当前用户的默认Shell，但是不一定是你正在使用的Shell，比如你默认的shell是/bin/bash，但是你切换到了dash模式下，用这个命令查看，他的返回还是 /bin/bash
1. `echo $0` – 另一个比较可靠的方法查询当前的Shell，你现在使用的是什么Shell就返回什么
1. `ls -al /bin/sh` - 检查默认 sh 的解释器是哪个。 比如 sh 指向的是 dash, 那使用 sh xxx.sh 就相当于 dash xxx.sh

在Jenkins里面，常常使用Docker构建一个Shell执行环境，所以根据你使用的Docker镜像不同，默认使用的Shell也不同，你可以使用上面的命令去测试当前的SHELL种类。

Shell不同，对命令的支持力度也不同，这里列举几个简单的Bash和Dash区别。
1. Bash 支持 `function` 关键字 , Dash 不支持
2. Bash 支持快速大小写转换, Dash 不支持
```bash
str="hello"
str2="WORLD"
echo ${str^^}
echo ${str2,,}
```
3. Bash 支持 `<<<` 重定向, Dash 不支持

## Shell的交互方式
- login shell 
login shell 是你登陆到系统里是的默认shell，不管是通过终端或者通过SSH来连接，login shell会默认加载下面的文件，如果文件存在的话 `.profile`,`.bash_profile`,`.bash_login`

- interactive shell 
interactive shell 是当你在shell里面了，你输入了另外一个shell的名字，比如 `bash` 或者 `dash`, 你就进入了交互式shell环境，此时也会加载默认配置，比如 bash shell 会自动 `.bashrc` 所以，你可以把相关预定义配置放到这个文件里面，下面的命令可以测试已经开启的shell,使用exit可以退出交互式Shell
```bash
bash
ps
dash
ps
```

- non-interactive shell 
non-interactive shell 是一个用户无法交互的Shell，一般都是用来执行自动化脚本. 
Jeknins 就是在使用 non-interactive shell.

比如Ubuntu系统，当你登录了系统是，默认的登陆Shell是`bash`, 但是当你在Jenkins使用Ubuntu作为Docker镜像时，默认的Shell是 non-interactive shell, 他指向的是 `dash`, 如果我们使用的是基于 alpine 的linux，那么默认的 non-interactive shell 可能是 `busybox`


## Shell的执行类型
- fork
`fork` 模式会复制当前进程信息并且创建一个副本进程，把副本进程作为当前进程的Child.
用下面的内容创建文件 `fork-test.sh` 来测试一下fork

```bash
echo "fork-test.sh start"
ps
echo "fork-test.sh end"
```
用下面文件调用 `fork-test.sh`, 执行之前可以先调用 `ps` 查看当前进程，然后执行后再观察当前进程，你会发现 fork-test会创建新的bash进程，然后执行完毕之后，又自动销毁掉。 进程中产生的环境变量等信息会一起销毁掉。
```bash
ps
chmod 777 ./fork-test.sh
./fork-test.sh && ps
# or 
bash fork-test.sh && ps
```

- source

`source` 会在当前进程中直接执行脚本，不会创建新的子进程。
使用下面的脚本测试，然后观察进程，你会发现没有新的进程产生，然后注意使用source不需要为脚本文件指定执行权限。
```bash
source fork-test.sh && ps
# or
. fork-test.sh && ps
```

- exec

`exec` 和 `source`是一样的，不会产生新的子进程，但是它有个不一样的是，他执行被调用的脚本之后，会退出之前的脚本环境，所以当被调用脚本执行完毕退出之后，你会发现当前的shell也退出了。这个使用场景比较少，一半不经常使用。
```bash
ps
exec ./fork-test.sh 
```



## 环境变量
加入我们在Jenkins里面定义了一个环境变量, 比如 `DEPLOY_ENV=SB`, 在Bash中如何使用呢？

1. 不管是 `fork` 还是 `source` 来调用脚本，都可以直接使用上层定义的环境变量, 但是使用 `fork`的话，你没有办法修改变量并且将它返回到调用的地方。 用下面的脚本可以测试

```bash
export DEPLOY_ENV="SB"

# create env-test-sb.sh with following lines
echo "DEPLOY_ENV is $DEPLOY_ENV"

# create env-test-dev.sh with following lines
echo "UPDATE DEPLOY_ENV to DEV"
export DEPLOY_ENV="DEV"
echo "DEPLOY_ENV is $DEPLOY_ENV"

bash env-test-sb.sh
bash env-test-dev.sh
echo "DEPLOY_ENV is $DEPLOY_ENV"
```

2. 如果我们期望能改变环境变量，那必须要使用 `source` 

```bash
. env-test-dev.sh
echo "DEPLOY_ENV is $DEPLOY_ENV"
```

## 在Jenkins中如何用好Bash
1. 在每一个sh脚本上面写上 `#!/bin/bash`， 这样脚本默认使用bash来解释执行
2. 在Jenkins的sh代码块中，显示的使用bash命令来调用脚本，比如

```groovy
    sh '''
        echo 'Executing Deploy in SandBox'
        bash ./deploy.sh
        rc=$?; if [[ $rc != 0 ]]; then exit 1; else echo "deploy completed"; fi
    '''	
```
因为bash会自动fork一个新的进程去执行实际脚本，所以最后必须拦截处理脚本的返回信息，这样有错误可以再提交到Jenkins中显示出来。

3. 在 deploy.sh 脚本中，再次调用其他脚本时，可以使用 source 方式，这样可以共享处理环境变量。

## 注意空格写法

```bash
# 赋值正确写法
a=1
# 错误写法
a = 1 
# if 和条件语句块之间必须要有空格,[] 里面两端也必须要有空格
a=10
b=20
if [ ${a} -eq ${b} ]
then
  echo "相等"
else
  echo "不等"
fi
```

## 快速检查变量
```bash
[ -n "${AWS_ACCESS_KEY_ID}" ] || { echo "AWS_ACCESS_KEY_ID environment variable not defined"; exit 1; }

[ $AWS_STAGE_NAME != 'none' ] || { echo "exit because aws stage name is none"; exit 1; }

# 数值比较用下面表达式
-eq -ne -gt -lt -ge -le
# 字符串比较用下面表达式  
= != -z -n
```

## 使用函数

```bash
# create hello.sh

#! /bin/bash
function sayhello()
{
  echo "Hello,World"
  return 1
}

. hello.sh
sayhello
result=$?
echo $result

# 函数只能返回 0 到 255 的数值，所以如果想返回字符串的话，需要使用点小技巧绕一下。
# 我们可以使用 echo 字符串的方式，输出字符串，然后调用的地方使用`$()`包裹得到需要的信息。
function now()
{
    str=$(date "+%Y-%m-%d %H:%M:%S")
    echo $str
}
# Invoke function
n=$(now)
echo $n
```

我们也可以使用 `$()` 去调用其他脚本，比如 `$(node xxx.js)` 或者 `$(python xxx.py)` ， 这样可以使用其他的脚本去实现更强的功能，然后返回结果到bash中去。

【全文完】
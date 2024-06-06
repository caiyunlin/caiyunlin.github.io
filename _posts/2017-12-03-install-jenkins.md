---
title: 搭建本地的 Jenkins 持续集成系统  
date: 2017-12-03 13:50:20  
categories : [技术]  
tags: [jenkins]  
urlname: install-jenkins  
url: http://www.caiyunlin.com/2017/12/install-jenkins/  
---
这篇文章简要介绍如何在本地搭建一套Jenkins持续集成系统。

基本实现是这样的
1. 在虚拟机中安装一套Ubuntu系统
2. 在Ubuntu中，安装Jenkins 和 Docker
3. 在Jenkins中配置Job，从GitHub获取代码，并且自动Docker实例，运行测试，编译和部署，之后销毁Docker实例

## 基础环境

该系统选择的基础环境是 Ubuntu 操作系统，所以务必先准备好Ubuntu，推荐版本是16.04，这个不是最新的版本，但是是长期支持的稳定版本。

本地虚拟机可以到官网下载 Ubuntu 16.04 Server 版本镜像。

http://releases.ubuntu.com/16.04/ubuntu-16.04.6-server-amd64.iso

注意：安装Ubuntu的时候，请选择安装组件 LAMP 和 SSH Server


## 安装 Jenkins

Ubuntu准备好了后，我们就可以直接登录系统，开始安装Jenkins了
参考官方WIKI：https://wiki.jenkins.io/display/JENKINS/Installing+Jenkins+on+Ubuntu

执行下面脚本

```bash
# 添加Jenkins的Global Key到APT中
wget -q -O - https://jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add - 

# 更新APT库，安装Jenkins
sudo sh -c 'echo deb http://pkg.jenkins-ci.org/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'  
sudo apt-get update  
sudo apt-get install jenkins  
```

## 启动 Jenkins

```bash
sudo service jenkins start  

# 停止
sudo service jenkins stop

# 相关路径
# 访问路径：http://localhost:8080  
# 安装路径：/var/lib/jenkins  
# 日志路径：/var/log/jenkins  
```

## 配置 Jenkins

- 在浏览器访问Jenkins地址，注意使用正确的ip地址，可以使用ifconfig查出地址， 如 http://192.168.0.101:8080
- 在登录页面会需要你输入admin的password，使用下面命令获的密码，输入密码

```bash
cat /var/jenkins_home/secrets/initialAdminPassword
```
- 点击继续，在选择插件界面，选择 Install suggested Plugins
- 插件安装完毕之后，配置登录的管理员 用户名和密码
- 配置完成

## 安装 Docker
我们期望 Jenins 的Deployment Pipeline 运行在Docker里面，所以需要安装一下 Docker

```bash
# 清理旧版 docker
sudo apt-get remove docker docker-engine docker.io

# 更新 APT-GET 库准备安装 一些前置软件
sudo apt-get update

# 安装HTTPS传输,CURL等软件
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common

# 添加 Docker’s official GPG key:

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88

# Set Docker 安装库

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

# 安装Docker

sudo apt-get update
sudo apt-get install docker-ce

```

## 运行 Docker

```bash
sudo docker run hello-world

sudo docker build -f dockerfile-receiver

sudo docker run -p 9080:80 nginx

sudo docker run -it 9080:80 nginx
```

## 设置 Jenkins 运行 Docker的权限

```bash
# 如果还没有 docker group 就添加一个：
sudo groupadd docker

# 将当前用户和jenkins用户加入该 group 内。然后退出并重新登录就生效啦。
sudo gpasswd -a ${USER} docker
sudo gpasswd -a jenkins docker

# 重启 docker 服务
sudo service docker restart

# 切换当前会话到新 group
newgrp docker

# 重启 jenkins 服务
sudo service jenkins restart  
```

至此 Jenkins 环境就搭建好了

# 配置 Jenkins Pipeline

下面尝试配置一个Jenkins的Pipeline，测试一下部署流程，基本模拟步骤如下：

1. 创建一个Jenkins Pipeline
2. Pipeline中使用远程代码库中的Jenkinsfile在指定部署内容
3. 编写提交Jenkinsfile

## 准备代码库
1. 去GitHub上面创建一个测试代码库，如jenkins-test,可以参考 https://github.com/cylin2000/jenkins-test
1. 代码库里面创建 Jenkinsfile 文件，内容是json格式的定义，如下:

```groovy
pipeline {
    agent { 
    	docker {
    		image  'node:6.3'
    		args '-v $HOME/.n63:/root/.n63 -u root:root'
    	} 
    } 
    stages {
        stage('Example Build') {
            steps {
                sh 'npm --version'
            }
        }
    }
}
```

这个Job很简单，定义了使用docker的node 6.3版本的image 作为 build 的容器，build开始的时候，执行 npm --version 就可以显示npm的版本，注意运行Jenkins的主机不需要安装nodejs的

    注意 args 中的 -u root:root 一定要有，否则会出现 steps 里面的命令，如 npm install 之类的命令没有权限运行


3. 代码提交之后，就回到Jenkins界面，选择"New Item"，填入名称 如 "HelloPipeline" 选择 "Pipeline"，点击"OK"
![image](https://images.caiyunlin.com/20171204020949.png)

1. 在Pipeline配置界面里，"Definition"选择"Pipeline script from SCM","SCM"选择 "Git", 然后填入你的Repository地址，最后点击下面的 "Save" 按钮
![image](https://images.caiyunlin.com/20171204021321.png)

【全文完】
---
title: 在 Ubuntu 上安装 Nginx 并支持 PHP
date: 2021-05-05 13:45:00 +0800
categories: [技术]  
tags: [bash,ubuntu,nginx]  
urlname: install-php-for-nginx-on-ubuntu 
url: http://www.caiyunlin.com/2021/05/install-php-for-nginx-on-ubuntu/
---

> 最近整理了一下博客系统，迁移到了Jekyll模板，发现Apache2服务器不支持中文路径，研究了一番没有找到解决方法，测试了nginx可以默认支持中文路径，遂整理一下，把 Apache2 换成了 Nginx

本文所述的步骤在 Ubuntu 18.04 上测试通过。

## 安装 Nginx
使用 apt-get 安装 nginx
```bash
# 更新 APT 源
sudo apt-get update
# 安装 nginx
sudo apt-get install nginx
```

安装完成后测试一下 nginx 的版本，查看是否安装成功
```bash
nginx -v
```

启动 nginx
```bash
service nginx start
```

服务自动后，输入服务器所在的IP地址，应该可以看到nginx的欢迎界面 "Welcome to nginx!"

## 安装 PHP

不像 Apache2, Nginx 没有包含自带的PHP处理引擎。 所以需要安装一个 PHP-FPM (FastCGI Porcess Manager) 来支持 PHP 的执行。 FPM 是一个 PHP FastCGI 的实现，可以非常好的支持大并发的php站点。


第一步你需要添加 Ubuntu 的 universe repository ，这样保证可以获取到最新的 php-fpm 包

```bash
sudo add-apt-repository universe
```

接下来更新软件包，然后安装 php-fpm, 后续还会安装 php-mysql ， 这样 php 可以访问 MySQL 数据库，输入命令后按 Y 和回车继续。

```bash
sudo apt update && sudo apt install php-fpm
# 如果需要使用 MYSQL，执行下面脚本安装 php-mysql
sudo apt install php-mysql
```

安装完成之后，检查 php 的版本
```bash
php --version

# 如果安装成功，应该可以看到下面类似的消息
PHP 7.2.24-0ubuntu0.18.04.7 (cli) (built: Oct  7 2020 15:24:25) ( NTS )
Copyright (c) 1997-2018 The PHP Group
Zend Engine v3.2.0, Copyright (c) 1998-2018 Zend Technologies
    with Zend OPcache v7.2.24-0ubuntu0.18.04.7, Copyright (c) 1999-2018, by Zend Technologies
```

上面列出的 PHP 版本是 7.2, 这个版本可以根据你的 repository 的包有略微不同。 
根据你安装的 Nginx 和 PHP 版本，你需要手动配置一下 PHP Socket 的路径，这样 Nginx 可以连接上它。

下面列出 /var/run/php 的内容
```bash
ls /var/run/php 
php7.2-fpm.pid  php7.2-fpm.sock
```
这里我们可以看到 php7.2-fpm.sock 接下来会用到它。

## 配置 Nginx 的多站点
如果你希望 Nginx 支持多个站点，可以 复制 `/etc/nginx/sites-available/default` ，如 example.com
```bash
cd /etc/nginx/sites-available
cp default example.com.conf
cp default example2.com.conf
```

打开对应的 example.com.conf 文件，修改其中的 server_name 和 root 指定到对应的目录，如下
注意删掉 listen 后面的 default_server 因为默认只能有一个 default_server, 在 default 文件中已经定义了

```bash
  listen 80;
  listen [::]:80 ;

  # .....

  root /var/www/example.com;

  # Add index.php to the list if you are using PHP
  index index.html index.htm index.nginx-debian.html;

  server_name example.com;

  location / {
          # First attempt to serve request as file, then
          # as directory, then fall back to displaying a 404.
          try_files $uri $uri/ =404;
  }
```

修改完成后，激活该站点

```bash
cd /etc/nginx/sites-enabled
sudo ln -s /etc/nginx/sites-available/example.com.conf example.com.conf
sudo ln -s /etc/nginx/sites-available/example2.com.conf example2.com.conf
```

## 配置 Nginx 的 PHP 扩展

我们现在配置一下 Nginx 的 server 定义，默认 server 定义的路径在 `/etc/nginx/sites-available/default` 当然根据的你安装定义，路径可能在其他自定义的地方。
如果你的 Nginx 是支持多个域名的，你的配置文件可能是 `/etc/nginx/sites-available/example.com`

使用 nano 工具，编辑文件

```bash
sudo nano /etc/nginx/sites-available/default
```

添加默认文件，支持 index.php

在 nano 里面，按下 ctrl+w 搜索 index.html，如下所示，在 index.html 前面或者后面，添加 index.php
```bash
index index.php index.html index.htm index.nginx-debian.html;
```

配置 Server Name，如果需要，将你的自定义域名写到 server_name 后面
```bash
server_name YOUR_DOMAIN_OR_IP_HERE;
```

配置 PHP Socket
按下 CTRL + W 搜索 location ~ \.php 那一行
你可以去掉注释符号 `#`, 注意 fastcgi_pass 指向到我们上一步查到 php7.2-fpm.sock 的路径

```bash
location ~ \.php$ {
                include snippets/fastcgi-php.conf;
        #
        #       # With php-fpm (or other unix sockets):
                fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
        #       # With php-cgi (or other tcp sockets):
        #       fastcgi_pass 127.0.0.1:9000;
        }
```
这里注意，如果是php需要支持pathinfo的，则去掉后面的 $ ，如 `location ~ .php`，在 snippets/fastcgi-php.conf 中，对 PATH_INFO 做了处理，不需要再引入其他代码。

注意不要忘掉删掉花括号 } 前面的 # 注释符

## 保存和测试 Nginx 配置
所有修改完毕之后，按下 Ctrl + X ，然后输入 y 和 回车保存内容。
执行下面的语句，保证配置修改正确了
```bash
sudo nginx -t
```

输入应该如下：
```bash
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

如果没有问题，执行下面语句重启 nginx
```bash
sudo service nginx reload
```

## 测试 PHP

要想知道 PHP 是否正常工作，在 nginx web 根目录创建一个 PHP 文件，如 info.php, 默认的web目录应该是 `/var/www/html`, 如果你的服务器配置了多站点，路径可能是 `/var/www/example.com/html` ， 知道的 web 根目录，后使用 nano 创建 info.php 文件

```bash
sudo nano /var/www/html/info.php
```

输入以下内容

```php
<?php
phpinfo();
```
按下 Ctrl + X ，然后输入 y 和 回车保存内容。

访问你的服务器地址或者域名，如 http://example.com/info.php 如果看到正常的 php 输出，则表示PHP配置安装成功了。

## 安装 phpmyadmin
```bash
sudo apt install phpmyadmin

# 链接本地 phpmyadmin 到 phpmyadmin 的 安装目录
sudo ln -s phpmyadmin /usr/share/phpmyadmin

# 如果 nginx 访问 phpmyadmin 的图片等静态资源有 Access Denied 的问题，也可以直接拷贝文件夹到 web 当前目录下
cp /usr/share/phpmyadmin phpmyadmin -r
```


【全文完】
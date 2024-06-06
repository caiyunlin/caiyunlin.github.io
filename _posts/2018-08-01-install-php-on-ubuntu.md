---
title: 在 Ubuntu 上安装配置 PHP 环境  
date: 2018-08-01 09:00:00  
categories : [技术]  
tags: [ubuntu,php]  
urlname: ubuntu-install-php-env  
url: https://www.caiyunlin.com/2018/04/export-excel/  
---

原有的服务器快到期了，趁活动搞了个阿里云的Ubuntu主机，所以将一些测试的php代码移到这台主机下，下面记录一下在阿里云的Ubuntu上安装php环境的步骤。

## 系统概况
- OS : Ubuntu 18.04
- Web服务器 : Apache2
- PHP : PHP 7.0 +
- 数据库 : Mysql 5.6 +

## 安装 Apache2 & PHP

```bash
# 更新apt-get安装源
sudo apt-get update 
# 安装Apache2
sudo apt-get install apache2 
# 安装php7.0
sudo apt-get install php7.0 
# 查看安装的php版本，命令行指定的是7.0，系统可能是安装7.0或以上某个稳定版本，如 7.2
php -v 
# 查看apache支持php的扩展
apt-cache search libapache2-mod-php 
# 选择安装一个php扩展，这里是 libapache2-mod-php7.2
sudo apt-get install libapache2-mod-php7.2 
```

## 配置PHP

- 切换到web根目录，创建 phpinfo.php

```bash
cd /var/www/html
sudo vim phpinfo.php 
```

- 输入以下内容，保存退出

```php
<?php
    phpinfo();
?>
```

- 在浏览器访问 https://ipaddress/phpinfo.php 查看 `php.ini` 所在的路径 如：`/etc/php/7.2/apache2/php.ini`

- 修改 php.ini ，找到下面两行，去掉前面的`分号`开启对应扩展

```bash
extension=mbstring
extension=pdo_mysql
```

- 重启Apache2

```bash
sudo /etc/init.d/apache2 restart 
```

## 安装MYSQL

```bash
# 安装mysql服务
sudo apt-get install mysql-server 
# 检查mysql的版本
mysql -V 
```

## 设置MYSQL密码
安装mysql的时候，可能没有让用户输入root的密码，通过下面方式重置

- 进入到etc/mysql 目录下，查看debian.cnf文件

```bash
sudo vim /etc/mysql/debian.cnf
```

- 找到用户名，密码 ，使用此账号登录mysql，示例如下

```bash
# 用户名：debian-sys-maint
# 密码：xedvSNKdLavjuEWV
sudo mysql -udebian-sys-maint -pxedvSNKdLavjuEWV
```

- 修改root用户的的密码

```sql
-- mysql 8.0 之前版本执行下面语句
-- 这里是关键点，由于mysql5.7没有password字段，密码存储在authentication_string字段中，password()方法还能用
-- 在mysql中执行下面语句修改密码，注意先把`新密码`改成你自己的密码
mysql> show databases;
mysql> use mysql;
mysql> update user set authentication_string=PASSWORD("新密码") where user='root';
mysql> update user set plugin="mysql_native_password";
mysql> flush privileges;
mysql> quit;

-- 如果是8.0之后的mysql版本，用下面语句修改密码
mysql> show databases;
mysql> use mysql;
mysql> ALTER USER '用户名'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';
mysql> flush privileges;   --刷新MySQL的系统权限相关表
mysql> exit;

```

- 修改完密码，需要重启mysql

```bash
sudo /etc/init.d/mysql restart;
```

- 再次登录

```bash
mysql -uroot -p密码
```

## 安装phpmyadmin

- 安装phpmyadmin并链接到web目录

```bash
cd /var/www/html
#安装phpmyadmin
sudo apt-get install phpmyadmin 
#将安装路径的phpmyadmin和web目录链接起来
sudo ln -s /usr/share/phpmyadmin phpmyadmin 
```

- 因为PHP7.2对类型检查更严格，默认安装的phpmyadmin有些bug需要修改一下，否则会经常在界面抛出warning

```bash
# 修正点击表格之后的 count Parameter warning的错误
sudo vim /usr/share/phpmyadmin/libraries/sql.lib.php 
# 将 (count($analyzed_sql_results['select_expr'] == 1) 改为，注意括号位置
#    (count($analyzed_sql_results['select_expr']) == 1

sudo vim /usr/share/phpmyadmin/libraries/display_import.lib.php 
```

- 增加PHPMYADMIN的SESSION超时时间
PHPMYADMIN的SESSION超时时间默认是1440秒，即24分钟，不方便调试，下面将超时时间改大

```bash
# 增加phpmyadmin的超时时间
sudo vim /usr/share/phpmyadmin/libraries/config.default.php 
# 修改 $cfg['LoginCookieValidity'] = 1440;
# 将1440修改成更大的值即可。 如 86400 是24小时

# 同步修改php.ini session时间
sudo vim /etc/php/7.2/apache2/php.ini
session.gc_maxlifetime = 86400
```

- 重启Apache2使配置生效

```bash
sudo /etc/init.d/apache2 restart 
```

## MYSQL 执行错误排查

1. 数据库错误发生  General error: 1267 Illegal mix of collations (utf8mb4_general_ci,IMPLICIT) and (utf8mb4_0900_ai_ci....

出现改错误是因为 MySQL 默认的 collations 和 表格对应的 collations 不一致导致的，需要将默认的设置为 utf8mb4_general_ci，步骤如下

```bash
# 登录 mysql
sudo mysql -uUSERNAME -pPASSWORD
mysql> show variables where Variable_name like 'collation%';
# 系统会显示类似如下界面，其中 Value 根据你原始设置可能略有不同
+----------------------+--------------------+
| Variable_name        | Value              |
+----------------------+--------------------+
| collation_connection | utf8mb4_0900_ai_ci |
| collation_database   | utf8mb4_0900_ai_ci |
| collation_server     | utf8mb4_0900_ai_ci |
+----------------------+--------------------+
# 执行下面脚本
mysql> set collation_connection=utf8mb4_general_ci;
#Query OK, 0 rows affected (0.00 sec)
mysql> set collation_database=utf8mb4_general_ci;
#Query OK, 0 rows affected, 1 warning (0.00 sec)
mysql> set collation_server=utf8mb4_general_ci;
#Query OK, 0 rows affected (0.00 sec)
# 再次查询验证结果
mysql>  show variables where Variable_name like 'collation%';
+----------------------+--------------------+
| Variable_name        | Value              |
+----------------------+--------------------+
| collation_connection | utf8mb4_general_ci |
| collation_database   | utf8mb4_general_ci |
| collation_server     | utf8mb4_general_ci |
+----------------------+--------------------+
```
这时已经默认的 collation 也设置为 utf8mb4_general_ci 了，如果phpmyadmin查询表格和字段也被设置其他的 collation ，可以使用下面语句生成批量脚本来替换
```sql
# 注意此处 原始 collation 是 utf8mb4_0900_ai_ci 目标是 utf8mb4_general_ci
# 需要操作的数据库为 【数据库名】，修改语句执行后，复制 修正SQL 那一列的记过再次去mysql执行即可

SELECT TABLE_SCHEMA '数据库',TABLE_NAME '表',COLUMN_NAME '字段',CHARACTER_SET_NAME '原字符集',COLLATION_NAME '原排序规则',CONCAT('ALTER TABLE ', TABLE_SCHEMA,'.',TABLE_NAME, ' MODIFY COLUMN ',COLUMN_NAME,' ',COLUMN_TYPE,' CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;') '修正SQL' FROM information_schema.`COLUMNS` WHERE COLLATION_NAME RLIKE 'utf8mb4_0900_ai_ci' and TABLE_SCHEMA = '【数据库名】'

```
注意在phpmyadmin，勾选完整内容，才会显示完整的sql语句
![image](https://images.caiyunlin.com/20210626074750.png)


## 迁移域名 
此步骤可选，如果你直接用ip地址访问，就不需要配置这一步。
以域名 www.example.com 为例，现将域名A记录解析到主机的ip地址，此时访问会显示默认网站。
这里配置到专门的目录，注意替换下面 www.example.com 为你的实际域名。

```bash
# 进入 /var/www, 创建 www.example.com 目录
mkdir /var/www/www.example.com
echo "hello world!" > /var/www/www.example.com/index.html
# 进入 /etc/apache2/sites-available 目录
cd /etc/apache2/sites-available/
# 拷贝默认的定义文件作为模板
sudo cp 000-default.conf www.example.com.conf
sudo nano www.example.com.conf  # 修改www.example.com.conf添加如下内容
    ServerName www.example.com
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/www.example.com/
# 进入 /etc/apache2/sites-enabled 目录，创建链接
sudo ln -s /etc/apache2/sites-available/www.example.com.conf www.example.com.conf

# 重启Apache2
sudo /etc/init.d/apache2 restart
```

后续域名解析到本机ip地址，并且将文件上传到 /var/www/www.example.com/ 目录即可 

【全文完】
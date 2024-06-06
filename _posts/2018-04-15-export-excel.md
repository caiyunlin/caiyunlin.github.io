---
title: 一个简便的 Excel 导出方案
date: 2018-04-15 09:16:45
categories : [技术]
tags: [javascript,excel,php]
urlname: export-excel
url: http://www.caiyunlin.com/2018/04/export-excel/
---

导出Excel是开发中遇到的一个常见需求，但是不同的后端服务程序可能需要引入不同的类库，比如PHP需要PHPExcel，C#需要Office组件或者其他第三方Excel解析类。 对于简单的表格数据导出，这里提供另外一个思路，可以不需要引入第三方类库来解决Excel的导出问题。
## 数据展示

导出Excel文件之前，一般我们会展示数据，通常是使用表格,示例如下：

姓名|	手机|	性别|	年龄|	邮箱
---|---|---|---|---|---
张三|	13344445555|	男|	25|	zhangsan@163.com
李四|	13366665555|	男|	26|	lisi@163.com

这种表格一般都是使用 table 标签生成，其实Excel本身也是可以解析这种标签格式的，所以我们将如下表格对应的HTML代码保存到本地文件，并且将扩展名改成 xls，然后用Excel打开即可正常解析。


```html
<table>
    <thead>
        <tr>
            <th width="20%">姓名</th>
            <th width="20%">手机</th>
            <th width="20%">性别</th>
            <th width="20%">年龄</th>
            <th width="20%">邮箱</th>
        </tr>
    </thead>
    <tbody>
            <tr>
                <td>张三</td>
                <td>13344445555</td>
                <td>男</td>
                <td>25</td>
                <td>zhangsan@163.com</td>
            </tr>
            <tr>
                <td>李四</td>
                <td>13366665555</td>
                <td>男</td>
                <td>26</td>
                <td>lisi@163.com</td>
            </tr>
    </tbody>
</table>
```

## 封装导出功能

既然Excel有解析HTML table的功能，我们就可以把数据直接导出html格式，下面用php代码示例一下导出步骤

1. 在导出的处理程序里设置对应excel的header
这样用户访问到这个页面是，会弹出XLS的文件下载框，其中ExportAll为文件名,可以替换成自己需要的文件名

```php
header('pragma:public');
header('Content-type:application/vnd.ms-excel;charset=utf-8;name="ExportAll.xls"');
header("Content-Disposition:attachment;filename=ExportAll.xls");
```

2. 页面模板输出如下格式

```html
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<table>
    <thead>
        <tr>
            <th width="20%">姓名</th>
            <th width="20%">手机</th>
            <th width="20%">性别</th>
            <th width="20%">年龄</th>
            <th width="20%">邮箱</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>张三</td>
            <td>13344445555</td>
            <td>男</td>
            <td>25</td>
            <td>zhangsan@163.com</td>
        </tr>
        <tr>
            <td>李四</td>
            <td>13366665555</td>
            <td>男</td>
            <td>26</td>
            <td>lisi@163.com</td>
        </tr>
    </tbody>
</table>
</body>
</html>
```

## 小结
本文的思路是利用Excel本身强大的兼容解析功能,将解析放在Excel客户端，而不是在服务器生成复杂的xls格式的数据。 对简单的Excel导出需求，这样可以简化开发，加快开发的进度。

【全文完】
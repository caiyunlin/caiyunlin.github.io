---
title: 圣诞特辑-交换礼物
date: 2021-12-25 15:14:00 +0800
categories: [技术]  
tags: [javascript]  
urlname: gift-exchange
url: http://www.caiyunlin.com/2021/12/gift-exchange/
---

圣诞节到了，Team里面的小伙伴组织了一个交换礼物的活动，我也奉命接下了写个小工具的任务。

## 需求

需求很简单，就是将 人员名单 和 礼物清单 排成两列，然后随机摇出新的匹对，这样每个人就得到了新的礼物。

![](http://images.caiyunlin.com/gift.jpg)

## 算法

核心算法其实很简单，就是将数组进行随机乱序排列，代码如下

从后往前遍历，随机一个前面的数的坐标和当前数交换，所有位置的数字都交换完成

```javascript
function shuffle(arr) {
    let i = arr.length;
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
    }
}
```

## 代码

1. 采用 web 实现，这样表现力强一点，选择了 bootstrap 框架做为基础UI，使用 bootstrap 的 table 排列名单

2. 考虑到只需要运行一次，所以维护人员名单，直接 Hard Code 到 html 页面里，临时增加人员，也只需要记事本打开修改一下即可
3. 为了达到抽奖的效果，可以做一个 轮询 按下开始按钮后就不停的交换和刷新 人员名单 和 礼物名单，然后再按下按钮停止，即为最终结果

最终实现效果如下：

![](http://images.caiyunlin.com/gift-exchange.gif)

演示地址：<a href=" http://www.caiyunlin.com/dev/gift-exchange/index.html" target="_blank">http://www.caiyunlin.com/dev/gift-exchange/index.html</a>

可以直接另存为本地文件修改。



【全文完】


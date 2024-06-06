---
title: Javascript 对象继承  
date: 2018-04-28 11:16:45  
categories : [技术]  
tags: [javascript]  
urlname: javascript-inherit  
url: http://www.caiyunlin.com/2018/04/javascript-inherit/
---


Javascript 没有直接的对象继承，可以通过原型继承的方式来实现，下面是一种实现方法。
## 定义父类
将方法写到原型（prototype)上
```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
};

Person.prototype.greeting = function() {
  console.log('Hi! I\'m ' + this.name + '.');
};
```

## 定义子类
```javascript
function Teacher(name, age, title) {
  //初始化父类的属性
  Person.call(this, name, age);
  //Person.apply(this,[name,age]);
  //初始化子类的属性
  this.title = title
}

//继承父类的方法
Teacher.prototype = Object.create(Person.prototype);

//将构造器指回Teacher，一般情况下可省略，详见 https://stackoverflow.com/questions/8453887/why-is-it-necessary-to-set-the-prototype-constructor
Teacher.prototype.constructor = Teacher;


//设置子类的方法
Teacher.prototype.sayHello = function(){
   console.log('Hi! I\'m ' + this.name + '. My title is '+this.title);
}
```

## 实例化
```javascript
var teacher1 = new Teacher('Allen',35,'title1')
teacher1.sayHello();

var teacher2 = new Teacher('Bob',35,'title1')
teacher1.greeting();
```

【全文完】
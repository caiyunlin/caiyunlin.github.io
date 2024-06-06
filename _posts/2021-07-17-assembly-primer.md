---
title: 汇编语言基础
date: 2021-07-17 09:41:00 +0800
categories: [技术]  
tags: [bash,ubuntu,assembly]  
urlname: assembly-primer 
url: http://www.caiyunlin.com/2021/07/assembly-primer/
---

最近查一些文章，涉及到了汇编语言，所以翻出一些资料复习一下。

我们平常学习的编程语言，如 C, C++, Java, C#,Python等等都是高级语言。我们也都知道，机器只能理解执行`0101`的代码，那高级语言如何转换为机器语言的？

其实高级语言是通过编译器转换为机器语言的，在编译过程中间会生成一个过渡性的语言，叫`汇编语言`，高级语言屏蔽了实现的细节，如对内存的操作，而`汇编语言`是低级语言，是通过指令直接对硬件，如`CPU的寄存器`和`内存`进行操作的语言，早期的程序员也是直接写`汇编语言`来控制程序运行，了解`汇编语言`有助于明白底层的实现，进而可以增加排错能力，以及优化代码。

## 一点背景

汇编语言是针对CPU设计的，每一种CPU都有自己的汇编指令集，所以针对不同的CPU的汇编语言写法是不一样的，比如 ARM(安卓手机CPU) 和 Intel(常用PC CPU) 他们的指令格式是不一样的。 即便是同一款CPU，指令格式上也可以不一样，常用的有 `ATT` 汇编格式和 `Intel`汇编格式。

通常一条汇编指令包含操作码和操作数两部分内容，格式为 `操作码(OP) 操作数` 

如 `mov $20 %al` 表示将立即数`20`保存到寄存器 `al`中去，这个写法是 `ATT`格式，如果用 `Intel`汇编代码格式写，那对应的代码就是 `MOV AL, 20H`

> ATT 与 Intel 汇编代码格式：
>
> Intel 汇编格式比较好理解，因为芯片是Intel生产的，他们自然设置了对应的汇编代码格式。
>
> ATT（根据 "AT&T"命名的，AT&T是运营贝尔实验室多年的公司）格式的汇编代码，这是GCC,OBJDUMP等工具的默认格式，贝尔实验室是Unix系统的创建者，Linux 是 Unix 家族的一员，早期Linux所使用的的386汇编语言也是起源于Unix，Unix最初是为PDP－11开发的，曾先后被移植到VAX及68000系列的处理器上，这些处理器上的汇编语言都采用的是AT&T的指令格式。当Unix被移植到i386时，自然也就采用了AT&T的汇编语言格式，而不是Intel的格式。

`ATT`语法和`Intel`语法的一些区别

在`ATT`语法中，寄存器前冠以`％`，而立即数前冠以`$`，在`Intel`的语法中，寄存器和和立即数都没有前缀。

在`ATT`语法中，十六进制立即数前冠以“0x”，而在Intel的语法中，十六进制和二进制立即数后缀分别冠以`h`和`b`

在 `Ubuntu` GCC 编译器中默认是 `ATT` 语法，本文也主要以`ATT`语法来示例。

## 寄存器

上面的示例代码中，命令 `mov $10 %al`

是将数字 10 放到寄存器 al 中，那`al`是指哪个寄存器呢，可以参考下面的图表

下图是 8086 16位寄存器的简要介绍， AX 是累加寄存器，包含高位 AH 和 低位 AL，所以上述命令就是将数字 10 放到 累加寄存器的低位中。

![image](http://images.caiyunlin.com/20210717115924.png)

上图是 16 位CPU的架构图，目前大部分的系统都是 64 位的CPU，可以参考下面的表格，第一行表示位数，高位的包含低位

| 63~32 | 31~16 | 15~8  | 7~0   | 说明         |
| ----- | ----- | ----- | ----- | ------------ |
| %rax  | %eax  | %ax   | %al   | ==返回值==   |
| %rbx  | %ebx  | %bx   | %bl   | Callee Saved |
| %rcx  | %ecx  | %cx   | %cl   | 第4个参数    |
| %rdx  | %edx  | %dx   | %dl   | 第3个参数    |
| %rsi  | %esi  | %si   | %si   | 第2个参数    |
| %rdi  | %edi  | %di   | %di   | 第1个参数    |
| %rbp  | %ebp  | %bp   | %bp   | Callee Saved |
| %rsp  | %esp  | %sp   | %sp   | ==栈指针==   |
| %r8   | %r8d  | %r8w  | %r8b  | 第5个参数    |
| %r9   | %r9d  | %r9w  | %r9b  | 第6个参数    |
| %r10  | %r10d | %r10w | %r10b | Caller Saved |
| %r11  | %r11d | %r11w | %r11b | Caller Saved |
| %r12  | %r12d | %r12w | %r12b | Callee Saved |
| %r13  | %r13d | %r13w | %r13b | Callee Saved |
| %r14  | %r14d | %r14w | %r14b | Callee Saved |
| %r15  | %r15d | %r15w | %r15b | Callee Saved |

如 `movl $10, %eax` 和 `mov $10 %ax` 是类似的效果，注意 ATT 的 `mov` 命令后面可以跟字长表示长度 ，字长定义如下 ：

| C声明  | Intel数据类型     | 汇编代码后缀 | 大小（字节） |
| ------ | ----------------- | ------------ | ------------ |
| char   | 字节(byte)        | b            | 1            |
| short  | 字(word)          | w            | 2            |
| int    | 双字(double word) | l            | 4            |
| long   | 四字(quad word)   | q            | 8            |
| char*  | 四字              | q            | 8            |
| float  | 单精度            | s            | 4            |
| double | 双精度            | l            | 8            |

## 一个简单的例子

将下面文件保存为 `main.c`

```c
int main(){
    return 0;
}
```

使用尝试使用`gcc`编译生成汇编, `gcc -O` 的参数是生成原始的汇编的命令，没有这个参数会生成经过优化的汇编命令

```bash
$ gcc -Og -S -o main.s main.c
$ cat main.s
        .file   "main.c"
        .text
        .globl  main
        .type   main, @function
main:
.LFB0:
        .cfi_startproc
        movl    $0, %eax
        ret
        .cfi_endproc
.LFE0:
        .size   main, .-main
        .ident  "GCC: (Ubuntu 7.5.0-3ubuntu1~18.04) 7.5.0"
        .section        .note.GNU-stack,"",@progbits
```

上述代码中 .file 大部分为汇编的描述代码，不会生成具体机器指令，我们可以忽略， 简化上面的汇编代码如下

```assembly
.global main

main:
    movq $0, %rax
    ret
```

稍微解释下这段代码， .global main 是告诉汇编器， main 为主要入口， `movq $0, %rax` 是指将立即数 0 移到累加寄存器 `rax`，`rax`也是返回数寄存器，程序最后的运行结果就放在这个寄存器中。 `ret` 就是 return 的缩写，是退出程序。

这段代码主要功能就是返回一个运行结果 0 ，然后退出。 

我们将上述汇编代码保存为 `testmain.s` ，然后使用 `gcc` 来编译输出可执行文件

```bash
$ gcc -o testmain testmain.s
./testmain
$ echo $? # 查询运行结果
0
```

我们可以将上述 `movq $0` 改成其他数字如 `movq $10` ，重新编译测试结果，会发现最终结果也会改变。

## 简单的加法

上面的代码，我们直接操作了累加寄存器设置了返回值，这一节我们仍然使用 c 反汇编来看一下加法的实现。

将下面文件保存为 `testaddab.c`

```c
int addab(int a, int b){
    return a+b;
}
int main(){
    return addab(2,3);
}
```

使用`gcc`编译

```bash
$ gcc -Og -S -o testaddab.s testaddab.c
$ cat testaddab.s
        .file   "testaddab.c"
        .text
        .globl  addab
        .type   addab, @function
addab:
.LFB0:
        .cfi_startproc
        leal    (%rdi,%rsi), %eax
        ret
        .cfi_endproc
.LFE0:
        .size   addab, .-addab
        .globl  main
        .type   main, @function
main:
.LFB1:
        .cfi_startproc
        movl    $3, %esi
        movl    $2, %edi
        call    addab
        rep ret
        .cfi_endproc
.LFE1:
        .size   main, .-main
        .ident  "GCC: (Ubuntu 7.5.0-3ubuntu1~18.04) 7.5.0"
        .section        .note.GNU-stack,"",@progbits
# 输出可执行文件
$ gcc -o testaddab testaddab.s
$ ./testaddab # 执行程序
$ echo $?     # 查看执行结果
```

简化上面的编码如下，保存为 `testadd.s`：

```assembly
.global addab

addab:
    leal (%rdi,%rsi), %eax
    ret

.global main

main:
    movl $3, %esi
    movl $2, %edi
    call addab
    rep ret
```

重复上面的编译步骤，我们会得到如下结果

```bash
$ gcc -o testadd testadd.s
$ ./testadd
$ echo $?
5
```

我们可以看到 movl 将 3，和 2 分别放到寄存器 esi 和 edi， 然后调用函数 leal ，注意 lea 是 intel 的指令 (Load effect address ) 也就是取有效地址的意思，可以用它在实现快速的加法以及简单的乘法。

## Hello World!

下面我们写一段 hello world，和其他高级语言不一样，因为CPU只能做数值运算，而 hello world 涉及到显示，也就是IO，所以我们必须调用操作系统的函数来完成文本的输出， 将下面文件保存到 `helloworld.s`

```assembly
    .section .data

message:
    .ascii "hello world!\n"
    length = . - message

    .section .text
    .global main

main:
    movq $1, %rax
    movq $1, %rdi
    lea message(%rip), %rsi
    movq $length, %rdx
    syscall

    movq $60, %rax
    xor %rdi, %rdi
    syscall
```

编译执行

```bash
$ gcc -o helloworld helloworld.s
$ ./helloworld
Hello World!
```

## 总结

汇编语言是针对硬件直接编程的语言，命令的格式为 `操作码 操作数`

汇编语法有 ATT 和 Intel 之分

可以通过操作寄存器设置程序的返回值

需要显示字符，需要调用系统函数 `syscall`

## 参考

https://www.cs.virginia.edu/~evans/cs216/guides/x86.html



【全文完】

---
title: C# Async Await 探究
date: 2021-08-12 15:14:00 +0800
categories: [技术]  
tags: [csharp]  
urlname: csharp-async-await
url: https://www.caiyunlin.com/2021/08/csharp-async-await/
---

这篇文章源于同事问我的一个问题, async await 会不会创建新的线程?

当时直观的感觉是会创建，觉得 async await 只是语法糖，当前线程没有被 block，而后台肯定需要做事，所以必然会创建新的线程去执行任务才对。

然而查了文档，发现官方文档明确说明： `async` 和 `await` 关键字不会创建其他线程。 因为异步方法不会在其自身线程上运行，因此它不需要多线程。

参考：https://docs.microsoft.com/zh-cn/dotnet/csharp/programming-guide/concepts/async/task-asynchronous-programming-model#threads

如果没有创建线程，到底谁在后台执行任务呢？带着这个问题，好好捋一下 async await 这个新特性。

## 子线程
在没有 async 和 await 关键字的时候，如果我们需要在后台执行一些耗时任务时，就可以开启新的线程来完成。
现在我们模拟一个耗时任务 doWord 函数，该函数完成一个加法并返回结果，为了模拟耗时，加入了 ms 参数用来 Sleep 模拟耗时。

具体测试代码如下，我们在主线程中开启了两个子线程来执行两个耗时的任务，执行完成后输出得到的结果。

```csharp
    class Program
    {
        static void Print(string message)
        {
            string now = DateTime.Now.ToString("HH:mm:ss.fff");
            Console.WriteLine($"{now} {message}");
        }

        static int doWork(int a, int b, int ms = 1000)
        {
            int threadId = Thread.CurrentThread.ManagedThreadId;
            Print($"Current Thread ID is : {threadId} ");
            Thread.Sleep(ms);
            int result = a + b;
            Print($"Thread #{threadId} doWork:{a} + {b} = {result}");
            return result;
        }

        static void Main(string[] args)
        {
            Print("====Main Thread Start====");
            Print($"Main Thread ID is : {Thread.CurrentThread.ManagedThreadId}");
            ThreadTest();
            Print("====Main Thread End====");
            Console.ReadKey();
        }

        static void ThreadTest()
        {
            int result1 = 0;
            int result2 = 0;

            Thread thread1 = new Thread(() =>
            {
                result1 = doWork(1, 1, 2000);
                Print("Thread 1 Completed! ");
            });

            Thread thread2 = new Thread(() =>
            {
                result2 = doWork(2, 2, 1000);
                Print("Thread 2 Completed! ");
            });

            thread1.Start();
            Print("Thread 1 Started! ");

            thread2.Start();
            Print("Thread 2 Started! ");

            //wait thread to complete
            thread1.Join();
            thread2.Join();

            Print($"result1 = {result1}");
            Print($"result2 = {result2}");
        }

    }
```

输出如下，为了方便表示执行的线程，我们 doWork 任务里面打印了"线程号"
```
18:15:19.688 ====Main Thread Start====
18:15:19.690 Main Thread ID is : 1
18:15:19.691 Thread 1 Started!
18:15:19.692 Thread 2 Started!
18:15:19.694 Current Thread ID is : 3
18:15:19.694 Current Thread ID is : 4
18:15:20.709 Thread #4 doWork:2 + 2 = 4
18:15:20.709 Thread 2 Completed!
18:15:21.699 Thread #3 doWork:1 + 1 = 2
18:15:21.699 Thread 1 Completed!
18:15:21.704 result1 = 2
18:15:21.704 result2 = 4
18:15:21.704 ====Main Thread End====
```

我们可以看到主线程调用 ThreadTest 函数，创建了2个子线程，其中子线程1 耗时2秒，线程2耗时1秒，所以线程2先完成了。
最后 thread1.Join() 和 thread2.Join() 用于阻塞等待两个线程，直到他们都执行完毕。

这里需要注意，一定要 thread1.Join() 和 thread2.Join()，如果注释掉这两句，则返回结果如下
```
18:15:39.162 ====Main Thread Start====
18:15:39.164 Main Thread ID is : 1
18:15:39.165 Thread 1 Started!
18:15:39.166 Thread 2 Started!
18:15:39.167 result1 = 0
18:15:39.168 result2 = 0
18:15:39.168 ====Main Thread End====
18:15:39.169 Current Thread ID is : 3
18:15:39.171 Current Thread ID is : 4
18:15:40.179 Thread #4 doWork:2 + 2 = 4
18:15:40.179 Thread 2 Completed!
18:15:41.181 Thread #3 doWork:1 + 1 = 2
18:15:41.181 Thread 1 Completed!
```
我们可以看到因为没有等待子线程的执行，Main Thread 提前结束了。 如果不是后面的 Console.ReadKey() 在等待，那么子线程可能没有执行完毕就被回收了。

从上面可以看出，从子线程中取得执行结果的方式比较繁琐，而且必须控制好等待子线程执行完毕，否则可能不能得到正确的结果。

## 异步编程 Async Await
使用异步编程的方法，我们可以把耗时的函数封装成 async 的方法，然后在需要得到结果的地方使用 await。
我们将上面的 doWork 包装到一个异步方法
```csharp
static async Task<int> doWorkAsync(int a, int b, int ms)
{
    int result = await Task.Run(() =>doWork(a, b, ms));
    return result;
}
static async Task AsyncAwaitTest()
{
    int result1  = await doWorkAsync(1, 1, 2000);
    int result2 = await doWorkAsync(2, 2, 1000);
    Print($"result1 = {result1}");
    Print($"result2 = {result2}");
}
```
将 Main 函数中的 ThreadTest() 换成 AsyncAwaitTest().Wait()，我们可以看到执行结果如下：
```
18:16:03.864 ====Main Thread Start====
18:16:03.866 Main Thread ID is : 1
18:16:03.893 Current Thread ID is : 3
18:16:05.899 Thread #3 doWork:1 + 1 = 2
18:16:05.901 Current Thread ID is : 4
18:16:06.914 Thread #4 doWork:2 + 2 = 4
18:16:06.915 result1 = 2
18:16:06.917 result2 = 4
18:16:06.917 ====Main Thread End====
```
我们可以看到，异步方法执行的时候，实际上还是还有有其他线程来执行，其效果和线程的写法类似，但是写法上要简洁很多，也不需要定义全局变量来获取线程执行的结果。 大大减轻了编程的难度。 
使用 await 关键字之后，一定会将正确的值复制到前面的变量，写法上与同步的方法类似，只是增加了 await 的关键字。
注意，调用入口处，因为是同步函数，AsyncAwaitTest() 后面的 Wait() 方法是强制等待异步方法执行完毕，这个和前面 thread.Join 类似，但是不用单独管理线程。

## 总结

所以异步方法执行是会产生线程的，我们再回头看文档

https://docs.microsoft.com/zh-cn/dotnet/csharp/programming-guide/concepts/async/task-asynchronous-programming-model#threads 

原来其强调的是 async 和 await 关键字不会创建其他线程，但是在真正执行到任务是，比如 调用 Task.Run 方法时，才会占用子线程，该子线程由 Task 来管理，而不需要我们手动去 new Thread，也不需要用 ThreadPool 来管理。

有关于 async 方法的调用机制，可以参考下面官方截图和解释
![](https://docs.microsoft.com/zh-cn/dotnet/csharp/programming-guide/concepts/async/media/task-asynchronous-programming-model/navigation-trace-async-program.png)

关系图中的数字对应于以下步骤，在调用方法调用异步方法时启动。

1. 调用方法调用并等待 `GetUrlContentLengthAsync` 异步方法。

2. `GetUrlContentLengthAsync` 可创建 [HttpClient](https://docs.microsoft.com/zh-cn/dotnet/api/system.net.http.httpclient) 实例并调用 [GetStringAsync](https://docs.microsoft.com/zh-cn/dotnet/api/system.net.http.httpclient.getstringasync) 异步方法以下载网站内容作为字符串。

3. `GetStringAsync` 中发生了某种情况，该情况挂起了它的进程。 可能必须等待网站下载或一些其他阻止活动。 为避免阻止资源，`GetStringAsync` 会将控制权出让给其调用方 `GetUrlContentLengthAsync`。

   `GetStringAsync` 返回 [Task](https://docs.microsoft.com/zh-cn/dotnet/api/system.threading.tasks.task-1)，其中 `TResult` 为字符串，并且 `GetUrlContentLengthAsync` 将任务分配给 `getStringTask` 变量。 该任务表示调用 `GetStringAsync` 的正在进行的进程，其中承诺当工作完成时产生实际字符串值。

4. 由于尚未等待 `getStringTask`，因此，`GetUrlContentLengthAsync` 可以继续执行不依赖于 `GetStringAsync` 得出的最终结果的其他工作。 该任务由对同步方法 `DoIndependentWork` 的调用表示。

5. `DoIndependentWork` 是完成其工作并返回其调用方的同步方法。

6. `GetUrlContentLengthAsync` 已运行完毕，可以不受 `getStringTask` 的结果影响。 接下来，`GetUrlContentLengthAsync` 需要计算并返回已下载的字符串的长度，但该方法只有在获得字符串的情况下才能计算该值。

   因此，`GetUrlContentLengthAsync` 使用一个 await 运算符来挂起其进度，并把控制权交给调用 `GetUrlContentLengthAsync` 的方法。 `GetUrlContentLengthAsync` 将 `Task<int>` 返回给调用方。 该任务表示对产生下载字符串长度的整数结果的一个承诺。

    备注

   如果 `GetStringAsync`（因此 `getStringTask`）在 `GetUrlContentLengthAsync` 等待前完成，则控制会保留在 `GetUrlContentLengthAsync` 中。 如果异步调用过程 `getStringTask` 已完成，并且 `GetUrlContentLengthAsync` 不必等待最终结果，则挂起然后返回到 `GetUrlContentLengthAsync` 将造成成本浪费。

   在调用方法中，处理模式会继续。 在等待结果前，调用方可以开展不依赖于 `GetUrlContentLengthAsync` 结果的其他工作，否则就需等待片刻。 调用方法等待 `GetUrlContentLengthAsync`，而 `GetUrlContentLengthAsync` 等待 `GetStringAsync`。

7. `GetStringAsync` 完成并生成一个字符串结果。 字符串结果不是通过按你预期的方式调用 `GetStringAsync` 所返回的。 （记住，该方法已返回步骤 3 中的一个任务）。相反，字符串结果存储在表示 `getStringTask` 方法完成的任务中。 await 运算符从 `getStringTask` 中检索结果。 赋值语句将检索到的结果赋给 `contents`。

8. 当 `GetUrlContentLengthAsync` 具有字符串结果时，该方法可以计算字符串长度。 然后，`GetUrlContentLengthAsync` 工作也将完成，并且等待事件处理程序可继续使用。 在此主题结尾处的完整示例中，可确认事件处理程序检索并打印长度结果的值。 如果你不熟悉异步编程，请花 1 分钟时间考虑同步行为和异步行为之间的差异。 当其工作完成时（第 5 步）会返回一个同步方法，但当其工作挂起时（第 3 步和第 6 步），异步方法会返回一个任务值。 在异步方法最终完成其工作时，任务会标记为已完成，而结果（如果有）将存储在任务中。

【全文完】

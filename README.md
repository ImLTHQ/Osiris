# Osiris

![Windows](https://github.com/danielkrupinski/Osiris/workflows/Windows/badge.svg?branch=master&event=push)
![Linux](https://github.com/danielkrupinski/Osiris/workflows/Linux/badge.svg?branch=master&event=push)

Counter-Strike 2 的跨平台（Windows、Linux）游戏黑客，具有基于游戏全景 UI 的 GUI 和渲染。与Steam上的最新游戏更新兼容。  
本仓库提供了基于原版Osiris的简体中文版本  
默认分支(Legit)保留了合法功能，不影响游戏平衡，但是注入仍会有VAC封禁的风险。

## 新增功能

* 2024年5月20日 - 已实现显示玩家正在使用的武器弹药数量

![Player active weapon ammo](https://github.com/danielkrupinski/Osiris/assets/34515229/9a6dfc37-ee9f-4b70-9b1f-0e4465bf58fb)

* 2024年5月15 日 - 实现了在被闪光弹致盲的玩家身上显示图标

![Player blinded by flashbang](https://github.com/danielkrupinski/Osiris/assets/34515229/18b10e66-545a-449f-8783-691d5c1b2003)

* 2024年5月14日 - 已实现在玩家解救人质时显示图标

![Player rescuing hostage](https://github.com/danielkrupinski/Osiris/assets/34515229/057b6dc7-1b54-44c0-9443-6917d2394335)

* 2024年5月7日 - 在玩家劫持人质时显示图标

![Player picking up hostage](https://github.com/danielkrupinski/Osiris/assets/34515229/d3a27f1a-dd79-4d18-bfbb-d8bb8c47ae2d)

* 2024年5月6日 - 调整了“炸弹计时器”外观。实现了在玩家拆除炸弹时显示图标

![Player defusing icon](https://github.com/danielkrupinski/Osiris/assets/34515229/4addfc99-27d8-4f9d-a1b7-eb2b7c7565bd)

## 技术特点

* C++ 运行库 （CRT） 未在Release版本中使用
* 无堆内存分配
* 在 Windows 上的Release版本中没有静态导入
* 不创建任何线程
* 不使用Exceptions
* 无外部依赖关系

## 编译

### 前置条件

#### Windows

* **Microsoft Visual Studio 2022** with **Desktop development with C++** workload

#### Linux

* **CMake 3.24** or newer
* **g++ 11 or newer** or **clang++ 15 or newer**

### 从源代码编译

#### Windows

在 Visual Studio 中打开Osiris.sln，将生成配置设置为“Release”|“x64”。按“构建解决方案”，您应该会收到Osiris.dll文件。

#### Linux

使用 CMake 进行配置：

    cmake -DCMAKE_BUILD_TYPE=Release -B build

Build:

    cmake --build build -j $(nproc --all)

按照这些步骤操作后，您应该会在 **build/Source/** 目录中收到 **libOsiris.so** 文件。

### 加载/注入游戏进程

#### Windows

您需要一个 **DLL注入器** 来将 **Osiris.dll** 注入(加载)到游戏进程中。

Counter-Strike 2 阻止了 **LoadLibrary** 注入方法，因此您必须使用手动映射（又名反射式 DLL 注入）注入器。

使用**ExLoader**的默认模式（隐式）可成功注入到Counter-Strike 2

**已知 VAC 检测到 Xenos 和 Extreme Injector。**

#### Linux

只需在包含 **libOsiris.so** 的目录中运行以下脚本即可：

    sudo gdb -batch-silent -p $(pidof cs2) -ex "call (void*)dlopen(\"$PWD/libOsiris.so\", 2)"

不过，这种注入方法可能会被 VAC 检测到，因为在注入过程中，**TracerPid** 下的 **gdb** 是可见的。`/proc/$(pidof cs2)/status`

通过对内核源代码应用以下补丁，可以隐藏TracerPid：

    --- a/fs/proc/array.c
    +++ b/fs/proc/array.c
    @@ -162,7 +162,7 @@
     
     	tracer = ptrace_parent(p);
     	if (tracer)
    -		tpid = task_pid_nr_ns(tracer, ns);
    +		tpid = 0;
     
     	tgid = task_tgid_nr_ns(p, ns);
     	ngid = task_numa_group_id(p);

## License

> Copyright (c) 2018-2024 Daniel Krupiński

This project is licensed under the [MIT License](https://opensource.org/licenses/mit-license.php) - see the [LICENSE](https://github.com/danielkrupinski/Osiris/blob/master/LICENSE) file for details.

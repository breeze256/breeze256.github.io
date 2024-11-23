---
title: "C++ 环境配置（VSCode + Clangd）"
date: 2024-11-23
tags: ["计算机科学"]
categories: ["理论 & 学习"]
---

一般来说，一个完整的 C++ 语言开发环境包含以下两个部分，**文本编辑器** (Text Editor) 和 **C++编译器** (Compiler)。

## C++ 编译器

通过文本编辑器创建的文件称为 **源文件** (Source Files)，里面存储了程序的源代码。
C++ 程序的源文件拓展名通常为 `.cpp` 、 `.cp` 或 `.c` ，一般来说， `.cpp` 使用最为广泛。

写在源文件中的源代码是人类可读的源。它需要"编译"，转为机器语言，这样 CPU 可以按给定指令执行程序。  
而 C++ 编译器用于把源代码编译成最终的可执行程序。

大多数的 C++ 编译器对源文件的扩展名不敏感，但是如果您未指定扩展名，则默认使用 `.cpp`。

最常用的免费可用的编译器是 GNU 的 C/C++ 编译器和 LLVM 架构的 Clang 编译器。

## 文本编辑器[^1][^2]

为了给编程创造一个良好的体验，我们要确保要有一个得心应手的文本编辑器，下面是一些常见的 C++ 文本编辑器：

- **Visual Studio Code** :  
  尽管 VSCode 是一个通用的文本编辑器，但其强大的拓展功能使得其很适合编写与调试 C++ 程序。  
  通过调整一些常用设置和安装合适的拓展，其可以作为一个非常合适的 C++ 语言开发环境。

- **Visual Studio** :  
  (Windows Only) 由微软开发的面向 .NET 和 C++ 开发人员的综合性 Windows IDE，可用于构建 Web、云、桌面、移动应用、服务和游戏。

- **Vim** 和 **Emacs** :  
  (新手不友好) 这两个是传统的文本编辑器，它们有着强大的编辑功能和高度的可定制性，对于熟练的用户来说非常强大，有很多插件和配置可以支持 C++ 语言的开发及调试。

- **CLion** :  
  由 JetBrains 开发的跨平台综合性 C++ IDE，功能强大，及其适合构建大型项目。
  但是其非免费，且价格较高，在这里也不推荐盗版及破解版。

- **Eclipse** :  
  Eclipse 是另一个功能强大的集成开发环境，虽然它最初是为 Java 开发设计的，但通过安装 C/C++ 插件，可以使其支持 C++ 语言开发。

当然，除了上面如今比较常见的 C++ 开发环境，还有一些较旧及适合 OI 的 C++ 文本编辑器：

- **Dev-C++** :  
  (Windows Only) 界面简洁友好，安装便捷，支持单文件编译，因此成为了许多入门 OI 选手以及 C++ 语言初学者的首选。

- **Code::Blocks** :  
  使用 C++ 开发的开源跨平台集成开发环境（IDE），采用 wxWidgets 作为图形界面库。该项目始于 2001 年，目前由官方社区维护，主要用于 C、C++ 和 Fortran 等编程语言的开发。

- **CP Editor** :  
  专为算法竞赛设计，不像其它 IDE 主要是为了开发设计的。它可以帮助你自动化编译、运行、测试，从而让你专注于算法设计。

## 环境搭建

个人配置方案：**VSCode** (clangd) + **GCC**。

在 VSCode 上使用微软的 C/C++ 扩展编译、运行、拓展，使用 clangd 及扩展实现自动补全和代码提示。

### GCC

#### Linux

各个发行版由于有不同的存储库及包管理器，所以一般安装命令不同。可以自行在网上查阅。

这里以 Fedora 为例。

**Fedora** :

```bash
sudo dnf install gcc gcc-c++
sudo yum install gcc gcc-c++ # older fedora
```

当然，还是给出较为特殊的 NixOS 的配置。

**NixOS** :

```nix
{ pkgs, ... }:

{
    # ...
    environment.systemPackages = with pkgs; [
        # other packages ...
        gcc
        # ...
    ]
    # ...
}
```

安装后，可以使用 `gcc -v` 或 `gcc --version` 来检查安装版本，  
若输出后显示与如下类似，则安装成功：

```bash
使用内建 specs。
COLLECT_GCC=/nix/store/3s3rjkl3mx05wp0lmxgwkaqhbz9sy6kk-gcc-13.3.0/bin/gcc
COLLECT_LTO_WRAPPER=/nix/store/3s3rjkl3mx05wp0lmxgwkaqhbz9sy6kk-gcc-13.3.0/libexec/gcc/x86_64-unknown-linux-gnu/13.3.0/lto-wrapper
目标：x86_64-unknown-linux-gnu
配置为：../gcc-13.3.0/configure --prefix=/nix/store/eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-gcc-13.3.0 --with-gmp-include=/nix/store/eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-gmp-6.3.0-dev/include --with-gmp-lib=/nix/store/eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-gmp-6.3.0/lib --with-mpfr-include=/nix/store/eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-mpfr-4.2.1-dev/include --with-mpfr-lib=/nix/store/eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-mpfr-4.2.1/lib --with-mpc=/nix/store/eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-libmpc-1.3.1 --with-native-system-header-dir=/nix/store/eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-glibc-2.39-52-dev/include --with-build-sysroot=/ --with-gxx-include-dir=/nix/store/eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-gcc-13.3.0/include/c++/13.3.0/ --program-prefix= --enable-lto --disable-libstdcxx-pch --without-included-gettext --with-system-zlib --enable-static --enable-languages=c,c++ --disable-multilib --enable-plugin --disable-libcc1 --with-isl=/nix/store/eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-isl-0.20 --disable-bootstrap --build=x86_64-unknown-linux-gnu --host=x86_64-unknown-linux-gnu --target=x86_64-unknown-linux-gnu
线程模型：posix
支持的 LTO 压缩算法：zlib
gcc 版本 13.3.0 (GCC)
```

#### Windows

这里假设你已经安装 scoop，那么利用 scoop 安装 msys2 并启动：

```powershell
scoop install msys2
msys2
```

在 msys2 中安装 gcc 和 gdb：

```bash
pacman -S mingw-w64-x86_64-toolchain
```

默认安装目录为 `…\scoop\apps\msys2\xxxx-xx-xx\mingw64\bin`，记得将其加入环境变量。

### clangd

#### Linux

还是以 Fedora 为例。

**Fedora** :

```bash
sudo dnf install clangd
```

#### Windows

直接通过 scoop 来安装：

```powershell
scoop install clangd
```

### VSCode[^3]

!!! info
    
    这里就需要在 VSCode 中配置刚刚安装的 GCC 路径及 clangd 路径。  
    如果你刚刚在安装的时候已经将其都加入了环境变量，接下来就直接用命令就行了。  
    系统会自动从环境变量对应的路径中找到 GCC 和 clangd 的程序。

先在你的项目根目录下的 `.vscode` 文件夹下创建 `c_cpp_properties.json` 文件，内容如下：

```json
{
  "configurations": [
    {
      "name": "Linux", // Windows -> "Win32"
      "includePath": ["${workspaceFolder}/**"],
      "defines": ["_DEBUG", "UNICODE", "_UNICODE"],
      "compilerPath": "${default}",
      "cStandard": "c11",
      "cppStandard": "c++17",
      "intelliSenseMode": "${default}"
    }
  ],
  "version": 4
}
```

接下来，打开 VSCode 扩展市场搜索 clangd 安装：

![clangd](https://bitbucket.org/breeze256_workspace/imgs/raw/main/notebook/csci/cxx/config/clangd.png){width="300"}

同时我们也要安装微软的 C/C++ 扩展：

![mscpp](https://bitbucket.org/breeze256_workspace/imgs/raw/main/notebook/csci/cxx/config/mscpp.png){width="300"}

如果不出意外的话，这个时候 clangd 会提示与 Intelli Scense 冲突，在弹出的对话框选择禁用 C/C++
的 Intelli Scense 即可。

接下来，可以根据个人选择，在项目根目录的 `.vscode` 文件夹中的 `settings.json` 添加以下配置：

```json
    // [ms-vscode.cpptools]
    "C_Cpp.errorSquiggles": "enabled",
    "C_Cpp.intelliSenseEngine": "disabled",
    "C_Cpp.clang_format_fallbackStyle": "GNU",
    "C_Cpp.clang_format_style": "GNU",
    "C_Cpp.formatting": "clangFormat",
    // [llvm-vs-code-extensions.vscode-clangd]
    "clangd.path": "clangd",
    "clangd.arguments": [
        "--all-scopes-completion", // all completion
        "--background-index",
        "--clang-tidy",
        "--clang-tidy-checks=performance-*, bugprone-*, misc-*, google-*, modernize-*, readability-*, portability-*",
        "--compile-commands-dir=${workspaceFolder}/build/", // location of complie database
        "--completion-parse=auto", // clangd's completion
        "--completion-style=detailed", // completion's style
        "--enable-config", // enable clangd's config
        "--fallback-style=GNU", // fallback style
        "--function-arg-placeholders=true",
        "--header-insertion-decorators", // headfile decorators
        "--header-insertion=iwyu",
        "--include-cleaner-stdlib",
        "--log=verbose", // verbose logs
        "--pch-storage=memory",
        "--pretty", // pretty json
        "--ranking-model=decision_forest",
        "-j=12"
    ],
    // fallback flags
    "clangd.fallbackFlags": [
        "-std=c++11",
        "-I${workspaceFolder}/src/includes",
        "--target=x86_64-pc-linux-gnu"
    ],
    "clangd.onConfigChanged": "restart",
    "clangd.serverCompletionRanking": true,
    "clangd.detectExtensionConflicts": true,
    "clangd.checkUpdates": false,
```

然后按下 `Ctrl + Shift + P` 打开命令菜单，输入 `clangd` 找到并点击 `clangd: Download language server`（如果你是 Windows 用户，可以跳过）。等待其下载完后，再在菜单找到 `clangd: Restart language server` 并点击，然后重启 VSCode。  
如果你打开 `.cpp` 文件后，左下角出现 `clangd: idle` 时，表明 `clangd` 已经配置完成。

![success](https://bitbucket.org/breeze256_workspace/imgs/raw/main/notebook/csci/cxx/config/success.png){width="300"}

接下来配置微软 C/C++ 的调试功能，在项目根目录的 `.vscode` 文件夹下面创建调试文件。

**launch.json** :

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "(gdb) 启动",
      "type": "cppdbg",
      "request": "launch",
      "program": "${fileDirname}/${fileBasenameNoExtension}", // Windows -> "${fileDirname}\\${fileBasenameNoExtension}.exe"
      "args": [],
      "stopAtEntry": false,
      "cwd": "${fileDirname}",
      "environment": [],
      "externalConsole": false,
      "MIMode": "gdb",
      "miDebuggerPath": "gdb",
      "setupCommands": [
        {
          "description": "为 gdb 启用整齐打印",
          "text": "-enable-pretty-printing",
          "ignoreFailures": true
        },
        {
          "description": "将反汇编风格设置为 GNU",
          "text": "-gdb-set disassembly-flavor GNU",
          "ignoreFailures": true
        }
      ],
      "preLaunchTask": "g++ build"
    }
  ]
}
```

**tasks.json** :

```json
{
  "tasks": [
    {
      "type": "shell",
      "label": "g++ build",
      "command": "g++",
      "args": [
        "-g",
        "${file}",
        "-o",
        "${fileDirname}/${fileBasenameNoExtension}",
        // Excute
        "&&",
        "${fileDirname}/${fileBasenameNoExtension}"
      ],
      "options": {
        "cwd": "${fileDirname}"
      },
      "problemMatcher": ["$gcc"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new",
        "showReuseMessage": true,
        "clear": false
      }
    }
  ],
  "version": "2.0.0"
}
```

然后你就可以愉快的打断点调试了 awa。

[^1]: [C++ 教程 | 菜鸟教程](https://www.runoob.com/cplusplus/cpp-tutorial.html)

[^2]: [CP Editor | OI Wiki](https://oi-wiki.org/tools/editor/cpeditor/)

[^3]: [clangd + gcc + vscode](https://zhuanlan.zhihu.com/p/653258778)

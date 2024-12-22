---
title: VSCode 基本配置
categories:
  - 学习
tags:
  - 开发
date: 2024-12-14
---

Visual Studio Code（以下简称VSCode）是一款由微软开发且跨平台的免费源代码编辑器。

作为一个基本的代码编辑器，其支持语法高亮、代码自动补全（又称 IntelliSense）、代码重构、查看定义等功能，并且内置了命令行工具和 Git 版本控制系统。
其最具特色和受欢迎的特点是支持用户在线安装社区内的各种类型拓展，包括但不限于主题，语法高亮，代码格式化等等。

![vscode](https://bitbucket.org/breeze256_workspace/imgs/raw/main/notebook/csci/tools/vscode/vscode.png)

## 安装

### Linux

每个发行版的安装步骤略有差异，但差别不大。大多都是先添加 VSCode 的官方软件库，然后再通过发行版自带的软件包管理器安装。
故在此只写出 Fedora 和较为特殊的 NixOS 的步骤，其它发行版可查阅 [VSCode 官方教程](https://code.visualstudio.com/docs/setup/linux).

- **Fedora** :

首先需要导入 VSCode 的存储库：

``` bash
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" | sudo tee /etc/yum.repos.d/vscode.repo > /dev/null
```

然后更新软件包缓存，并通过 dnf（Fedora 22 及以上）来安装 VSCode：

``` bash
dnf check-update
sudo dnf install code # 或者 code-insiders
```

如果你使用 Fedora 22 以下，那么：

``` bash
yum check-update
sudo yum install code # 或者 code-insiders
```

- **NixOS** :

在这里推荐使用 home-manager 来声明式管理 VSCode 及插件，在你的 home-manager 配置中加入：

``` nix
programs.vscode = {
  enable = true;
  extensions = with pkgs.vscode-extensions; [
    vscodevim.vim
    # Your extensions ...
  ];
};
```

当然，也有其它方式，可以查阅 [NixOS 官方教程](https://nixos.wiki/wiki/Visual_Studio_Code)，这里不再赘述。

### Windows

推荐通过 scoop 来安装 VSCode，这里假设你已经添加了 extras bucket：

``` bash
scoop install vscode
```

当然，也可以在官网下载安装包来安装，没什么说的必要了吧 qwq。

## 安装中文语言包

安装中文语言包和安装其它扩展过程一样。

打开 VSCode，点击安装扩展，在搜索框输入 Chinese，然后点击简体中文语言包并 Install：

![chinese](https://bitbucket.org/breeze256_workspace/imgs/raw/main/notebook/csci/tools/vscode/chinese.png)

## 界面说明

下图是 VSCode 启动后的界面，简单说明如图：

![layout](https://bitbucket.org/breeze256_workspace/imgs/raw/main/notebook/csci/tools/vscode/layout.png)

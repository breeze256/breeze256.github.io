---
title: Rust 读入问题
categories:
  - 学习
tags:
  - 开发
  - Rust
abbrlink: ba8b3d49
date: 2024-08-23 00:00:00
---

Rust 读取麻烦的一批。一般情况是用 `split(' ')` 来分割整数。
但中间有多个空格就不行了。

后面发现有 `split_whitespace` 这个东西，可以替换多个空格。

[**A + B Problem**](https://www.luogu.com.cn/problem/P1001)

``` rust
use std::io;

fn main() {
  let mut input=String::new();
  io::stdin().read_line(&mut input).unwrap();
  let mut s = input.split_whitespace();
  let a: i32 = s.next().unwrap().parse().unwrap();
  let b: i32 = s.next().unwrap().parse().unwrap();
  println!("{}", a + b);
}
```

FROM alpine

LABEL org.breeze256-blog.image.author="18980896953@163.com"

# Change the paths to your SSH and repository's.
VOLUME [ "/home/breeze256/Documents/ssh", "/home/breeze256/breeze256.github.io" ]

WORKDIR /
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
    && apk update \
    && apk add sudo vim git openssh expect python3 py3-pip poetry \
    && adduser -S breeze256 -u 1000 -D -G users \
    && echo 'breeze256 ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

WORKDIR /docs
USER breeze256
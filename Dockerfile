FROM alpine

LABEL org.breeze256-blog.image.author="18980896953@163.com"

VOLUME [ "/home/breeze256/Documents/ssh", "/home/breeze256/breeze256.github.io" ]

WORKDIR /
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
    && apk update \
    && apk add sudo vim git openssh expect python3 py3-pip \
       py3-jinja2 py3-markdown mkdocs mkdocs-material mkdocs-material-extensions py3-pygments py3-pymdown-extensions \
       py3-babel py3-colorama py3-regex py3-requests py3-pathspec \
    && adduser -S breeze256 -u 1000 -D -G users \
    && echo 'breeze256 ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER breeze256
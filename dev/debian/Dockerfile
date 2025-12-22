FROM debian:13
ARG DEBIAN_FRONTEND=noninteractive
RUN useradd -m user && echo "user:password" | chpasswd
ENV HOME="/home/user" TERM="xterm" USER="user" SHELL="/bin/bash" EDITOR="vim" LANG="en_US.UTF-8" LC_ALL="C"
RUN echo 'root:password' | chpasswd
CMD [ "/bin/bash" ]

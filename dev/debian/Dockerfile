FROM debian:13
ARG DEBIAN_FRONTEND=noninteractive
RUN apt update
RUN apt -y install curl wget unzip
RUN mkdir /opt/packages
WORKDIR /opt/packages
RUN wget https://didierstevens.com/files/software/pdfid_v0_2_10.zip
RUN unzip -d pdfid pdfid*
RUN rm *.zip

FROM debian:13
ARG DEBIAN_FRONTEND=noninteractive
RUN useradd -m user && echo "user:password" | chpasswd
ENV HOME="/home/user" TERM="xterm" USER="user" SHELL="/bin/bash" EDITOR="vim" LANG="en_US.UTF-8" LC_ALL="C"
RUN echo 'root:password' | chpasswd
RUN mkdir /home/user/input
RUN mkdir /home/user/output
RUN apt update
RUN apt -y install poppler-utils python3
COPY --from=0 /opt/packages /opt
CMD [ "/bin/bash" ]

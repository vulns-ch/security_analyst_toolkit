FROM i386/debian:bookworm
ARG DEBIAN_FRONTEND=noninteractive
RUN apt update
RUN apt -y install curl wget unzip
RUN mkdir /opt/packages
WORKDIR /opt/packages
RUN wget https://didierstevens.com/files/software/pdfid_v0_2_10.zip
RUN unzip -d pdfid pdfid*
RUN rm *.zip
RUN wget https://github.com/vikramarsid/msg_parser/archive/refs/heads/master.zip
RUN unzip -d msg_parser master.zip
RUN rm *.zip

FROM i386/debian:bookworm
ARG DEBIAN_FRONTEND=noninteractive
RUN useradd -m user && echo "user:password" | chpasswd
ENV HOME="/home/user" TERM="xterm" USER="user" SHELL="/bin/bash" EDITOR="vim" LANG="en_US.UTF-8" LC_ALL="C"
RUN echo 'root:password' | chpasswd
RUN mkdir /home/user/input
RUN mkdir /home/user/output
RUN apt update
RUN apt -y install poppler-utils python3 unzip fakeroot file 
RUN apt -y install libimage-exiftool-perl mpack libemail-outlook-message-perl python3-olefile 
RUN apt -y install python3-setuptools
#RUN apt -y install apt-utils gcc python3 unzip dbus base whiptail patch wamerican ucf manpages file luajit make lua5.4 dialog less
#RUN apt -y install  apt-utils beef cpio cron dmidecode dmsetup g++ gcc gdbm-l10n init logrotate lsb-base lshw lua5.4 luajit lynx make \
#	nano netbase nodejs openssl procps python3 python3-cryptography \
#	python3-jinja2 python3-numpy python3-pandas python3-pip python3-scipy \
#	python3-six python3-yaml readline-common rsyslog ruby sensible-utils \
#	ssh systemd systemd-sysv tasksel tasksel-data udev vim wget whiptail \
#	xxd iptables isc-dhcp-client isc-dhcp-common kmod less netcat-openbsd
#binwalk
#RUN apt -y install python3-pip
#RUN pip3 install --break-system-packages olefile
COPY --from=0 /opt/packages /opt
WORKDIR /opt/msg_parser/msg_parser-master/
RUN python3 setup.py install
CMD [ "/bin/bash" ]

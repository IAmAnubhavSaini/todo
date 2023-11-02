FROM ubuntu
LABEL Description="todo app build environment"

ENV HOME /todo

SHELL ["/bin/bash", "-c"]

RUN apt update && apt upgrade --yes && \
    apt update && apt install --yes\
        build-essential \
        gcc #\
        # make \
        # clang \
        # cmake \
        # wget \
        # curl \
        # gdb \
        # vim \
        # nmap

RUN gcc -Wall -Wpedantic src/*.c -o build/todo




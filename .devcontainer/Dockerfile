FROM node:18

# Install basic development tools
RUN apt update && apt install -y less man-db sudo

RUN apt install -y default-jre && apt install -y graphviz

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

RUN sudo npm install -g @vscode/vsce

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

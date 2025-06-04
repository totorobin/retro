FROM mcr.microsoft.com/devcontainers/typescript-node:22

USER root
ARG USERNAME=node
ARG USER_UID
ARG USER_GID=$USER_UID

# update user
RUN groupmod --gid $USER_GID $USERNAME \
    && usermod --uid $USER_UID --gid $USER_GID $USERNAME \
    && chown -R $USER_UID:$USER_GID /home/$USERNAME


# ********************************************************
# * Anything else you want to do like clean up goes here *
# ********************************************************

# [Optional] Set the default user. Omit if you want to keep the default as root.
USER $USERNAME

#!/usr/bin/env bash

# Symlink specific files from the @agrublev/build-tool-config package
ln -s -f "../build-tool-config/configs" "./configs"
ln -s -f "../build-tool-config/scripts" "./scripts"
ln -s -f "../build-tool-config/templates" "./templates"

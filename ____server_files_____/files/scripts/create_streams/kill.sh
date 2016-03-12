#!/bin/bash
killall sh
killall launch.sh
killall ffmpeg >/dev/null 2>&1
killall update_status.sh >/dev/null 2>&1
rm /tmp/hls/* >/dev/null 2>&1
sleep 1

#!/bin/bash

#Kill processes if running
killall sh >/dev/null 2>&1
killall ffmpeg >/dev/null 2>&1
killall update_status.sh >/dev/null 2>&1
killall NouRadioRTSPServer >/dev/null 2>&1
killall rtsp_server.sh >/dev/null 2>&1
killall monitor_rtsp_streams.sh >/dev/null 2>&1
rm /tmp/hls/* >/dev/null 2>&1
sleep 1

#Launch RTSP server
/etc/init.d/DarwinStreamingServer restart >/dev/null 2>&1
sleep 2

#Launch update status
nohup ./update_status.sh >> ./logs/update_status.sh.log 2>&1 &

#Pull all radio streams
cd pullstreams
for i in `ls ./*.sh`;do
nohup $i >> ../logs/$i.log 2>&1 &
done
cd ../

echo "NouRadio Launched :)"

echo Launching topfm
while true;do /root/bin/ffmpeg -loglevel warning -i rtsp://202.123.13.40:1935/live/TopFM.sdp -c:a libfdk_aac -ac 1 -ar 48000 -b:a 96k  -flags:a +global_header -vn -f flv - -c:a libfdk_aac -ac 1 -ar 22050 -b:a 32k  -vn -f flv rtmp://127.0.0.1:1935/live/topfm_low|/root/bin/ffmpeg -loglevel warning -i - -c copy -f flv rtmp://127.0.0.1:1935/live/topfm -c copy -f rtp rtp://127.0.0.1:20010; sleep 60; done

echo Launching mbckoolfm
while true;do /root/bin/ffmpeg -loglevel warning -i mmsh://mediaserver.intnet.mu/mbckoolfm -c:a libfdk_aac -ac 1 -ar 48000 -b:a 96k -af "volume=10dB" -flags:a +global_header -vn -f flv - -c:a libfdk_aac -ac 1 -ar 22050 -b:a 32k -af "volume=10dB" -vn -f flv rtmp://127.0.0.1:1935/live/mbckoolfm_low|/root/bin/ffmpeg -loglevel warning -i - -c copy -f flv rtmp://127.0.0.1:1935/live/mbckoolfm -c copy -f rtp rtp://127.0.0.1:20070; sleep 60; done
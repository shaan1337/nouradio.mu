echo Launching mbcradiomauritius
while true;do /root/bin/ffmpeg -loglevel warning -i mmsh://mediaserver.intnet.mu/mbcrm2 -c:a libfdk_aac -ac 1 -ar 48000 -b:a 96k -af "volume=10dB" -flags:a +global_header -vn -f flv - -c:a libfdk_aac -ac 1 -ar 22050 -b:a 32k -af "volume=10dB" -vn -f flv rtmp://127.0.0.1:1935/live/mbcradiomauritius_low|/root/bin/ffmpeg -loglevel warning -i - -c copy -f flv rtmp://127.0.0.1:1935/live/mbcradiomauritius -c copy -f rtp rtp://127.0.0.1:20030; sleep 60; done
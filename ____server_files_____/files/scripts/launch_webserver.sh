echo Launching nginx...
killall nginx
ulimit -n 1000000 && nohup /usr/local/nginx/sbin/nginx >/dev/null 2>&1

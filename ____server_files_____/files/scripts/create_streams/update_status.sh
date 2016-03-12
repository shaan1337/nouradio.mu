#!/bin/bash
echo Lauching connections count...
while true; do
cnt=$(netstat -tn 2>/dev/null | grep 'ESTABLISHED' |grep -E ':80 |:554 ' | awk '{print $4"#"$5}'|grep -E ':80#|:554#'|tr '#' ':'| cut -d ':' -f 3 |sort|uniq -c|wc -l)
if [ $cnt -lt 0 ];then
	cnt=0
fi

radios=(mbcbestfm mbckoolfm mbcmusicfm mbcradiomaurice mbcradiomauritius mbctaalfm radioone radioplus topfm)
status='"status":{'
c=0

for radio in "${radios[@]}"
do
file=/tmp/hls/$radio.m3u8
c=$(($c+1))

if [ $c -ne 1 ]
then
   status=$status,
fi

if [ -f $file ]
then
   status=$status'"'$radio'":'1
else
   status=$status'"'$radio'":'0
fi
done

status=$status"}"

printf {'"num_connections":'$cnt",$status"} > /usr/local/nginx/html/status
sleep 5;
done;


# Nouradio.mu

This repository contains full code for the website nouradio.mu **(Hosting discontinued)**

**Nouradio.mu** contains all Mauritian radios on a single web page in an easy-to-use interface. The website is compatible with most devices: including mobile phones, desktops and tablets.

### How it works
**Live web radio streams (Radio Plus, Radio One, Top FM & MBC Radios) are pulled (using FFMPEG) , re-encoded to AAC and pushed (in Low & High Quality streams) to:**

1) nginx-rtmp-module (port 1935)

2) Darwin streaming server (port 20040)

**This creates multiple streams suitable to be viewed across most devices:**

1) HLS (Published by nginx-rtmp-module. Suitable for desktop & mobile phones - iPhones & Android)

2) RTSP (Published by Darwin streaming server. Suitable for older mobile phones, e.g. Blackberry)

**Finally, the front-end is a web interface accessible from the internet. Depending on the device accessing the website, the user is redirected to a particular page.**

### Operating system
**Nouradio.mu** was previously hosted on **Debian**.

### Dependencies
+ **ffmpeg** needs to be compiled with libfaac support.(The ffmpeg source is not included.)
There were also some parameter fixes made to the ffmpeg code, since some radio streams were not properly pulled.
For all steps, please see: ____server_files_____/guides/ffmpeg/steps.txt

+ **Darwin streaming server** needs to be compiled. For all steps, see ____server_files_____/guides/darwin streaming server/steps.txt

+ **Nginx** needs to be compiled with support for nginx-rtmp-module. For all steps, see ____server_files_____/guides/nginx/steps.txt

### Code

+ **Web server files** are located in the root directory of the repository

+ **Scripts** are located at:
____server_files_____/files/scripts

+ **Nginx configuration files** are located at (It also includes a copy of the web server files):
____server_files_____/usr/local/nginx

### Launching
+ **Web server**: run **____server_files_____\files\scripts\launch_webserver.sh** 

+ **Nouradio.mu**: run **____server_files_____\files\scripts\create_streams\launch.sh**

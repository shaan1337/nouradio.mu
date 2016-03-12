#include <stdio.h>
#include <iostream>
#include <fstream>
#include <string>
#include <sys/types.h>
#include <sys/stat.h>
#include <stdlib.h>
#include <sstream>

using namespace std;

string str(int x){
	stringstream ss;
	ss<<x;
	return ss.str();
}

void gensdp(string radio,int port){
	string path = "/usr/local/radios/"+radio+".sdp";
	ofstream myfile(path.c_str());
	myfile << "v=0\n";
	myfile << "o=- 0 0 IN IP4 127.0.0.1\n";
	myfile << "s="+radio+"\n";
	myfile << "c=IN IP4 127.0.0.1\n";
	myfile << "t=0 0\n";
	myfile << "a=tool:libavformat 56.24.101\n";
	myfile << "m=audio "+str(port)+" RTP/AVP 97\n";
	myfile << "b=AS:96\n";
	myfile << "a=rtpmap:97 MPEG4-GENERIC/48000/1\n";
	myfile << "a=fmtp:97 profile-level-id=1;mode=AAC-hbr;sizelength=13;indexlength=3;indexdeltalength=3; config=1188\n";	
	myfile.close();
}

int main(){
	int NUM_RADIOS = 9;
	string radios[] = {"radioone","topfm","mbctaalfm","mbcradiomauritius","mbcbestfm","radioplus","mbcmusicfm","mbckoolfm","mbcradiomaurice"};
	string urls[] = {"http://204.45.126.170:8081/stream","rtsp://202.123.13.40:1935/live/TopFM.sdp","mmsh://mediaserver.intnet.mu/mbctaalfm","mmsh://mediaserver.intnet.mu/mbcrm2","mmsh://mediaserver.intnet.mu/bestfm","http://174.37.16.73:8034/Live","mmsh://mediaserver.intnet.mu/mbcmusicfm","mmsh://mediaserver.intnet.mu/mbckoolfm","mmsh://mediaserver.intnet.mu/mbcrm1"};
	int volume_amp[] = {0,0,10,10,10,0,10,10,10};
	
	string ffmpeg_path = "/root/bin/ffmpeg";

	system("rm pullstreams/*");
	system("rm /usr/local/radios/*");

	int port = 20000;
	
	for(int i=0;i<NUM_RADIOS;i++){
		string radio= radios[i];
		string filename = radio+".sh";
		
		string volume_str = volume_amp[i]>0?"-af \"volume="+str(volume_amp[i])+"dB\"":"";
		
		string line1 = "echo Launching "+radio;
		string line2 = "while true;do "+ffmpeg_path+" -loglevel warning -i "+urls[i]+" -c:a libfdk_aac -ac 1 -ar 48000 -b:a 96k "+volume_str+" -flags:a +global_header -vn -f flv - -c:a libfdk_aac -ac 1 -ar 22050 -b:a 32k "+volume_str+" -vn -f flv rtmp://127.0.0.1:1935/live/"+radio+"_low|"+ffmpeg_path+" -loglevel warning -i - -c copy -f flv rtmp://127.0.0.1:1935/live/"+radio+" -c copy -f rtp rtp://127.0.0.1:"+str(port)+"; sleep 60; done";
		
		gensdp(radio,port);
		
		string path = "pullstreams/"+filename;
		ofstream myfile(path.c_str());
		myfile << line1+"\n";
		myfile << line2+"\n";
		myfile.close();
		string chmod = "chmod 777 "+path;
		system(chmod.c_str());
		
		port+=10;		
	}
}

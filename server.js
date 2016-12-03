var express=require("express");
var app=express();
var requestify=require("requestify");

var toCrawl=[];
var crawled={};

var urlRegex=new RegExp(/<a href="http(s)?:\/\/([^"]*)"\s*(target="_blank")?>(.*?)<\/a>/g);

function crawling(url){
	if(url in crawled){
		console.log("no");
	}else{
		requestify.get(url).then(function(response) {
			var matches;
			while(matches=urlRegex.exec(response.body)){
				console.log(matches[2]);
			}
		});
	}
}

crawling("http://localbyteout.com");

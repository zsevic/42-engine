var express=require("express");
var app=express();
var requestify=require("requestify");


var toCrawl=["http://localbyteout.com"];
var crawled={};

var urlRegex=new RegExp(/<a href="(http(s)?:\/\/)?([^"]*)"\s*(target="_blank")?>(.*?)<\/a>/g);

function crawling(url){
	if(url in crawled){
		console.log("no");
	}else{
		requestify.get(url).then(function(response) {
			var matches;
			while(matches=urlRegex.exec(response.body)){
				toCrawl.push(matches[3]);
				console.log(matches[3]);
			}
			crawled[toCrawl.shift()]=true;
		});
	}
}

crawling(toCrawl[0]);

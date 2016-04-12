$(document).ready(function() {

    var template = _.template($("#template").html());
    $("body").html(template());
    $(".bg").css("height",$(window).height());

    var wxopenid=getUrlParam("wxopenid"),
        wxaccess_token=getUrlParam("wxaccess_token"),
        uid=getUrlParam("uid")
        userInfo={};
    getRealINfo();
    //if(uid){
    //    getScore();
    //}

    $(".page3 .above .goPerson").click(function(){
        window.location.href="personaldata.html?uid="+uid+"&wxopenid="+wxopenid+"&wxaccess_token="+wxaccess_token;
    });
    $(".page3 .button .earn").click(function(){
        showMyToast("您的产品编码未授权使用该功能",1000)
    });
    $(".page3 .button .buy").click(function(){
        window.location.href="http://weidian.com/?userid=876427"
    });
    $(".stage").click(function(){
        showMyToast("您的产品编码未授权使用该功能",1000)
    });

    function getRealINfo(){
        var url="http://zebra.easybird.cn/users/userdetail?userid="+uid;
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            success:function(data){
                //userInfo.id=data.id;
                userInfo.score=data.score;
                $(".page3 .above .msg .score label").text(userInfo.score);
                if(data.image.image.url){
                    userInfo.name=data.name;
                    userInfo.headimg=data.image.image.url;
                    $(".page3 .aboveBlock .above .head img").attr("src",userInfo.headimg);
                    $(".page3 .aboveBlock .above .msg .hello span").text(userInfo.name);
                }else
                    getInfo();
            },
            error:function(e){
                //showMyToast("获取用户信息失败",1000);
            }
        })
    }

    function getInfo(){
        var url="http://zebra.easybird.cn/users/sns_userinfo?access_token="+wxaccess_token+"&openid="+wxopenid;
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            success:function(data){
                userInfo.headimg = data.headimgurl;
                $(".page3 .aboveBlock .above .head img").attr("src",userInfo.headimg);
                if(!userInfo.name) {
                    userInfo.name=data.nickname;
                    $(".page3 .aboveBlock .above .msg .hello span").text(userInfo.name);
                    pushInfo();
                }

            },
            error:function(e){
                //showMyToast("获取用户信息失败",1000);
            }
        })
    }

    function pushInfo(){

        var url="http://zebra.easybird.cn/api/users/"+uid;
        $.ajax({
            url:url,
            type:"put",
            dataType:"json",
            data:{
                name:userInfo.name,
                //image:userInfo.base64,
                //image:userInfo.headimg,
            },
            success:function(data){

            },
            error:function(e){
                //showMyToast("获取用户信息失败",1000);
            }
        })
    }

    //function getScore(){
    //    var url="http://zebra.easybird.cn/users/userscore?cell="+cell;
    //    $.ajax({
    //        url:url,
    //        type:"get",
    //        dataType:"json",
    //        success:function(data){
    //            userInfo.score=data.score;
    //            $(".page3 .above .msg .score label").text(userInfo.score);
    //        },
    //        error:function(e){
    //            //showMyToast("获取用户信息失败",1000);
    //        }
    //    })
    //}


    function getUrlParam(name)//取url参数
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r!=null) return unescape(r[2]); return null; //返回参数值
    }

    function showMyToast(e,t){
        $(".err span").text(e);
        $(".err").show(100).delay(t).hide(100);
    }
})
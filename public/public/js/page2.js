$(document).ready(function() {
    var wxopenid,wxaccess_token,wxticket,wxconfig={},uid=getUrlParam("state");;

    //计算wx.config参数
    var createNonceStr = function () {
        return Math.random().toString(36).substr(2, 15);
    };

    var createTimestamp = function () {
        return parseInt(new Date().getTime() / 1000) + '';
    };

    var raw = function (args) {
        var keys = Object.keys(args);
        keys = keys.sort();
        var newArgs = {};
        keys.forEach(function (key) {
            newArgs[key.toLowerCase()] = args[key];
        });

        var string = '';
        for (var k in newArgs) {
            string += '&' + k + '=' + newArgs[k];
        }
        string = string.substr(1);
        return string;
    };

    /**
     * @synopsis 签名算法
     *
     * @param jsapiTicket 用于签名的 jsapi_ticket
     * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
     *
     * @returns
     */
    var sign = function (jsapiTicket, url) {
        var ret = {
            jsapi_ticket: jsapiTicket,
            nonceStr: createNonceStr(),
            timestamp: createTimestamp(),
            url: url
        };
        var string = raw(ret);
        //jsSHA = require('jssha');
        var shaObj = new jsSHA(string, 'TEXT');
        ret.signature = shaObj.getHash('SHA-1', 'HEX');

        return ret;
    };

    var template = _.template($("#template").html());
    $("body").html(template());

    getToken();
    getTicketToken();
    $(".bg").css("height",$(window).height());
    $(".play").click(function(){
        $(".play").hide();
        document.getElementById('video').style.display = "inline";
        document.getElementById('video').play();
    })
    var video=document.getElementById('video');
    video.addEventListener("ended",function(){
        $(".play").show();
        video.style.display = "none";
    })


    $(".share").click(function(){
        $(".page2 .click").addClass("on");
        setTimeout(function () {
            $(".page2 .click").removeClass("on")
        }, 3000);
        ;
    })



    // 获取微信token
    function getToken(){
        //alert("code="+getUrlParam("code"))
        var url="http://zebra.easybird.cn/users/sns_oauth2?code="+getUrlParam("code");
        //alert(url)
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            success:function(data){
                wxopenid=data.openid;
                wxaccess_token=data.access_token;
                putId();

            },
            error:function(e){
                //showMyToast("获取用户信息失败",1000);
            }
        })
    }

    //绑定openid
    function putId(){
        //if(!cell){
        //    $(".member").click(function(){
        //        window.location.href="page3.html?cell="+cell+"&wxopenid="+wxopenid+"&wxaccess_token="+wxaccess_token;
        //    })
        //}
        if(!uid){
            var url="http://zebra.easybird.cn/users/finduser?openid="+wxopenid;
            $.ajax({
                url:url,
                type:"get",
                dataType:"json",
                success:function(data){
                    uid=data.userid
                },
                error:function(e){
                    //showMyToast("获取用户信息失败",1000);
                    //$(".member").click(function(){
                    //    window.location.href="page3.html?cell="+cell+"&wxopenid="+wxopenid+"&wxaccess_token="+wxaccess_token;
                    //})

                }
            })
        }
        var url="http://zebra.easybird.cn/users/userbinding?openid="+wxopenid+"&userid="+uid;
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            success:function(data){

                $(".member").click(function(){
                    window.location.href="page3.html?uid="+uid+"&wxopenid="+wxopenid+"&wxaccess_token="+wxaccess_token;
                })
            },
            error:function(e){
                //showMyToast("获取用户信息失败",1000);
                //$(".member").click(function(){
                //    window.location.href="page3.html?cell="+cell+"&wxopenid="+wxopenid+"&wxaccess_token="+wxaccess_token;
                //})

            }
        })
    }

    //获取ticket所需token
    function getTicketToken(){
        var url="http://zebra.easybird.cn/users/token";
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            success:function(data){
                var gtoken=data.access_token
                getTicket(gtoken)
            },
            error:function(e){
                //showMyToast("获取用户信息失败",1000);
            }
        })
    }

    //获取wx.config所需ticket
    function getTicket(token){
        var url="http://zebra.easybird.cn/users/ticket?access_token="+token;
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            success:function(data){
                //alert("1")
                wxticket=data.ticket;
                wxconfig=sign(wxticket,window.location.href)
                wx.config({
                    debug: false,
                    appId: "wxb1c33fc9ff44c113",
                    timestamp: wxconfig.timestamp,
                    nonceStr:  wxconfig.nonceStr,
                    signature: wxconfig.signature,
                    jsApiList: [
                        // 所有要调用的 API 都要加到这个列表中
                        'onMenuShareTimeline',
                        'onMenuShareWeibo',
                        'showMenuItems',
                        'showOptionMenu',
                        'showAllNonBaseMenuItem',
                        'scanQRCode',
                    ]
                });

            },
            error:function(e){
                //showMyToast("获取用户信息失败",1000);
            }
        })
    }

    wx.ready(function(){

        //$(".share").click(function(){
            wx.onMenuShareTimeline({
                title: '斑马数据银行宣传页', // 分享标题
                link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb1c33fc9ff44c113&redirect_uri=http%3A%2F%2Fzebra.easybird.cn%2Fpage2.html&response_type=code&scope=snsapi_userinfo#wechat_redirect', // 分享链接
                imgUrl: 'http://zebra.easybird.cn/img/page1/page-1_erweima.png', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function (res) {
                    // 用户取消分享后执行的回调函数
                    //alert("分享失败")
                    //for(key in res){
                    //    alert(key+":"+res[key]);
                    //}
                }
            //});
            //wx.onMenuShareWeibo({
            //    title: '斑马数据银行', // 分享标题
            //    desc: '斑马数据银行祝您新年快乐', // 分享描述
            //    link: 'http://zebra.easybird.cn/page2.html', // 分享链接
            //    imgUrl: 'http://zebra.easybird.cn/img/page1/page-1_erweima.png', // 分享图标
            //    success: function () {
            //        // 用户确认分享后执行的回调函数
            //    },
            //    cancel: function () {
            //        // 用户取消分享后执行的回调函数
            //    }
            //});
            //wx.showAllNonBaseMenuItem();
            //wx.showOptionMenu();
            //wx.showMenuItems({
            //    menuList: [
            //        "menuItem:share:appMessage",
            //        "menuItem:share:timeline",
            //        "menuItem:share:qq",
            //        "menuItem:share:weiboApp",
            //        "menuItem:share:facebook",
            //        //"menuItem:share:QZone",
            //
            //    ] // 要显示的菜单项，所有menu项见附录3
            //});
            //wx.checkJsApi({
            //    jsApiList: [
            //        'onMenuShareTimeline',
            //        'onMenuShareWeibo',
            //        'showMenuItems',
            //        'showOptionMenu',
            //        'showAllNonBaseMenuItem',], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            //    success: function(res) {
            //        for(key in res.checkResult){
            //            alert(key+":"+res.checkResult[key]);
            //        }
            //    }
            //});
            //wx.scanQRCode({
            //    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            //    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            //    success: function (res) {
            //        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            //    }
            //});

        });

    });



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
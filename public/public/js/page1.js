$(document).ready(function() {
    var proType="",projectid,pState=0;
    //switch (getUrlParam("type")){
    //    case "1":proType="黄金曼特宁"; break;
    //    case "2":proType="哈拉尔"; break;
    //    case "3":proType="阿瑞查"; break;
    //    case "4":proType="木兰花"; break;
    //    case "5":proType="绿宝石"; break;
    //}
    projectid=getUrlParam("id");

    var template = _.template($("#template").html());
    $("body").html(template({type:proType}));
    $("body").css("height",$(window).height()+"px").css("overflow","hidden");
    window.onload=function(){
        //alert(($(window).height()-$(".page1 .aboveBlock .bg").height()-40)+"px")
        $(".page1 .underBlock .bg").css("height",($(window).height()-$(".page1 .aboveBlock .bg").height()-50)+"px");
    }
    if ($(window).width()<350){
        $(".page1 .aboveBlock .msg").css("right","5px").css("font-size", "13px");
        $(".page1 .underBlock .addr").css("top","95px");
    }

    query();

    function query(){

        var url="http://zebra.easybird.cn/serials/build_serial?serial_no="+projectid;
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            success:function(data){
                if(data.cell){
                    $("#msg").text("经过专业扫码验证，此款"+data.product+"是品牌正品。已被:"+data.cell+"用户于"+data.datetime.substring(0,4)+"年"+data.datetime.substring(5,7)+"月"+data.datetime.substring(8,10)+"日激活绑定。")
                    //pState=1;
                    //$(".midBlock").hide();
                }else{
                    $("#msg").text("经过专业扫码验证，此款"+data.product+"是品牌正品。请输入手机号绑定。")
                }

                if(data.desc=="序列号不存在"){
                    $("#msg").text("此序列号不存在！")
                }

                if (data.bgImg != "") {
                    $("#divHeader").css("background-image", data.bgColor)
                } else {
                    $("#divHeader").css("background-image", "img/page1/3.png")
                }


                if (data.logo != "") {
                    $("#divLogo").attr("src", data.logo);
                }

                if (data.stamp != "") {
                    $("#stamp").attr("src", data.stamp);
                }

                if (data.Inrto != "") {
                    $("#imgIntro").attr("src", data.Inrto);
                }

                $(".enter").click(function(){
                    toPut();
                })

            },
            error:function(e){
             //   location.reload()
            }
        })
    }

    function toPut(){

        var mobile = $.trim($(".phone").val());
        if (!mobile) {
            showMyToast("请输入手机号",1000);
            return;
        }
        if( !/^(1[3-8][0-9])\d{8}$/.test(mobile)){
            showMyToast("请输入正确的手机号",1000);
            return;
        }
        //if(pState){
        //    window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb1c33fc9ff44c113&redirect_uri=http%3A%2F%2Fzebra.easybird.cn%2Fpage2.html&response_type=code&scope=snsapi_userinfo&state="+mobile+"#wechat_redirect"
        //}
        var url="http://zebra.easybird.cn/serials/scan?cell="+mobile+"&serial_no="+projectid;
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            success:function(data){
                //window.location.href="page2.html?cell="+mobile;
                window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb1c33fc9ff44c113&redirect_uri=http%3A%2F%2Fzebra.easybird.cn%2Fpage2.html&response_type=code&scope=snsapi_userinfo&state="+data.userid+"#wechat_redirect"
            },
            error:function(e){
                showMyToast("绑定失败,请重新绑定",1000);
            }
        })
    }

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
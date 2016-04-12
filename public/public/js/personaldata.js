$(document).ready(function() {
    var template = _.template($("#template").html());
    $("body").html(template({}));

    var wxopenid=getUrlParam("wxopenid"),
        wxaccess_token=getUrlParam("wxaccess_token"),
        uid=getUrlParam("uid")
    userInfo={};
    getRealINfo();

    $(".personal .opt-list .name").click(function(){
        changeName();
    });
    $(".personal .opt-list .tel").click(function(){
        changeTel();
    });

    $(".nav .cancle").click(function(){
        cancle();
    });

    $(".nav .back").click(function(){
        //cell=$(".tel em").text();
        window.location.href="page3.html?uid="+uid+"&wxopenid="+wxopenid+"&wxaccess_token="+wxaccess_token;
    });

    $(".personal .avatar-box").click(function(){
        $(".pic-box1").show();
    });

    $(".personal .pic-box1 .cancel").click(function(){
        $(".pic-box1").hide();
    });
    $(".personal .pic-box1 .pic-black").click(function(){
        $(".pic-box1").hide();
    });

    $(".personal .pic-box1 .photos").bind("change",function(e){
        readFile(e);
    });

    $(".nav .next").click(function(){
        if($(".personal").hasClass("name-active")){
            var url="http://zebra.easybird.cn/api/users/"+uid;
            $.ajax({
                url:url,
                type:"put",
                dataType:"json",
                data:{
                    name:$(".name-box .name").val()
                },
                success:function(data){
                    cancle();
                    showMyToast("修改成功",1000)
                },
                error:function(e){
                    //showMyToast("获取用户信息失败",1000);
                }
            })
        }
        if($(".personal").hasClass("tel-active")){
            var mobile = $.trim($(".tel-box .tel").val());
            if (!mobile) {
                showMyToast("请输入手机号",1000);
                return;
            }
            if( !/^(1[3-8][0-9])\d{8}$/.test(mobile)){
                showMyToast("请输入正确的手机号",1000);
                return;
            }
            var url="http://zebra.easybird.cn/users/userbinding?userid="+uid+"&cell="+mobile;
            $.ajax({
                url:url,
                type:"get",
                dataType:"json",
                success:function(data){
                    cell=mobile;
                    cancle();
                    showMyToast("修改成功",1000)
                },
                error:function(e){

                }
            })
        }
     });

    function cancle(){
        $(".nav").removeClass("change");
        $(".personal").removeClass("name-active").removeClass("tel-active");
        $(".nav h1").text("个人信息")
        getRealINfo();
    }

    function getRealINfo(){
        var url="http://zebra.easybird.cn/users/userdetail?userid="+uid;
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            success:function(data){
                //userInfo.id=data.id;
                userInfo.name=data.name;
                userInfo.headimg=data.image.image.url;
                userInfo.cell=data.cell;
                if(userInfo.headimg){
                    $(".avatar").attr("src",userInfo.headimg);
                }else getwxHead();
                $(".opt-list .name em").text(userInfo.name);
                $(".name-box .name").val(userInfo.name);
                $(".opt-list .tel em").text(userInfo.cell);
                $(".tel-box .tel").val(userInfo.cell);
            },
            error:function(e){
                //showMyToast("获取用户信息失败",1000);
            }
        })
    }

    function getwxHead(){
        var url="http://zebra.easybird.cn/users/sns_userinfo?access_token="+wxaccess_token+"&openid="+wxopenid;
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            success:function(data){
                userInfo.headimg = data.headimgurl;
                $(".avatar").attr("src",userInfo.headimg);
            },
            error:function(e){
                //showMyToast("获取用户信息失败",1000);
            }
        })
    }

    function readFile(e){
        //var file = e.currentTarget.files[0];
        //
        //var mpImg = new MegaPixImage(file),
        //    _canvas=document.getElementById("g_canvas");
        //var _max = 320;
        //mpImg.render(_canvas, {
        //    maxHeight: _max
        //},function(){
        //    var  src = _canvas.toDataURL("image/jpeg");
        //    $('#picture')[0].src = src;
        //    uploadPicture(src.substring(src.lastIndexOf(";")+8));
        //})
        var file = e.currentTarget.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            $('#picture')[0].src = this.result;

            uploadPicture(this.result.substring(this.result.lastIndexOf(";")+8));
        }
    }

    function uploadPicture(src){
        var url="http://zebra.easybird.cn/api/users/"+uid;
        $.ajax({
            url:url,
            type:"put",
            dataType:"json",
            data:{
                image:'data:image/jpeg;base64,' + src
            },
            success:function(data){
                $(".pic-box1").hide();
                cancle();
                showMyToast("修改成功",1000)
            },
            error:function(e){
                $(".pic-box1").hide();
                showMyToast("上传失败，请重试",2000);
            }
        })
    }

    function changeName(){
        $(".nav").addClass("change");
        $(".personal").addClass("name-active");
        $(".nav h1").text("名称")
    }

    function changeTel(){
        $(".nav").addClass("change");
        $(".personal").addClass("tel-active");
        $(".nav h1").text("手机号码")
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
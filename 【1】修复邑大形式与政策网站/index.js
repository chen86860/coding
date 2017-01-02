/*
 五邑大学形式与政策登陆页(http://jpkc.wyu.edu.cn/xsyzc/stlogon/index.html)修复

1.重构代码，修复浏览器兼容性问题，能在Chrome,Firefox,Safari测试通过
2.解决复制限制

*/

var myID = "6221";
var lPath = "http://jwc.wyu.cn/logonuser/";
var bPage = "st_logon.asp";
var iCode = "code.asp";
var pPage = "st_login.asp";

loadlogon();

function chkLogonForm() {
    var login_form = {};
    login_form.u = document.getElementsByName("u")[0];
    login_form.p = document.getElementsByName("p")[0];
    login_form.v = document.getElementsByName("v")[0];
    login_form.elements = document.getElementsByTagName("input");
    if (login_form.u.value == "") {
        alert("请输入学号！");
        login_form.u.focus();
        return false;
    }
    if (login_form.u.value.length > 10 || login_form.u.value.length < 8) {
        alert("请输入正确的学号！");
        login_form.u.focus();
        return false;
    }
    if (login_form.p.value == "") {
        alert("请输入密码！");
        login_form.p.focus();
        return false;
    }
    if (login_form.v.value.length != 4) {
        alert("请输入验证码！");
        login_form.v.focus();
        return false;
    }
    var pStr = "";
    var nm = "";
    var vl = "";
    for (var i = 0; i < login_form.elements.length; i++) {
        nm = login_form.elements[i].name;
        vl = login_form.elements[i].value;
        if (i > 0) pStr = pStr + "@@";
        pStr = pStr + nm + "~~" + escape(vl);
    }
    var rsp = postHttp(lPath + pPage, pStr); //lPath+pPage="http://jwc.wyu.cn/logonuser/st_login.asp";
    if (rsp != "Error") {
        var obj = document.getElementById("stlogon");
        obj.innerHTML = '<form  name="myloginform" action="mylogon.asp" method="post"><input type="hidden" name="vd" value=""></form>';
        var my_form = document.getElementsByName("myloginform")[0];
        document.getElementsByName("vd")[0].value = rsp;
        my_form.submit();
        return true;
    } else {
        alert("登录错误！");
        login_form.v.value = "";
        loadImg();
        return false;
    }
}

function loadImg() {
    var vcd = document.getElementById("vcode").value;
    var img = document.getElementById("imgVerify");
    img.src = lPath + iCode + "?v=" + vcd;
    var idd = document.getElementsByName("id")[0];
    idd.value = myID;
}

function loadlogon() {
    var lgUrl = lPath + bPage;
    var rsp = rspHttp(lgUrl);
    if (rsp.slice(1, 6) == "table") {
        var obj = document.getElementById("stlogon");
        obj.innerHTML = rsp;
        loadImg();
    }
}

function rspHttp(nUrl) {
    var my_url = "getpage.asp?url=" + escape(nUrl);
    var xmldoc = (window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject("Microsoft.XMLHTTP"));
    xmldoc.open("POST", my_url, false);
    xmldoc.send();
    return unescape(xmldoc.responseText);
}

function postHttp(nUrl, postData) {
    var my_url = "postpage.asp?url=" + escape(nUrl) + "::::" + postData;
    var xmldoc = (window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject("Microsoft.XMLHTTP"));
    xmldoc.open("POST", my_url, false);
    xmldoc.send();
    return unescape(xmldoc.responseText);
}


/*
	解决右键复制限制
*/

// var frame
// try {
//     if (!document.getElementById("main")) {
//         frame = document.getElementById("main")
//     } else {
//         frame = window.frames["main"]
//     }
//     frame.contentWindow.document.body.onselectstart = ""
//     frame.contentWindow.document.body.oncontextmenu = ""
// } catch (e) {
//     console.log("Something error happened...")
// }

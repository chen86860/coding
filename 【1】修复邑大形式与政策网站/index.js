var myID = "6221";
var lPath = "http://jwc.wyu.cn/logonuser/";
var bPage = "st_logon.asp";
var iCode = "code.asp";
var pPage = "st_login.asp";


loadlogon()

function loadlogon() {
    var lgUrl = lPath + bPage,
        rsp = rspHttp(lgUrl);
    if (rsp.slice(1, 6) == "table") {
        var obj = document.getElementById("stlogon");
        obj.innerHTML = rsp;
        loadImg();
    }
}

function loadImg() {
    var vcd = document.getElementById("vcode").value;
    var img = document.getElementById("imgVerify");
    img.src = lPath + iCode + "?v=" + vcd;
    var idd = document.getElementsByName("id")[0];
    idd.value = myID;
}


function chkLogonForm() {
    var stlogon = document.getElementById("stlogon"),
        login_form = stlogon.getElementsByTagName("input"),
        login_u = document.getElementById("u"),
        login_p = document.getElementById("p"),
        login_v = document.getElementById("v"),
        pStr = "",
        nm = "",
        vl = "",
        rsp;

    if (!login_u.value) {
        alert("请输入学号！");
        login_u.focus();
        return false;
    }
    if (login_u.value.length > 10 || login_u.value.length < 8) {
        alert("请输入正确的学号！");
        login_u.focus();
        return false;
    }
    if (!login_p.value) {
        alert("请输入密码！");
        login_p.focus();
        return false;
    }
    if (login_v.value.length != 4) {
        alert("请输入验证码！");
        login_v.focus();
        return false;
    }

    for (var i = 0; i < login_form.length; i++) {
        nm = login_form[i].name;
        vl = login_form[i].value;
        if (i > 0)
            pStr = pStr + "@@";
        pStr = pStr + nm + "~~" + escape(vl);
    }

    rsp = postHttp(lPath + pPage, pStr);

    if (rsp != "Error") {
        var obj = document.getElementById("stlogon");
        obj.innerHTML = '<form  name="myloginform" action="mylogon.asp" method="post"><input type="hidden" name="vd" value=""></form>';
        var my_form = document.getElementsByName("myloginform")[0],
            vd = document.getElementsByName("vd")[0];
        vd.value = rsp;
        my_form.submit();
        return true;
    } else {
        alert("登录错误！");
        login_v.value = "";
        loadImg();
        return false;
    }
}

function rspHttp(nUrl) {
    var my_url = "getpage.asp?url=" + nUrl,
        xmldoc = createXMLHttp();
    xmldoc.open("POST", my_url, false);
    xmldoc.send();
    return unescape(xmldoc.responseText);
}

function postHttp(nUrl, postData) {
    var my_url = "postpage.asp?url=" + escape(nUrl) + "::::" + postData,
        xmldoc = createXMLHttp();
    xmldoc.open("POST", my_url, false);
    xmldoc.send();
    return unescape(xmldoc.responseText);
}

//兼容多种浏览器的XMLHTTP
function createXMLHttp() {
    var XmlHttp;
    if (window.ActiveXObject) {
        var arr = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0", "ML2.XMLHttp .3 .0 ", "MSXML2.XMLHttp ", "Microsoft.XMLHttp "];
        for (var i = 0; i < arr.length; i++) {
            try {
                XmlHttp = new ActiveXObject(arr[i]);
                return XmlHttp;
            } catch (error) {}
        }
    } else {
        try {
            XmlHttp = new XMLHttpRequest();
            return XmlHttp;
        } catch (otherError) {

        }
    }
}

window.addEventListener("keyup", function(e) {
    if (e.keyCode == 13) {
        chkLogonForm()
    }
}, false);

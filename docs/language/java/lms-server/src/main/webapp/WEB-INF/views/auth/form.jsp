<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    trimDirectiveWhitespaces="true"%>


<h1>로그인(JSP + EL + JSTL)</h1>
<form action='login' method='post'>
이메일: <input name='email' type='email' value='${email}'>
<input type='checkbox' name='saveEmail'> 이메일 저장해두기<br>
암호: <input name='password' type='password'><br>
<button>로그인</button>
<fb:login-button scope="public_profile,email" onlogin="checkLoginState();">
</fb:login-button>
</form>

<script type="text/javascript">
// 로그인 성공한 후 서버에 자동으로 로그인 하기
// => 페이스북으로부터 사용자 정보 가져오기
function autoServerLogin(accessToken) {
    location.href = "login09.jsp?accessToken=" + accessToken;
}

function checkLoginState() {
    FB.getLoginStatus(function(response) { 
        if (response.status === 'connected') { // 로그인이 정상적으로 되었을 때,
            requestAutoLogin(response.authResponse.accessToken);
        
        } else { // 로그인이 되지 않았을 때,
            console.log("로그인 취소");
        }
    });
}

function requestAutoLogin(accessToken) {
	location.href = "facebookLogin?accessToken="+accessToken;
}


window.fbAsyncInit = function() {
  console.log("window.fbAsyncInit() 호출됨!");
  FB.init({
    appId      : '3021999004552650', // 개발자가 등록한 앱 ID
    cookie     : true,  
    xfbml      : true,  
    version    : 'v7.0' 
  });
  FB.AppEvents.logPageView();
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


</script>
    
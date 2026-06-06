<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<title>Bitcamp-LMS</title>
<link rel='stylesheet' href='${pageContext.getServletContext().getContextPath()}/node_modules/bootstrap/dist/css/bootstrap.min.css'>
<style>
body {
  background-color: LightGray;
}
div.container {
  background: white;
  border: 1px solid gray;
  width: 600px;
}
</style>
</head>
<body>
<tiles:insertAttribute name="header" />

<div class="container">
<tiles:insertAttribute name="body" />
</div>

<tiles:insertAttribute name="footer" />
<script>
const windowWidth = window.innerWidth;
document.getElementsByClassName("container")[0].setAttribute("style", "min-width:"+windowWidth+"px;");
</script>
</body>
</html>
    
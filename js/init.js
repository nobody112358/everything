//init.js
MAGIC_SEPARATOR = 'c~`~`~a';


function getitemfromserver(index) {
	var xmlhttp;
	if (window.XMLHttpRequest) {
	  xmlhttp=new XMLHttpRequest();
	}
	else {
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
	    alert(xmlhttp.responseText);
	  }
	}
	xmlhttp.open("GET","/cgi-bin/getitem.py?id=" + index, true);
	xmlhttp.send();
}
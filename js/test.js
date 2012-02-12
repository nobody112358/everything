//test.js

items = []

/////DEBUG
x = {id: '0',
	   mail_to: "Jim",
		title: "Lunch Tomorrow",
		content: "Jim,\n\nWhat do you think about lunch tomorrow?\n\nDave"
};
items.push(x);

x1 = {id: '1',
		contact_email: "jim_nobody@example.com",
		is_contact: true,
		contact_phone: "(123) 456-7890",
		title: "Person: Jim Nobody",
		content: "Jim Nobody\n(123) 456-7890\njim_nobody@example.com"
};
items.push(x1);
/////END DEBUG

function ge(id) { return document.getElementById(id); }


function not_a_contact() {
	items[parseInt(ge('index').value)].is_contact = false;
	items[parseInt(ge('index').value)].user_says_is_contact = false;
	ontextchange();
}

function not_a_note() {}

function not_a_email() {
	items[parseInt(ge('index').value)].is_email = false;
	items[parseInt(ge('index').value)].user_says_is_email = false;
	ontextchange();
}

function get_type_html(n, img_url) {
	h = "<span class='type'><img src='" + img_url + "' alt='" + n + "' />";
	h += "<ul><li onclick='not_a_" + n.toLowerCase() + "(); this.style.display = \"none\";'>This item is not a " + n.toLowerCase() + "</li></ul></span>";
	return h;
}

function gethtmlforitem(item) {
	h = '<ul class="nav">' + get_type_html('Note', '/img/note_arrow.png');
	if (item.is_contact == true) h += get_type_html('Contact', '/img/contact_arrow.png');
	if (item.is_email == true) h += get_type_html('Email', '/img/email_arrow.png');
	h += '</ul><br />';
	possible_fields = [item.title, 
							 item.mail_to,
							 item.mail_cc, 
							 item.mail_bcc, 
							 item.contact_phone, 
							 item.contact_email, 
							 item.contact_address]
	field_names = ['Title',
						'To',
						'Send copy to',
						'Send invisible copy to',
						'Phone',
						'Email',
						'Address']
	for (i = 0; i < possible_fields.length; i++) {
		f = possible_fields[i];
		if (f == null) continue;
		n = field_names[i];
		h += '<span class="field">' + n + ': ' + f + '</span><br />';
	}
	h += '<div class="wrap"><textarea onKeyUp="ontextchange();" id="current_item_content">' + 
				item.content + '</textarea></div>';
	return h;
}

function viewitem(index) {
	ge("index").value = index;
	item = items[index];
	html = gethtmlforitem(item);
	ge('itemdetails').innerHTML = html;
}

function newitem() {
	item = {
		title: "Untitled item",
		content: ""
	}
	items.push(item);
	viewitem(items.length - 1);
	refreshitems();
}

function setselected(index) {
	l = ge("itemslist").getElementsByTagName("span");
	for (i = 0; i < l; i++) {
		if (i == index) {
			l[i].setAttribute('data-selected', true);
			continue;
		}
		l[i].setAttribute('data-selected', false);
		alert(l[i]);
	}
}

function refreshitems() {
	ge('itemslist').innerHTML = '';
	for (i = 0; i < items.length; i++) {
		ge('itemslist').innerHTML += '<span onclick="viewitem(' + i + '); setselected(' + i + ');">' + items[i].title + '</span>';
	}
}

function ontextchange() {
	handleall();
	x = getcaretposition(ge('current_item_content'));
	items[parseInt(ge('index').value)].content = ge('current_item_content').value;
	viewitem(parseInt(ge("index").value));
	setcaretposition(ge('current_item_content'), x);
}
function init() {
	refreshitems();
}

////////////////////////handle_* functions////////////////////////////
function handleall() {
	handle_email();
	handle_contact();
}

function handle_email() {
	item = items[parseInt(ge("index").value)]
	t = ge('current_item_content').value;
	lines = t.split('\n');
	if (lines[0].endswith(',') & lines[0].split(' ').length <= 2) {
		//Dave,
		name = lines[0].replace(',', '');
		item.mail_to = name;
		if (!(item.user_says_is_email == false)) item.is_email = true;
	}
	else {
		item.mail_to = null;
		if (item.user_says_is_email != true) item.is_email = false;
	}
}

function handle_contact() {
	item = items[parseInt(ge('index').value)];
	p = has_phone(ge('current_item_content').value);
	if (p) {
		item.contact_phone = p;
		if (!(item.user_says_is_contact == false)) item.is_contact = true;
	}
	e = has_email(ge('current_item_content').value);
	if (e) {
		item.contact_email = e;
		if (item.user_says_is_contact != true) items.is_contact = true;
	}
	if (!item.user_says_is_contact) item.is_contact = false;
}

function has_phone(text) {
	lines = text.split('\n');
	words = []
	for (i = 0; i < lines.length; i++) {
		l = lines[i].split(' ');
		for (e = 0; e < l.length; e++) {
			words.push(l[e]);
		}
	}
	for (i = 0; i < words.length; i++) {
		if (words[i].match(/^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/))
			return words[i];
		if (i > 0 && (words[i - 1] + words[i]).match(/^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/)) {
			return words[i];
		}
	}
	return false;
}

function has_email(text) {
	lines = text.split('\n');
	words = []
	for (i = 0; i < lines.length; i++) {
		l = lines[i].split(' ');
		for (e = 0; e < l.length; e++) {
			words.push(l[e]);
		}
	}
	emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
	for (i = 0; i < words.length; i++) {
		if (emailPattern.test(words[i]))
			return words[i];
	}
	return false;
}


function saveitem(index) {
	item = items[index];
	f = document.createElement('iframe');
	document.body.appendChild(f);
	possible_fields = [item.id,
							 item.title, 
							 item.mail_to,
							 item.mail_cc, 
							 item.mail_bcc, 
							 item.contact_phone, 
							 item.contact_email, 
							 item.contact_address];
	possible_fields_names = ['id',
									 'title',
									 'mail_to',
									 'mail_cc',
									 'mail_bcc',
									 'contact_phone',
									 'contact_email',
									 'contact_address'];
	c = ''
	for (i = 0; i < possible_fields.length; i++) {
		p = possible_fields[i];
		if (p == null) continue;
		c += '\n' + possible_fields_names[i] + ': ' + p;
	}
	h = '<form action="/cgi-bin/save.py" method="POST"><input name="id" value="' + item.id + '" />';
	h += '<textarea name="content">' + c + '\n' + MAGIC_SEPARATOR + '\n' + item.content + '</textarea><input type="submit" value="submit" /></form>';
	f.contentWindow.document.body.innerHTML = h;
	f.contentWindow.document.forms[0].submit();
}

////////////////////LIBRARY FUNCTIONS////////////////////////////////////
function getcaretposition (ctrl) {
	var CaretPos = 0;	// IE Support
	if (document.selection) {
	ctrl.focus ();
		var Sel = document.selection.createRange ();
		Sel.moveStart ('character', -ctrl.value.length);
		CaretPos = Sel.text.length;
	}
	// Firefox support
	else if (ctrl.selectionStart || ctrl.selectionStart == '0')
		CaretPos = ctrl.selectionStart;
	return (CaretPos);
}
function setcaretposition(ctrl, pos){
	if(ctrl.setSelectionRange)
	{
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}

String.prototype.endswith = function(str) {
	return (this.match(str+"$")==str)
}

String.prototype.endsWith = function(str) {
	return (this.match(str+"$")==str)
}
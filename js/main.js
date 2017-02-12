
var portrait
var imagesLoaded = false
function updatePortraitState() { // определяем, что юзер со смартфона

	portrait = window.innerWidth * 0.8 <= window.innerHeight
	document.body.classList.toggle('portrait', portrait);
	get("wtfscript").style.display = "none"
}
window.onresize = updatePortraitState
updatePortraitState();

// держим сплэш, пока не загрузятся большие картинки
function imgOnLoad() {
	imgLimit--
	if (imgLimit == 0)
		$(document).ready(function() { // после загрузки DOM
			$('#gform-jquery-window').submit(submitForm);
			$('#gform-jquery-top').submit(submitForm);
			$('#gform-jquery-bottom').submit(submitForm);

			get("splash").style.display = "none"
		});
}

var imgs = [ "img/3.jpg", "img/9.jpg", "img/good_blur.jpg" ]
var imgLimit = imgs.length;
for (var i = 0; i < imgLimit; i++) {
	var img = new Image()
	img.src = imgs[i]
	img.onload = imgOnLoad
}


function submitForm(e) { // да да я скопипастил эту функцию и чо.
	e.preventDefault(); // выключаем стандартное действие отправки
	var form = $(this); // запомним форму в переменной

	// добавим небольшую секцию проверки на заполненность
	var errors = false; // сначала ошибок нет
	form.find('.req').each(function(){ // пройдем по каждому полю с классом .req в форме
		var input = $(this)
		input.removeClass('error'); // сначала уберем у него класс с ошибкой, на случай если он там есть
		if (input.val() == '') { // если оно пустое
			input.addClass('error'); // добавим к нему класс с ошибкой
			errors = true; // найдена ошибка
		}
	});
	if (errors)
		return false; // если есть ошибка то больше ничего не делаем

	var data = form.serialize(); // сериализуем данные формы в строку для отправки, обратите внимание что атрибуты name у полей полностью сопдают с нэймами у полей самой гугл формы

	$.ajax({ // инициализируем аякс
        url: form[0].action, // слать надо сюда, строку с буковками надо заменить на вашу, это атрибут action формы
        data: data, // данные  которые мы сериализовали
        type: "POST", // постом
        dataType: "xml", // ответ ждем в формате xml
        beforeSend: function(){ // перед отправкой
        	form.find('button').attr('disabled'); // отключим кнопку
        },
        statusCode: { // после того как пришел ответ от сервера
            0: showSuccess(form),
            200: showSuccess(form)
        }
	});
	if (form[0].id == "gform-jquery-window")
		setTimeout("showWindow(false)", 2000)

}

function showSuccess(form) {
	form[0].style.display = "none"
	var type = form.attr("type")
	clog("TYPE "+type)
	get("form-sent-"+type).style.display = "block"

    var inputs = form[0].getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++)
    	if (inputs[i].type != "hidden")
			inputs[i].value = ""
}

function showWindow(show, type="") {
	get("input_balls_type").value = show ? type : ""
	var w = get("window")
	w.style.top = show ? "20%" : "-100%"

	parallax.style.filter = show ? "blur(10px)" : "none"

	if (show) {
		get("gform-jquery-window").style.display = "block"
		get("form-sent-window").style.display = "none"
	}
}

/* навигация по сайту */
var parallax = get("parallax")
var targetTop = 0
var anim = false
function moveTo(n) {
	showMenu(false)
	if (n == 4) n += 0.5

	targetTop = parallax.offsetHeight * n
	if (!anim){
		anim = true
		move()
	}
}
function move() {
	left = targetTop - parallax.scrollTop
	var dif = ceil(left / 10)
	parallax.scrollTop = parallax.scrollTop + dif
	left -= dif

	if (parallax.scrollTop != targetTop && left != 0)
		setTimeout("move()", 20)
	else
		anim = false
}

/* скрытие/отображение навбара */
var lastScrollTop = 0
function scroll() {
	var curScrollTop = parallax.scrollTop
	var dif = curScrollTop - lastScrollTop

	/*if (curScrollTop < bar.offsetHeight)
		showNavbar(true)
	else if (!portrait)
		showNavbar(false)
	else if (Math.abs(dif) > 3)
		showNavbar(dif < 0)
	ну не знаю, по-моему оч удобно было*/
	if (portrait)
		showNavbar(dif < 0)

	lastScrollTop = curScrollTop
}

/* скрытие/отображение меню */
var bar = get("navbar")
bar.style.top = "0px" // иначе сначала резко исчезает
function showNavbar(show) {
	if (menu.showen) return
	show |= lastScrollTop < bar.offsetHeight
	bar.style.top = show ? "0px" : -bar.offsetHeight+"px"
	bar.showen = true
}

var menu = get("menu")
menu.showen = false
function showMenu(show) {
	var on = bar.offsetHeight+px
	var off = -(menu.offsetHeight+32)+px

	if (show == undefined)
		show = menu.style.top == off || menu.style.top == ""
	menu.style.top = show ? on : off

	menu.showen = menu.style.top == on
}

get("navbarghost").style.height = bar.clientHeight + px

var body = document.getElementsByTagName("body")[0]
body.insertAdjacentHTML("beforeend", "<center>&copy; Нестеров Я. В., оформление сайта, 2017</center>")
var wait = false
function onBodyScroll() {
	if (!wait) {
		setTimeout("hideRight()", 2000)
		wait = true
	}
}
function hideRight() {
	if (window.pageYOffset > 0) {
		window.scrollTo(window.pageXOffset, window.pageYOffset-window.pageYOffset/10)
		setTimeout("hideRight()", 30)
	} else
		wait = false
}
body.onscroll = onBodyScroll

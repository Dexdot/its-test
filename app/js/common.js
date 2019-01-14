// Подписываемся на событие goToSlide
PubSub.subscribe('goToSlide', function(msg, data) {

	var tl = new TimelineMax(),
			currentSlide = document.querySelector('[data-slide="' + data.from + '"]'),
			newSlide = document.querySelector('[data-slide="' + data.to + '"]');
			newStaggers = newSlide.children;
	tl
		.to(currentSlide, 1, {y: '-100%', opacity: 0})
		.fromTo(newSlide, 1, {y: '100%', opacity: 0}, {y: '0%', opacity: 1}, 0);

	// Деактивирует все кнопки пагинации
	removeClass(document.querySelectorAll('.pagination a'), 'is-active');

	// Скрывает предыдущий слайд
	currentSlide.classList.remove('is-active');

	// Показывает новый слайд
	newSlide.classList.add('is-active');

	// Активирует новую нопку пагинации
	document.querySelector('[data-gotoslide="' + data.to + '"]').classList.add('is-active');
});


function Paginator() {
	// События скролла и клика
	this.scrollEvents();
	this.clickEvents();

	this.activeSlide = 1;
	this.canGo = 1;
	this.delay = 1300;

	// Макс. кол-во секций
	this.max = document.querySelector('.sections').children.length;
}

// Событие скролла
Paginator.prototype.scrollEvents = function() {
	var self = this;

	// При прокрутке колеса в окне обрабатываем событие
	window.addEventListener('wheel', function(e) {

		if (!self.canGo) return;

		// -1: скролл вверх, 1: скролл вниз
		var direction = e.deltaY > 0 ? 1 : -1,
				newSlide = self.activeSlide + direction;

		// Задаем границы
		if (newSlide > self.max || newSlide < 1) return;

		self.canGo = false;

		// Публикуем событие goToSlide
		PubSub.publish('goToSlide', {from: self.activeSlide, to: newSlide});

		// Переопределяем активный слайд
		self.activeSlide = newSlide;


		setTimeout(function() {
			self.canGo = true;
		}, self.delay);

	});

};

Paginator.prototype.clickEvents = function() {
	var self = this,
			paginationButtons = document.querySelectorAll('.pagination a');

	// Обрабратываем клики по кнопкам пагинации
	document.querySelector('.pagination').addEventListener('click', function(e) {
		e.preventDefault();

		if (!self.canGo) return;

		// Если кликнули не по кнопке, то выходим
		if (!(e.target.dataset.gotoslide)) return;

		// Номер след. слайда
		var newSlide = parseInt(e.target.dataset.gotoslide, 10);

		if (newSlide !== self.activeSlide) {


			self.canGo = false;
			// Публикуем событие goToSlide
			PubSub.publish('goToSlide', {from: self.activeSlide, to: newSlide});

			// Переопределяем активный слайд
			self.activeSlide = newSlide;

			setTimeout(function() {
				self.canGo = true;
			}, self.delay);
		}
	});

};


// Удаляет класс элементам массива
function removeClass(arr, className) {
	for (var i = 0; i < arr.length; i++) {
		arr[i].classList.remove(className);
	}
}


var tl = new TimelineMax(),
		p = new Paginator(),

		hamburger = document.querySelector('.hamburger'),
		navMenu = document.querySelector('.header__nav'),
		navLinks = document.querySelectorAll('.header__nav li a');

hamburger.addEventListener('click', function() {
	hamburger.classList.toggle('is-active');
	navMenu.classList.toggle('is-active');
});
for (var i = 0; i < navLinks.length; i++) {
	navLinks[i].addEventListener('click', function() {
		hamburger.classList.toggle('is-active');
		navMenu.classList.toggle('is-active');
	})
}

$('.video-inner, .arc-video').vide({
  mp4: '../img/video.mp4',
  ogv: '../img/video.ogv',
  poster: '../img/video.png'
});

var logoCover = document.querySelector('.header__logo span'),
		leftCover = document.querySelector('.left-title span'),
		arcs = document.querySelector('.arcs'),
		leftButton = document.querySelector('.left-btn'),
		rightX = '-80%';
		rightY = 800;

tl
	.to('.header__logo span', 0.4, {x: 100, onComplete: hideElement, onCompleteParams:[logoCover]}, 0.5)
	.fromTo('.pagination', 0.4, {opacity: 0, scale: 0.3}, {opacity: 1, scale: 1}, '-=0.5')
	.staggerTo('.header__nav a', 1, {opacity: 1}, 0.2, '-=0.5')
	.fromTo('.left-btn', 0.8, {ease: Power3.easeIn, scale: 0}, {scale: 1, onComplete: setTransition, onCompleteParams:[leftButton]}, '-=1.5')
	.fromTo('.left-title span', 0.6, {x: '0%'}, {x: '100%', onComplete: hideElement, onCompleteParams:[leftCover]}, 0.5)

	.fromTo('.ellipse-inner', 1.4, {scale: 0}, {scale: 1}, '-=0.8')
	.fromTo('.brain', 1, {scale: 0}, {scale: 1}, '-=1.2')
	.to('.ellipse-outer', 1.4, {scale: 1}, '-=1.5')

	.fromTo('.cover', 2, {x: 0}, {x: '-50%'}, '-=1.1')
	.to('.brain', 0.6, {scale: 0}, '+=5.5')
	.to('.ellipse-inner', 1.8, {scale: 4, onStart: showElement, onStartParams:[arcs]}, '-=0.8')

	.fromTo('.arc-lg', 1, {scale: 0}, {scale: 1}, '-=1.5')
	.fromTo('.arc-md', 1, {scale: 0}, {scale: 1}, '-=1.1')
	.fromTo('.arc-video', 1, {scale: 0}, {scale: 1}, '-=0.8')

	.fromTo('.right-title', 0.9, {x: rightX}, {x: '0%'}, '-=1.7')
	.fromTo('.right-title', 0.9, {y: rightY, rotation: 25}, {y: 0, rotation: 0}, '-=1.2')

	.fromTo('.right-text', 0.9, {x: rightX}, {x: '0%'}, '-=1.5')
	.fromTo('.right-text', 0.9, {y: rightY, rotation: 25}, {y: 0, rotation: 0}, '-=1')

	.fromTo('.right-btn', 0.9, {x: rightX}, {x: '0%'}, '-=1.2')
	.fromTo('.right-btn', 0.9, {y: rightY, rotation: 25}, {y: 0, rotation: 0}, '-=0.7');


function hideElement(elem) {
	elem.classList.add('hidden');
}
function showElement(elem) {
	elem.classList.remove('hidden');
}

function setTransition(elem) {
	elem.classList.add('transition');
}

console.log('Es6');

class Carousel {

  constructor(carouselObj) {
    this.carouselObj = carouselObj;
  }

  forEachElement(elements, fn){
    forEachElement(elements, fn)
  }

  removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
  }

  init(set) {
    console.log(set);
    console.log(settings);
    settings = set;
    carousel = document.getElementById(settings.id);
    slides = carousel.querySelectorAll('.slide');

    carousel.className = 'active carousel';

    var ctrls = document.createElement('ul');

    ctrls.className = 'controls';
    ctrls.innerHTML = '<li>' +
        '<button type="button" class="btn-prev"><img alt="Previous Item" src="./img/chevron-left-75c7dd0b.png" /></button>' +
      '</li>' +
      '<li>' +
        '<button type="button" class="btn-next"><img alt="Next Item" src="./img/chevron-right-2f19bc8b.png" /> </button>' +
      '</li>';

    ctrls.querySelector('.btn-prev')
      .addEventListener('click', function () {
        prevSlide(true);
      });
    ctrls.querySelector('.btn-next')
      .addEventListener('click', function () {
        nextSlide(true);
      });

    carousel.appendChild(ctrls);

    if (settings.slidenav || settings.animate) {
      slidenav = document.createElement('ul');

      slidenav.className = 'slidenav';

      if (settings.animate) {
        var li = document.createElement('li');

        if (settings.startAnimated) {
          li.innerHTML = '<button data-action="stop"><span class="visuallyhidden">Stop Animation </span>￭</button>';
        } else {
          li.innerHTML = '<button data-action="start"><span class="visuallyhidden">Start Animation </span>▶</button>';
        }

        slidenav.appendChild(li);
      }

      if (settings.slidenav) {
        forEachElement(slides, function(el, i){
          var li = document.createElement('li');
          var klass = (i===0) ? 'class="current" ' : '';
          var kurrent = (i===0) ? ' <span class="visuallyhidden">(Current Item)</span>' : '';

          li.innerHTML = '<button '+ klass +'data-slide="' + i + '"><span class="visuallyhidden">News</span> ' + (i+1) + kurrent + '</button>';
          slidenav.appendChild(li);
        });
      }

      slidenav.addEventListener('click', function(event) {
        var button = event.target;
        if (button.localName == 'button') {
          if (button.getAttribute('data-slide')) {
            stopAnimation();
            setSlides(button.getAttribute('data-slide'), true);
          } else if (button.getAttribute('data-action') == "stop") {
            stopAnimation();
          } else if (button.getAttribute('data-action') == "start") {
            startAnimation();
          }
        }
      }, true);

      carousel.className = 'active carousel with-slidenav';
      carousel.appendChild(slidenav);
    }

    var liveregion = document.createElement('div');
    liveregion.setAttribute('aria-live', 'polite');
    liveregion.setAttribute('aria-atomic', 'true');
    liveregion.setAttribute('class', 'liveregion visuallyhidden');
    carousel.appendChild(liveregion);

      slides[0].parentNode.addEventListener('transitionend', function (event) {
        var slide = event.target;
        removeClass(slide, 'in-transition');
        if (hasClass(slide, 'current'))  {
          if(setFocus) {
            slide.setAttribute('tabindex', '-1');
            slide.focus();
            setFocus = false;
          }
        }
      });

      carousel.addEventListener('mouseenter', suspendAnimation);
      carousel.addEventListener('mouseleave', function(event) {
        if (animationSuspended) {
          startAnimation();
        }
      });

      carousel.addEventListener('focusin', function(event) {
        if (!hasClass(event.target, 'slide')) {
          suspendAnimation();
        }
      });
      carousel.addEventListener('focusout', function(event) {
        if (!hasClass(event.target, 'slide') && animationSuspended) {
          startAnimation();
        }
      });

    index = 0;
    setSlides(index);

     if (settings.startAnimated) {
      timer = setTimeout(nextSlide, 5000);
    }
  }

  setSlides(new_current, setFocusHere, transition, announceItemHere) {
    setFocus = typeof setFocusHere !== 'undefined' ? setFocusHere : false;
    announceItem = typeof announceItemHere !== 'undefined' ? announceItemHere : false;
    transition = typeof transition !== 'undefined' ? transition : 'none';

    new_current = parseFloat(new_current);

    var length = slides.length;
    var new_next = new_current+1;
    var new_prev = new_current-1;

    if(new_next === length) {
      new_next = 0;
    } else if(new_prev < 0) {
      new_prev = length-1;
    }

    for (var i = slides.length - 1; i >= 0; i--) {
      slides[i].className = "slide";
    }

    slides[new_next].className = 'next slide' + ((transition == 'next') ? ' in-transition' : '');
    slides[new_next].setAttribute('aria-hidden', 'true');

    slides[new_prev].className = 'prev slide' + ((transition == 'prev') ? ' in-transition' : '');
    slides[new_prev].setAttribute('aria-hidden', 'true');


    slides[new_current].className = 'current slide';
    slides[new_current].removeAttribute('aria-hidden');


    if (announceItem) {
      carousel.querySelector('.liveregion').textContent = 'Item ' + (new_current + 1) + ' of ' +   slides.length;
    }

    if(settings.slidenav) {
      var buttons = carousel.querySelectorAll('.slidenav button[data-slide]');
      for (var j = buttons.length - 1; j >= 0; j--) {
        buttons[j].className = '';
        buttons[j].innerHTML = '<span class="visuallyhidden">News</span> ' + (j+1);
      }
      buttons[new_current].className = "current";
      buttons[new_current].innerHTML = '<span class="visuallyhidden">News</span> ' + (new_current+1) + ' <span class="visuallyhidden">(Current Item)</span>';
    }

    index = new_current;

  }

  nextSlide(announceItem) {
    announceItem = typeof announceItem !== 'undefined' ? announceItem : false;

    var length = slides.length,
    new_current = index + 1;

    if(new_current === length) {
      new_current = 0;
    }

    setSlides(new_current, false, 'prev', announceItem);

    if (settings.animate) {
      timer = setTimeout(nextSlide, 5000);
    }

  }

  prevSlide(announceItem) {
    announceItem = typeof announceItem !== 'undefined' ? announceItem : false;

    var length = slides.length,
    new_current = index - 1;

    if(new_current < 0) {
      new_current = length-1;
    }

    setSlides(new_current, false, 'next', announceItem);

  }

  stopAnimation() {
    clearTimeout(timer);
    settings.animate = false;
    animationSuspended = false;
    _this = carousel.querySelector('[data-action]');
    _this.innerHTML = '<span class="visuallyhidden">Start Animation </span>▶';
    _this.setAttribute('data-action', 'start');
  }

  startAnimation() {
    settings.animate = true;
    animationSuspended = false;
    timer = setTimeout(nextSlide, 5000);
    _this = carousel.querySelector('[data-action]');
    _this.innerHTML = '<span class="visuallyhidden">Stop Animation </span>￭';
    _this.setAttribute('data-action', 'stop');
  }

  suspendAnimation() {
    if(settings.animate) {
      clearTimeout(timer);
      settings.animate = false;
      animationSuspended = true;
    }
  }

  returnCarousel() {

    return {
      init:init,
      next:nextSlide,
      prev:prevSlide,
      goto:setSlides,
      stop:stopAnimation,
      start:startAnimation
    }

  }

  setCarousel() {
    let carousel, slides, index, slidenav, settings, timer, setFocus, animationSuspended;
    settings = 123;
    console.log(settings);
    this.init(this.carouselObj);
  }

}

const carousel1 = new Carousel({
  id: 'c',
  slidenav: true,
  animate: true,
  startAnimated: true
});

console.log(carousel1);

carousel1.setCarousel();

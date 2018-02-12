console.log('Es6');

class Carousel {

  constructor() {
    var carousel = this.carousel;
    this.slides,
    this.index,
    this.slidenav,
    this.settings,
    this.timer,
    this.setFocus,
    this.animationSuspended;
    carousel = 'Hi there'
  }

  forEachElement(elements, fn){
    for (var i = 0; i < elements.length; i++)
      fn(elements[i], i);
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

  init(set,settings,carousel,slides,slidenav,index,timer,animationSuspended) {
    console.log(set);

    // Make settings available to all functions
    settings = set;
    console.log(settings);

    // Select the element and the individual slides
    carousel = document.getElementById(settings.id);
    slides = carousel.querySelectorAll('.slide');

    carousel.className = 'active carousel';

    // Create unordered list for controls, and attach click events fo previous and next slide
    var ctrls = document.createElement('ul');

    ctrls.className = 'controls';
    ctrls.innerHTML = '<li>' +
        '<button type="button" class="btn-prev"><img alt="Previous Item" src="./img/chevron-left-75c7dd0b.png" /></button>' +
      '</li>' +
      '<li>' +
        '<button type="button" class="btn-next"><img alt="Next Item" src="./img/chevron-right-2f19bc8b.png" /> </button>' +
      '</li>';

    ctrls.querySelector('.btn-prev')
      .addEventListener('click',  ()=> {
        this.prevSlide(true);
      });
    ctrls.querySelector('.btn-next')
      .addEventListener('click',  ()=> {
        this.nextSlide(true);
      });

    carousel.appendChild(ctrls);

    // If the carousel is animated or a slide navigation is requested in the settings, another unordered list that contains those elements is added. (Note that you cannot supress the navigation when it is animated.)
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
        this.forEachElement(slides, function(el, i){
          var li = document.createElement('li');
          var klass = (i===0) ? 'class="current" ' : '';
          var kurrent = (i===0) ? ' <span class="visuallyhidden">(Current Item)</span>' : '';

          li.innerHTML = '<button '+ klass +'data-slide="' + i + '"><span class="visuallyhidden">News</span> ' + (i+1) + kurrent + '</button>';
          slidenav.appendChild(li);
        });
      }

      slidenav.addEventListener('click', (event)=> {
        var button = event.target;
        if (button.localName == 'button') {
          if (button.getAttribute('data-slide')) {
            this.stopAnimation();
            this.setSlides(button.getAttribute('data-slide'), true);
          } else if (button.getAttribute('data-action') == "stop") {
            this.stopAnimation();
          } else if (button.getAttribute('data-action') == "start") {
            this.startAnimation();
          }
        }
      }, true);

      carousel.className = 'active carousel with-slidenav';
      carousel.appendChild(slidenav);
    }

    // Add a live region to announce the slide number when using the previous/next buttons
    var liveregion = document.createElement('div');
    liveregion.setAttribute('aria-live', 'polite');
    liveregion.setAttribute('aria-atomic', 'true');
    liveregion.setAttribute('class', 'liveregion visuallyhidden');
    carousel.appendChild(liveregion);

    // After the slide transitioned, remove the in-transition class, if focus should be set, set the tabindex attribute to -1 and focus the slide.
      slides[0].parentNode.addEventListener('transitionend',  (event)=> {
        var slide = event.target;
        this.removeClass(slide, 'in-transition');
        if (this.hasClass(slide, 'current'))  {
          if(setFocus) {
            slide.setAttribute('tabindex', '-1');
            slide.focus();
            setFocus = false;
          }
        }
      });

      // When the mouse enters the carousel, suspend the animation.
      carousel.addEventListener('mouseenter', this.suspendAnimation);

      // When the mouse leaves the carousel, and the animation is suspended, start the animation.
      carousel.addEventListener('mouseleave', (event)=> {
        if (animationSuspended) {
          this.startAnimation();
        }
      });

      // When the focus enters the carousel, suspend the animation
      carousel.addEventListener('focusin', (event)=> {
        if (!this.hasClass(event.target, 'slide')) {
          this.suspendAnimation();
        }
      });

      // When the focus leaves the carousel, and the animation is suspended, start the animation
      carousel.addEventListener('focusout', (event)=> {
        if (!hasClass(event.target, 'slide') && animationSuspended) {
          this.startAnimation();
        }
      });

      // Set the index (=current slide) to 0 – the first slide
      index = 0;
      console.log(carousel, slides, index, slidenav, settings, index);

      this.setSlides(index);

      // If the carousel is animated, advance to the
      // next slide after 5s
     if (settings.startAnimated) {
      timer = setTimeout(this.nextSlide, 5000);
    }
    console.log(carousel, slides, index, slidenav, settings, index);
    // return carousel, slides, index, slidenav, settings, index; won't work
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

  returnCarousel(options) {

    let carousel, slides, index, slidenav, settings, timer, setFocus, animationSuspended,announceItem;
    this.init(options,carousel,slides,index,slidenav,settings, timer, animationSuspended);

    console.log(carousel, slides, index, slidenav, settings, index);
    this.setSlides(setFocus,announceItem);

    return {
      init:this.init,
      next:this.nextSlide,
      prev:this.prevSlide,
      goto:this.setSlides,
      stop:this.stopAnimation,
      start:this.startAnimation
    }
  }

}

const carousel1 = new Carousel();

carousel1.returnCarousel({
  id: 'c',
  slidenav: true,
  animate: true,
  startAnimated: true
});

console.log(carousel1);

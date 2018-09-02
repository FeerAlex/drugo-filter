export default class Scrollbar {
  constructor(container) {

    this.container = container;
    this.containerHeight = container.offsetHeight;

    this.isDown = false;
    this.startY = null;
    this.scrollTop = null;
    this.scrollHeight = this.container.scrollHeight;
    this.scrollIter = 60;
    this.trackScrollTop = 0;

    this.init();
  }

  init() {
    if (this.scrollHeight <= this.containerHeight) return;

    this.createScroll();
    this.addListener();
  }

  addListener() {
    this.container.addEventListener('mousewheel', (e) => {
      this.scrollContainer(e);
    });

    // this.scroll.addEventListener('mousedown', (e) => {
      // this.isDown = true;
    //   this.startY = e.pageY - this.container.offsetTop;
    //   this.scrollTop = this.container.scrollTop;
    //   console.log(this.startY);
    // });

    // this.scroll.addEventListener('mouseleave', () => {
    //   this.isDown = false;
    // });

    // this.scroll.addEventListener('mouseup', () => {
    //   this.isDown = false;
    // });

    // this.scroll.addEventListener('mousemove', (e) => {
    //   if(!this.isDown) return;
    //   e.preventDefault();
    //   const y = e.pageY - this.container.offsetTop;
    //   const walk = (y - this.startY) * (this.height);
    //   this.container.scrollTop = this.scrollTop - walk;
    // });
  }

  scrollContainer(e) {
    this.scrollTop = this.container.scrollTop;
    let b = (this.scroll.offsetHeight - 80) / (this.container.scrollHeight / this.scrollIter);

    if (e.deltaY < 0) {
      this.container.scrollTop = this.scrollTop - this.scrollIter;

      if (this.scrollTrack.offsetTop > 0) {
        this.trackScrollTo(-b);
      }
    } else {
      this.container.scrollTop = this.scrollTop + this.scrollIter;

      if ((this.scrollTrack.offsetTop + this.scrollTrack.offsetHeight - this.scroll.offsetHeight) < 0) {
        this.trackScrollTo(b);
      }
    }
  }

  trackScrollTo(m) {
    this.trackScrollTop += m;
    this.scrollTrack.style.marginTop = this.trackScrollTop + 'px';
  }

  createScroll() {
    let div = document.createElement('div');

    this.scroll = div.cloneNode();
    this.scroll.classList.add('scroll');

    this.scrollTrack = div.cloneNode();
    this.scrollTrack.classList.add('scroll-track');

    this.scroll.appendChild(this.scrollTrack);
    this.container.appendChild(this.scroll);
  }
}
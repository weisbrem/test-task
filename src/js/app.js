new Swiper('.swiper', {
  direction: 'horizontal',
  loop: true,
  centeredSlides: true,

  //pagination
  pagination: {
    el: '.slider__buttons',
    clickable: true,
  },

  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    // when window width is >= 640px
    // 500: {
    //   slidesPerView: 1.5,
    //   spaceBetween: 40,
    // },
  },
});

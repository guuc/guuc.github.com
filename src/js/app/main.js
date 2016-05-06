(function ($, SmoothScroll) {

    'use strict';

    if (!$ || !SmoothScroll) {
        return;
    }

    $(document).ready(function () {

        var $window = $(window),
            $scrollableContent = $('.mdl-layout__content'),
            mdlLayout =document.querySelector('.mdl-layout'),
            lastScrollPosition = 0,
            owlNexPrevBtnClass = 'mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-color--white';

        $scrollableContent.on('scroll', function() {
            var currentScrollPosition = $(this).scrollTop();
            if(currentScrollPosition > lastScrollPosition) {
                window.scroll(0, 1000);
            } else {
                window.scroll(0, 0);
            }
            lastScrollPosition = currentScrollPosition;
        });

        $('[data-href]').on('click', function (event) {

            event.preventDefault();

            $.smoothScroll({
                scrollElement: $scrollableContent,
                scrollTarget: $('[data-scroll-target="' + $(this).data('href') + '"]'),
                speed: 800
            });

        });

        $(".owl-carousel").owlCarousel({
            items: 1,
            lazyLoad: true,
            loop: true,
            nav: true,
            dots: false,
            navText: [ '<button class="' + owlNexPrevBtnClass + '"><i class="mdi mdi-chevron-left no-margin"></i></button>',
                '<button class="' + owlNexPrevBtnClass + '"><i class="mdi mdi-chevron-right no-margin"></i></button>' ],
            navClass: [ 'owl-prev', 'owl-next']
        });

        // Do when MDL is ready
        $window.on('pageshow', function() {

            $(mdlLayout.MaterialLayout.drawer_).on('click', function() {
                mdlLayout.MaterialLayout.toggleDrawer();
            });

            scrollIndicator();

        });

        SmoothScroll({
            animationTime: 600,
            stepSize: 50
        });

    });

    function scrollIndicator() {

        var rightScroll = document.querySelector('.scrollindicator.scrollindicator--right'),
            leftScroll = document.querySelector('.scrollindicator.scrollindicator--left'),
            menuWrapper = document.querySelector('.guuc-navigation-wrapper'),
            menuBar = document.querySelector('.guuc-navigation--horizontal'),
            delta = 40;

        function updateScrollIndicator() {
            leftScroll.classList.remove('scrollindicator--disabled');
            rightScroll.classList.remove('scrollindicator--disabled');
            if (menuBar.scrollLeft <= 0) {
                leftScroll.classList.add('scrollindicator--disabled');
            }
            // 5px tolerance because browsers!
            if (menuBar.scrollLeft + menuBar.clientWidth + 5 >= menuBar.scrollWidth) {
                rightScroll.classList.add('scrollindicator--disabled');
            }
        }

        function updateScrollVisibility() {
            var menuWrapperWidth = menuWrapper.offsetWidth,
                scrollWidth = menuBar.scrollWidth;

            if(menuWrapperWidth >= scrollWidth) {
                rightScroll.classList.remove('scrollindicator--visible');
                leftScroll.classList.remove('scrollindicator--visible');
            } else {
                rightScroll.classList.add('scrollindicator--visible');
                leftScroll.classList.add('scrollindicator--visible');
                updateScrollIndicator();
            }
        }

        menuBar.addEventListener('scroll', function() {
            updateScrollIndicator();
        });

        updateScrollVisibility();
        updateScrollIndicator();

        function scrollMenuBar(delta) {
            menuBar.scrollLeft += delta;
        }

        window.addEventListener('resize', updateScrollVisibility);
        rightScroll.addEventListener('click', scrollMenuBar.bind(null, delta));
        rightScroll.addEventListener('tap', scrollMenuBar.bind(null, delta));
        leftScroll.addEventListener('click', scrollMenuBar.bind(null, -delta));
        leftScroll.addEventListener('tap', scrollMenuBar.bind(null, -delta));
    }

})(jQuery, SmoothScroll);

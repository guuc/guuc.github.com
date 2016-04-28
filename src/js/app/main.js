(function ($, SmoothScroll) {

    'use strict';

    if (!$ || !SmoothScroll) {
        return;
    }

    $(document).ready(function () {

        var $window = $(window),
            $scrollableContent = $('.mdl-layout__content'),
            mdlLayout =document.querySelector('.mdl-layout');

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
            loop: true
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

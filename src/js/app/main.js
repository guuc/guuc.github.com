(function ($, SmoothScroll) {

    'use strict';

    if (!$ || !SmoothScroll) {
        return;
    }

    $(document).ready(function () {

        var $window = $(window),
            $scrollableContent = $('.mdl-layout__content'),
            mdlLayout =document.querySelector('.mdl-layout'),
            $mdlReadyPromise = $.Deferred(function () {

            });

        $('[data-href]').on('click', function (event) {

            event.preventDefault();

            $.smoothScroll({
                scrollElement: $scrollableContent,
                scrollTarget: $('[data-scroll-target="' + $(this).data('href') + '"]'),
                speed: 800
            });

        });

        // Do when MDL is ready
        $window.on('pageshow', function() {
            $(mdlLayout.MaterialLayout.drawer_).on('click', function() {
                mdlLayout.MaterialLayout.toggleDrawer();
            });
        });

        SmoothScroll({
            animationTime: 600,
            stepSize: 50
        });

    });

})(jQuery, SmoothScroll);

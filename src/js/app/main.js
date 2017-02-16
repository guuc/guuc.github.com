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

        var owl = $(".owl-carousel");

        owl.on('initialized.owl.carousel changed.owl.carousel resized.owl.carousel', owl_carousel_page_numbers);

        owl.owlCarousel({
            items: 1,
            lazyLoad: true,
            loop: true,
            nav: true,
            dots: true,
            navText: [ '<button class="' + owlNexPrevBtnClass + '"><i class="mdi mdi-chevron-left no-margin"></i></button>',
                '<button class="' + owlNexPrevBtnClass + '"><i class="mdi mdi-chevron-right no-margin"></i></button>' ],
            navClass: [ 'owl-prev', 'owl-next']
        });

        $.extend(jQuery.fn.dataTableExt.oSort, {
            "css-time-pre": function (a) {
                var cssTime = a.split(":");

                return new Date(2000, 0, 1, 0, cssTime[0], cssTime[1])
            },
        
            "css-time-asc": function (a, b) {
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            },
        
            "css-time-desc": function (a, b) {
                return ((a < b) ? 1 : ((a > b) ? -1 : 0));
            }
        });

        $('.guuc-winners-table').DataTable({
            bAutoWidth: true,
            order: [[1, 'desc']],
            columnDefs: [{
                searchable: false,
                orderable: false,
                targets: [0]
            }, {
                type: 'css-time',
                targets: [3]
            }],
            rowCallback: function(row, data, index) {
                var info = this.api().page.info();
                var page = info.page;
                var length = info.length;
                var rowIndex = (page * length + (index +1));
                $('td:eq(0)', row).html(rowIndex);
            },
            lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, 'All']],
            oLanguage: {
                oPaginate: {
                    sNext: '<i class="mdi mdi-chevron-right no-margin" ></i>',
                    sPrevious: '<i class="mdi mdi-chevron-left no-margin" ></i>'
                },
                oInfoFiltered: ''
            }
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

    function owl_carousel_page_numbers(e) {
        var items_per_page = e.page.size;
        var display_text;
        var min_item_index;
        var max_item_index;

        if (items_per_page > 1) {
            min_item_index = e.item.index,
            max_item_index = min_item_index + items_per_page,
            display_text = (min_item_index+1) + '-' + max_item_index;
        } else {
            display_text = (e.item.index+1);
        }

        e.currentTarget.setAttribute('data-slides-count', e.page.index + 1 + ' из ' + e.item.count)
    }

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

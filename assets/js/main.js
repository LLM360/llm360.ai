/* script.js */
(function($) {

    var	$window = $(window),
        $head = $('head'),
        $body = $('body');

    // Breakpoints.
    breakpoints({
        xlarge:   [ '1281px',  '1680px' ],
        large:    [ '981px',   '1280px' ],
        medium:   [ '737px',   '980px'  ],
        small:    [ '481px',   '736px'  ],
        xsmall:   [ '361px',   '480px'  ],
        xxsmall:  [ null,      '360px'  ],
        'xlarge-to-max':    '(min-width: 1681px)',
        'small-to-xlarge':  '(min-width: 481px) and (max-width: 1680px)'
    });

    // Stops animations/transitions until the page has ...

    // ... loaded.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // ... stopped resizing.
    var resizeTimeout;

    $window.on('resize', function() {

        // Mark as resizing.
        $body.addClass('is-resizing');

        // Unmark after delay.
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(function() {
            $body.removeClass('is-resizing');
        }, 100);

    });

    // Fixes.

    // Object fit images.
    if (!browser.canUse('object-fit')
        ||	browser.name == 'safari')
        $('.image.object').each(function() {

            var $this = $(this),
                $img = $this.children('img');

            // Hide original image.
            $img.css('opacity', '0');

            // Set background.
            $this
                .css('background-image', 'url("' + $img.attr('src') + '")')
                .css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
                .css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');

        });

    // Sidebar.
    var $sidebar = $('#sidebar'),
        $sidebar_inner = $sidebar.children('.inner');

    // Inactive by default on <= large.
    breakpoints.on('<=large', function() {
        $sidebar.addClass('inactive');
    });

    breakpoints.on('>large', function() {
        $sidebar.removeClass('inactive');
    });

    // Hack: Workaround for Chrome/Android scrollbar position bug.
    if (browser.os == 'android'
        &&	browser.name == 'chrome')
        $('<style>#sidebar .inner::-webkit-scrollbar { display: none; }</style>')
            .appendTo($head);

    // Toggle.
    $('<a href="#sidebar" class="toggle"></a>')
        .appendTo($sidebar)
        .on('click', function(event) {

            // Prevent default.
            event.preventDefault();
            event.stopPropagation();

            // Toggle.
            $sidebar.toggleClass('inactive');

        });

    // Events.

    // Link clicks.
    $sidebar.on('click', 'a', function(event) {

        // >large? Bail.
        if (breakpoints.active('>large'))
            return;

        // Vars.
        var $a = $(this),
            href = $a.attr('href'),
            target = $a.attr('target');

        // Prevent default.
        event.preventDefault();
        event.stopPropagation();

        // Check URL.
        if (!href || href == '#' || href == '')
            return;

        // Hide sidebar.
        $sidebar.addClass('inactive');

        // Redirect to href.
        setTimeout(function() {

            if (target == '_blank')
                window.open(href);
            else
                window.location.href = href;

        }, 500);

    });

    // Prevent certain events inside the panel from bubbling.
    $sidebar.on('click touchend touchstart touchmove', function(event) {

        // >large? Bail.
        if (breakpoints.active('>large'))
            return;

        // Prevent propagation.
        event.stopPropagation();

    });

    // Hide panel on body click/tap.
    $body.on('click touchend', function(event) {

        // >large? Bail.
        if (breakpoints.active('>large'))
            return;

        // Deactivate.
        $sidebar.addClass('inactive');

    });

    // Scroll lock.
    // Note: If you do anything to change the height of the sidebar's content, be sure to
    // trigger 'resize.sidebar-lock' on $window so stuff doesn't get out of sync.

    $window.on('load.sidebar-lock', function() {

        var sh, wh, st;

        // Reset scroll position to 0 if it's 1.
        if ($window.scrollTop() == 1)
            $window.scrollTop(0);

        $window
            .on('scroll.sidebar-lock', function() {

                var x, y;

                // <=large? Bail.
                if (breakpoints.active('<=large')) {

                    $sidebar_inner
                        .data('locked', 0)
                        .css('position', '')
                        .css('top', '');

                    return;

                }

                // Calculate positions.
                x = Math.max(sh - wh, 0);
                y = Math.max(0, $window.scrollTop() - x);

                // Lock/unlock.
                if ($sidebar_inner.data('locked') == 1) {

                    if (y <= 0)
                        $sidebar_inner
                            .data('locked', 0)
                            .css('position', '')
                            .css('top', '');
                    else
                        $sidebar_inner
                            .css('top', -1 * x);

                }
                else {

                    if (y > 0)
                        $sidebar_inner
                            .data('locked', 1)
                            .css('position', 'fixed')
                            .css('top', -1 * x);

                }

            })
            .on('resize.sidebar-lock', function() {

                // Calculate heights.
                wh = $window.height();
                sh = $sidebar_inner.outerHeight() + 30;

                // Trigger scroll.
                $window.trigger('scroll.sidebar-lock');

            })
            .trigger('resize.sidebar-lock');

    });
    // Menu.
    var $menu = $('#menu'),
        $menu_openers = $menu.children('ul').find('.opener');

    // Openers.
    $menu_openers.each(function() {

        var $this = $(this);

        $this.on('click', function(event) {

            // Prevent default.
            event.preventDefault();

            // Toggle.
            $menu_openers.not($this).removeClass('active');
            $this.toggleClass('active');

            // Trigger resize (sidebar lock).
            $window.triggerHandler('resize.sidebar-lock');

        });

    });

    //Back to Top button
    var btn = $('#buttonToTop');

    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    });

    btn.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop:0}, '300');
    });

    //Animated Collapsibles
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    };

    // Auto Slideshow
    function goSlider(container, interval, fadeTime) { // overall slider function
        var element = container; // get the container element, turn into element var

        if(interval == null) {
            var interval = 1000; // set the interval between fades
        }
        if(fadeTime == null) {
            var fadeTime = 500; // set the fade times
        }
        slideOut(element); // begin the slideOut process


        function slideOut(element, looping) { // slideOut Functionality, fades out the current slide

            if(looping != null) { // if looping already
                $slide = element; // $slide = the next slide
            } else { // otherwise the slide to fade out is the first child of the container
                $slide = $(element).find(">:first-child");
            }

            // grab the slide, delay using interval, then fade out
            $slide
                .delay(interval)
                .fadeOut(fadeTime, slideIn);

            // once faded out, callback to SlideIn for next slide

        } // end slideOut function

        function slideIn() { // slideIn Functionality, fades in the next one
            var $nextSlide = $(this).next(); // get next slide

            if ($nextSlide.length == 0) { // if end of slides
                $firstSlide = $(this).parent().find(">:first-child"); // "next slide" return to first child of the slideshow
                $firstSlide.fadeIn(fadeTime); // fade in the original slide
                slideOut($firstSlide, true); // now run the slideOut again setting looping to true

            } else {
                // if there is a next slide
                $nextSlide.fadeIn(fadeTime); // fade it in
                slideOut($nextSlide, true); // then run the fadeOut

            } // end else
        }
    }

    $(document).ready(function() {

        goSlider('.slider', 2500, 1500); // run the slider

    }); // end doc ready
})(jQuery);

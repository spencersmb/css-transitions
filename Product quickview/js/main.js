jQuery(document).ready(function($){

  //final width --> this is the quick view image slider width
  //maxQuickWidth --> this is the max-width of the quick-view panel
  var sliderFinalWidth = 400,
      maxQuickWidth = 900;


  $('.cd-trigger').on('click', function(event){
    //grab ref to the image of the item that was clicked
    var selectedImage = $(this).parent('.cd-item').children('img'),
        selectedImageUrl = selectedImage.attr('src');

    $('body').addClass('overlay-layer');

    //open panel
    animateQuickView(selectedImage, sliderFinalWidth, maxQuickWidth, 'open');


    //update the visible slider image in the quick view panel
    //you don't need to implement/use the updateQuickView if retrieving the quick view data with ajax
    updateQuickView(selectedImageUrl);

  });

  //close the quick view panel
  $('body').on('click', function(event){
    //check what the event is
    if( $(event.target).is('.cd-close') || $(event.target).is('body.overlay-layer')){

      //close panel
      closeQuickView( sliderFinalWidth, maxQuickWidth);
    }
  });

  $(document).keyup(function(event){
    //check if user has pressed 'Esc'
    if(event.which=='27'){
      closeQuickView( sliderFinalWidth, maxQuickWidth);
    }
  });

  //quick view slider implementation
  $('.cd-quick-view').on('click', '.cd-slider-navigation a', function(){
    updateSlider($(this));
  });

  //center quick-view on window resize
  $(window).on('resize', function(){
    if($('.cd-quick-view').hasClass('is-visible')){
      window.requestAnimationFrame(resizeQuickView);
    }
  });

  function resizeQuickView(){
    //when get the width of object A and the width of object b and subtract then divide by 2 that is the new center position for left - and same for top.
    var quickViewLeft = ($(window).width() - $('.cd-quick-view').width())/2,
        quickViewTop = ($(window).height() - $('.cd-quick-view').height())/2;

    $('.cd-quick-view').css({
      "top": quickViewTop,
      "left": quickViewLeft,
    });
  }

  function updateSlider(navigation){

    var sliderConatiner = navigation.parents('.cd-slider-wrapper').find('.cd-slider');
    var  activeSlider = sliderConatiner.children('.selected').removeClass('selected');

    if ( navigation.hasClass('cd-next') ) {
      //if activeSlider is not last-child -> get next item and add class -> else get first element and      add class
      ( !activeSlider.is(':last-child') )
        ? activeSlider.next().addClass('selected')
        : sliderConatiner.children('li').eq(0).addClass('selected');

    } else {

      ( !activeSlider.is(':first-child') )
        ? activeSlider.prev().addClass('selected')
        : sliderConatiner.children('li').last().addClass('selected');
    }
  }

  function updateQuickView(imageUrl){
    //remove selected class -> find the matching src and add selected to that class
    $('.cd-quick-view .cd-slider li').removeClass('selected').find('img[src="'+ imageUrl +'"]').parent('li').addClass('selected');
  }

  function animateQuickView(image, finalWidth, maxQuickWidth, animationType){

    //store some image data (width, top position, ...)
    //store window data to calculate quick view panel position
    var parentListItem = image.parent('.cd-item'),

      //current position top
      topSelected = image.offset().top - $(window).scrollTop(),

      //current position left
      leftSelected = image.offset().left,

      //current width + height
      widthSelected = image.width(),
      heightSelected = image.height(),

      windowWidth = $(window).width(),
      windowHeight = $(window).height(),

      //windowWidth - 400/2
      //this positions the first element in the middle of the window
      finalLeft = (windowWidth - finalWidth)/2,

      //400 * imageheight/imagewidth
      //define the final height here - this calculation lets it stay proportional
      finalHeight = finalWidth * heightSelected/widthSelected,

      //top placement based on image
      //with final height place in the middle of the window
      finalTop = (windowHeight - finalHeight)/2,

      //if window with * .8 is greater than 900
      //detect window width and determin width of element
      //this basically takes 80% of the window width
      quickViewWidth = ( windowWidth * .8 < maxQuickWidth ) ? windowWidth * .8 : maxQuickWidth ,

      //adjust the new width of the container to add in content and shift left
      quickViewLeft = (windowWidth - quickViewWidth)/2;

      if(animationType === 'open'){

        parentListItem.addClass('empty-box');
        //place quick-view ontop of current selection that was clicked- then animate it
        $('.cd-quick-view').css({
          //initial selectedItems dimensions and window location
          "top": topSelected,
          "left": leftSelected,
          "width": widthSelected
        }).velocity({
          //animate the quick view: animate its width and center it in the viewport
          //during this animation, only the slider image is visible
          'top': finalTop+ 'px',
          'left': finalLeft+'px',
          'width': finalWidth+'px'
        }, 1000,[ 400, 20 ], function(){
          //animate the quick view: animate its width to the final value
          $('.cd-quick-view').addClass('animate-width').velocity({
            'left': quickViewLeft+'px',
            'width': quickViewWidth+'px'
          }, 300, 'ease' ,function(){
            //show quick view content
            $('.cd-quick-view').addClass('add-content');
          });
        }).addClass('is-visible');
      } else {
        //close
        console.log('close animation');
        $('.cd-quick-view').removeClass('add-content').velocity({
          'top': finalTop+ 'px',
          'left': finalLeft+'px',
          'width': finalWidth+'px'
        }, 300, 'ease', function(){
          $('body').removeClass('overlay-layer');
          $('.cd-quick-view').removeClass('animate-width').velocity({
            "top": topSelected,
            "left": leftSelected,
            "width": widthSelected
          }, 500, 'ease', function(){
            $('.cd-quick-view').removeClass('is-visible');
            parentListItem.removeClass('empty-box');
            });

        });

      }

  }

  function closeQuickView( finalWidth, maxQuickWidth){
    console.log('close');

    //define variables
    var close = $('.cd-close'),
      //get current slide showing
    activeSliderUrl = close.siblings('.cd-slider-wrapper').find('.selected img').attr('src'),
      selectedImage = $('.empty-box').find('img');

    //update the image in the gallery
    //and check that it has the animation class or else it means JS is disabled
    if( !$('.cd-quick-view').hasClass('velocity-animating') && $('.cd-quick-view').hasClass('add-content')) {
      //update new content
      selectedImage.attr('src', activeSliderUrl);

      //close box
      animateQuickView(selectedImage, finalWidth, maxQuickWidth, 'close');
    } else {
      //closeNoAnimation(selectedImage, finalWidth, maxQuickWidth);
    }

  }

});
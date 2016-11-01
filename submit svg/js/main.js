(function() {
    // var animatingSvg = Snap('section'),
    //     submitBtn =  animatingSvg.select('button'),
    //     loadingCircle =  animatingSvg.select('.loading-circle');
    //
    // submitBtn.click(function (evt) {
    //     evt.preventDefault();
    //     loadingCircle.addClass('spencer');
    //     console.log(animatingSvg);
    // });

    // function UIProgressButton( el, options) {
    //     this.el = el;
    //     this.options = extend( {}, this.options);
    //     extend( {}, this.options);
    //     this._init();
    // }

    var animatingSvg = Snap('#Layer_1'),
        loadingCircle = animatingSvg.select('.loading-circle'),
        loadingCircleFilled = animatingSvg.select('.loading-circle-filled');

    var button = document.querySelector('.test'),
        progressBtn = document.getElementById('progress-button');

    button.addEventListener('click', init);


    //circumf will be used to animate the loadingCircle
    var circumf = Math.PI*(loadingCircleFilled.attr('r')*2);
    //this variable will be used to store the loadingCircle animation object
    var globalAnimation;

    initLoading();

    function init() {
        //make ajax call here and set varaible to 1 or 0 depending on success
        
        progressBtn.classList.add('loading');
        loadingCircle.addClass('active');

        var strokeOffset = loadingCircleFilled.attr('stroke-dashoffset').replace('px', '');
        //animate strokeOffeset desn't work with circle element - we need to use Snap.animate() rather than loadingCircleFilled.animate()
        setTimeout(function () {

            globalAnimation = Snap.animate(strokeOffset, '0', function( value ){
                    loadingCircleFilled.attr({ 'stroke-dashoffset': value })
                }, (strokeOffset/circumf)*1500, mina.easein, function(){

                    progressBtn.classList.remove('loading');
                    progressBtn.classList.add('success');
                    initLoading();
                }
            );

        }, 500);
    }

    function initLoading() {
        loadingCircleFilled.attr({
            'stroke-dasharray': circumf+' '+circumf,
            'stroke-dashoffset': circumf
        });
    }



})();
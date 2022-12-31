$(function(){
    $('#start_btn').on('click', function() {
        var tmp =  $('#difficulty_menu');

        if(tmp.css('display') === 'none')
            tmp.slideDown(400);
        else tmp.slideUp(400);
    });

    $('#settings_btn').on('click', function(){
        location.assign('settings.html')
    });

    $("#easy").click(() => {
        location.assign('game.html' + '?diff=e');
    });

    $("#medium").click(() => {
        location.assign('game.html' + '?diff=m');
    });

    $("#hard").click(() => {
        location.assign('game.html' + '?diff=h');
    });
})
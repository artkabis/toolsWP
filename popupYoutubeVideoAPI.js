$(document).ready(function(){
    
    if($('#player').length>0){
         let player;
        window.YT.ready(function(event) {
              const onYouTubeIframeAPIReady = () =>{
                player = new YT.Player('player', {
                  height: '100%',
                  width: '100%',
                  videoId: '879vV90Z7Io',
                  events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                  }
                });
              };
              const onPlayerReady = (event) => {
                  //event.target.playVideo();
                    event.target.stopVideo();
                    event.target.seekTo(0);
                    event.target.playVideoAt(0);
                    $('#closeBtn, .modal').on('click',event.target.stopVideo());
                  };
              var done = false;
              const onPlayerStateChange = (event) => {
                  console.log('event.data == YT.PlayerState.PLAYING >>>> ',event.data,YT.PlayerState.PLAYING, 'bool : ',event.data == YT.PlayerState.PLAYING);
                if (event.data == YT.PlayerState.PLAYING && !done) {
                  done = true;
                }
              };
            onYouTubeIframeAPIReady();
            $('#closeBtn, .modal').on('click',function(me){
                player.stopVideo();
            });
        });
    }
});


/** div id player html

<div id="player"></div>

**/

$(document).ready(function(){

    $("body").on("contextmenu", "img", function(e) {
        return false;
    });

    // Detect Mobile Device
    var userAgentString = window.navigator.userAgent; 
    

    //Detect if IOS + Safari
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isSafari = userAgentString.indexOf("Safari") > -1;

    if(isIOS && isSafari){
        $(".ios-motion").show();
    }

    function denyIOSMotion(){
        $(".ios-motion").hide();
        alert('Please enable device orientation in Settings > Safari > Motion & Orientation Access.');
    }
    
    
    //Detect if Android + Chrome
    var isAndroid = /android/.test(navigator.userAgent) && !window.MSStream;
    var isChrome = userAgentString.indexOf("Chrome") > -1;

    if(isAndroid && isChrome){
        $(".android-motion").show();
    }

    function denyAndroidMotion(){
        $(".android-motion").hide();
        alert('Please enable device orientation in Settings > Site Settings > Motion sensors.');
    }
    

    //Detect if IOS + Safari
    function requestOrientationPermission(){
        DeviceOrientationEvent.requestPermission()
        .then(response => {
            if (response == 'granted') {
                alert(response)
                $(".ios-motion").hide();
                $(".android-motion").hide();
        
                window.addEventListener('deviceorientation', (e) => {
                    var rotateDegrees = e.alpha;
                    var leftToRight = e.gamma;
                    var frontToBack = e.beta;
                    handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
                })
            } else {
                alert(response)
                if(isIOS && isSafari){
                    denyIOSMotion();
                }
                if(isAndroid && isChrome){
                    denyAndroidMotion();
                }
            }
        })
        .catch(console.error)
    }
    
    $("#ios-deny").click(function(){
        denyIOSMotion();
    });
    
    $("#android-deny").click(function(){
        denyIOSMotion();
    });
    
    $("#requestPermission").click(function(){
        requestOrientationPermission();
    })







    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", function(event) {

            var rotateDegrees = event.alpha;    // alpha: rotation around z-axis
            var leftToRight = event.gamma;    // gamma: left to right
            var frontToBack = event.beta;    // beta: front back motion

            handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
        }, true);
    } else {
        console.log("Sorry, your browser doesn't support Device Orientation");
    }

    var handleOrientationEvent = function(frontToBack, leftToRight, rotateDegrees) {

        if(rotateDegrees <= 70 && rotateDegrees >= 40) {
            $("#instruction").css("opacity", "0");
            $(".back").css("transform", "rotate(45deg)");
        } else if(rotateDegrees <= 95 && rotateDegrees >= 85){
            $("#instruction").css("opacity", "1");
            $(".back").css("transform", "rotate(0deg)");
        } else {
            $("#instruction").css("opacity", "1");
        }
        
    };

    function init() {
        $("#instruction").html("Tilt at a&nbsp;<b>45&deg; angle</b>");
        if(!start) {
            $(".back").css("opacity", "0");
        }
    }

    let start = false;
    let initGlassTop = -80;
    let glassMove = false;
    let glassMovement = "down";
    init();

    var btn = document.getElementById("hold");

    var vid = document.getElementById("beerVid");
    var vidLength, current, percentage;
    vid.onloadedmetadata = function() {
        vidLength = vid.duration;
    };

    var mc = new Hammer(btn);
    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    mc.on("press", function(ev){
        start = true;
        $(".back").css("opacity", "1");
        $("#beerVid").trigger("play");

        setInterval(function(){
            if(start) {
                current = vid.currentTime;
                percentage = (current/vidLength) * 100;
                console.log(current + "/" + vidLength + "=" + percentage);
                if(percentage > 70) {
                    $("#instruction").html("<b>Straighten</b>&nbsp;the glass");
                }
            }
        }, 500);
    });
    mc.on("pressup", function(ev){
        start = false;
        $("#beerVid").trigger("pause");
    })

    mc.on("panup", function(ev) {
        glassMove = true;
        glassMovement = "down";
        setInterval(moveGlass(), 1000);
    });
    mc.on("pandown", function(ev) {
        glassMove = true;
        glassMovement = "up";
        setInterval(moveGlass(), 1000);
    });
    mc.on("panend", function(ev) {
        glassMove = false;
    })

    function moveGlass(){
        if(glassMove && glassMovement == "down") {
            $(".glass").css("top", initGlassTop++);
        } else if(glassMove && glassMovement == "up") {
            $(".glass").css("top", initGlassTop--);
        }
    }
});

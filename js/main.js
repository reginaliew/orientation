$(document).ready(function(){

    $("body").on("contextmenu", "img", function(e) {
        return false;
    });

    

            // ------------------------------------------------------------------- Detect Mobile Device
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
            
            function requestOrientationPermission(){
                DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response == 'granted') {
                        $(".ios-motion").hide();
                
                        window.addEventListener('deviceorientation', (e) => {
                            var rotateDegrees = e.alpha;
                            var leftToRight = e.gamma;
                            var frontToBack = e.beta;
                            handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
                        })
                    } else {
                        denyIOSMotion();
                    }
                })
                .catch(console.error)
            }
            
            //Detect if Android + Chrome
            var isAndroid = /Android/.test(navigator.userAgent) && !window.MSStream;
            var isChrome = userAgentString.indexOf("Chrome") > -1;

            if(isAndroid && isChrome){
                requestSensorPermission();
                $(".android-motion").show();
            }

            function denyAndroidMotion(){
                $(".android-motion").hide();
                alert('Please enable device orientation in Settings > Site Settings > Motion sensors.');
            }
                
            function requestSensorPermission(){
                // not working for Android Chrome
                const sensor = new AbsoluteOrientationSensor();
                Promise.all([
                            navigator.permissions.query({ name: "accelerometer" }),
                            navigator.permissions.query({ name: "magnetometer" }),
                            navigator.permissions.query({ name: "gyroscope" })])
                    .then(results => {
                        if (results.every(result => result.state === "granted")) {
                            sensor.start();
                            $(".android-motion").hide();
                        } else {
                            $(".android-motion").show();               
                        }
                    });
            }

            // ------------------------------------------------------------------- Orientation Permission Popup Buttons onClick
            $("#ios-deny").click(function(){
                denyIOSMotion();
            });
            $("#requestPermission").click(function(){
                requestOrientationPermission();
            })
            
            $("#android-deny").click(function(){
                denyAndroidMotion();
            });
            $("#and-requestPermission").click(function(){
                requestSensorPermission();
            })
});
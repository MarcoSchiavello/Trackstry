var audio = document.getElementById("player");
document.getElementById("duration").addEventListener('click',chageTime);
audio.volume = 0.50;

function start()
{
    audio.play();
    document.getElementById("play-icon").style.display = "none";
    document.getElementById("pause-icon").style.display = "block";
    if(document.getElementById("play-icon").style.display == "block")
        pause();
}
function pause()
{
    audio.pause();
    document.getElementById("play-icon").style.display = "block";
    document.getElementById("pause-icon").style.display = "none";
} 
function chageAudio(time)
{
    console.log(time);
    audio.volume = time /100;
}
function chageTime()
{
    var time = document.getElementById("duration");
    audio.currentTime = (time.value * audio.duration)/10000;
}
function updateTime()
{
    var durationBar = document.getElementById("duration");
    durationBar.value = Math.floor((audio.currentTime * 10000 ) / audio.duration);
    console.log(durationBar.value);
}
// 实现拍照的整体思路其实很简单，仅仅需要了解到视频其实也是一帧一帧画面构成的，
// 而 canvas 恰好有捕捉当前帧的能力

const video = document.querySelector('#video');
// 首先创建一个空白的 canvas 元素，元素的宽高设置为和 video 标签一致。
const canvas = document.createElement('canvas');

let photoContainer = document.getElementById("photo_container");

let images = document.getElementById('photo_container').getElementsByTagName('img');

// 初始化摄像头
initVideoCamera();
// 初始化图片
initPhoto();
document.querySelector('#shoot').addEventListener('click', photoShoot);

document.getElementById('delete-button').addEventListener('click', function () {
  for (let i = 0; i < images.length; i++) {
    images[i].addEventListener('click', function () {
      this.parentNode.removeChild(this);
    });
  }
});

/**
 * ビデオのカメラ設定(デバイスのカメラ映像をビデオに表示)
 */
function initVideoCamera() {
  // HTML5的getUserMedia API为用户提供访问硬件设备媒体（摄像头、视频、音频、地理位置等）的接口，
  // 基于该接口，开发者可以在不依赖任何浏览器插件的条件下访问硬件媒体设备。 
  // リアカメラをデフォルトに設定
  // { facingMode: { exact: 'environment' } }
  // video: true
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch(e => console.log(e));
}

/**
 * 写真の初期描画
 */
function initPhoto() {
  canvas.width = video.clientWidth;
  canvas.height = video.clientHeight;
  // 它接受一个字符串 “2d” 作为参数，它会把这个画布的上下文返回给你。
  const context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * 写真の撮影描画
 */
function photoShoot() {
  let drawSize = calcDrawSize();
  canvas.width = drawSize.width;
  canvas.height = drawSize.height;
  //拿到 canvas 上下文对象
  const context = canvas.getContext("2d");
  //将 canvas 投到页面上
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  if (images.length >= 3) {
    // 报错：已到上传个数上限，无法继续添加，并返回
    return alert("已到上传个数上限，无法继续添加");
  }
  addPhotoHtml(canvas);
}

/**
 * 描画サイズの計算
 * 縦横比が撮影(video)が大きい時は撮影の縦基準、それ以外は撮影の横基準で計算
 */
function calcDrawSize() {
  let videoRatio = video.videoHeight / video.videoWidth;
  let viewRatio = video.clientHeight / video.clientWidth;
  return videoRatio > viewRatio ?
    { height: video.clientHeight, width: video.clientHeight / videoRatio }
    : { height: video.clientWidth * videoRatio, width: video.clientWidth }
}

function addPhotoHtml(canvas) {
  const div = document.createElement("div");
  const img = document.createElement("img");
  const span = document.createElement("span");
  span.className = 'icon-cancel-circle';
  img.src = canvas.toDataURL("image/png");
  // img.style.border = "1px solid black";
  // img.style.width = "320px";
  // img.style.height = "240px";
  div.appendChild(img);
  div.appendChild(span)
  photoContainer.appendChild(div);
}

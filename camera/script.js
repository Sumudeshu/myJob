// 实现拍照的整体思路其实很简单，仅仅需要了解到视频其实也是一帧一帧画面构成的，
// 而 canvas 恰好有捕捉当前帧的能力

const video = document.querySelector('#video');
// 首先创建一个空白的 canvas 元素，元素的宽高设置为和 video 标签一致。
const canvas = document.createElement('canvas');

let photoContainer = document.getElementById("photo_container");

let images = document.getElementById('photo_container').getElementsByTagName('img');
let spans = document.getElementsByTagName('span');
// 初始化摄像头
initVideoCamera();
// 初始化图片
initPhoto();
document.querySelector('#shoot').addEventListener('click', photoShoot);

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
    return alert("追加できません。アップロードできる数は9枚までです。");
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
  div.appendChild(img);
  div.appendChild(span)
  photoContainer.appendChild(div);

  // 增加点击span后删除图片的监听事件
  // 点×了以后，直接删除父类div就行
  span.addEventListener('click', function () {
    if (!window.confirm("この写真を削除してもよろしいですか？")) {
      return;
    }
    div.parentNode.removeChild(div);
  })
  // 放大
  img.addEventListener('click', function () {
    //获取图片的宽和高
    iw = this.width;
    ih = this.height;
    //获取屏幕的宽和高
    sw = document.documentElement.clientWidth;
    sh = document.documentElement.clientHeight;
    //动态的创建一个灰色的背景div，就是那个我们带点击后，大图后面的那个灰色的那个背景，当然灰色是可以自由设置的
    const gdiv = document.createElement('div');
    gdiv.id = 'gray';
    gdiv.style.height = sh + 'px';
    gdiv.style.width = sw + 'px';
    document.body.appendChild(gdiv);
    //创建动态的图片对象，将该对象的src赋值为原图的src,这就是来创建我们放大后看大的那个图片
    const oimg = document.createElement('img');
    const span = document.createElement("span");
    span.className = 'icon-cancel-circle';
    oimg.src = this.src;
    oimg.width = (sw + iw) / 2;
    oimg.height = oimg.width / iw * ih;
    oimg.style.position = 'absolute';
    oimg.style.top = (2 * sh * iw - sw * ih - iw * ih) / (4 * iw) + 'px';
    oimg.style.left = (sw - iw) / 4 + 'px';
    oimg.style.zIndex = "10";

    span.style.top = oimg.style.top;
    span.style.right = oimg.style.left
    
  
    span.addEventListener('click', function () {
      if (!window.confirm("この写真を削除してもよろしいですか？")) {
        return;
      }
      div.parentNode.removeChild(div);
      document.body.removeChild(this);
      document.body.removeChild(oimg);
      document.body.removeChild(gdiv);
    });

    document.body.appendChild(oimg);
    document.body.appendChild(span);
    //删除动态的图片和对象，就是我们点击放大后，再次点击的时候，放大的图片会被删除，并且后面的那个背景也会随之删除，这个方法就是为了完成这个效果
    oimg.addEventListener('click', function () {
      document.body.removeChild(span);
      document.body.removeChild(this);
      document.body.removeChild(gdiv);
    });
  })
}
//设置图片的位置来适应窗口的大小
window.onresize = function () {
  sh = document.documentElement.clientHeight;
  sw = document.documentElement.clientWidth;
  gdiv.style.width = sw + 'px';
  gdiv.style.height = sh + 'px';
  //更改图片的位置
  oimg.style.top = (sh - ih) / 2 + 'px';
  oimg.style.left = (sw - iw) / 2 + 'px';
}

// upload picture
function makePostRequest() {
  // 获取表单输入框数据
  // 获取点击上传的按钮
  var formData = new FormData();
  let imgs = document.getElementById('photo_container').getElementsByTagName('img');
  // 遍历所有的文件输入
  const arr = [];
  for (var i = 0; i < imgs.length; i++) { 
    const src = imgs[i].src;
    arr.push(src); // 将文件添加到FormData中
  }

  fetch("http://localhost:8080/file2/uploadPhotos", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arr)
  })
  .then(response => {
      if (response.status === 200) {
          alert("upload success");
      }
  })
  .catch(error => {
      console.log("###########################" + error);
      console.error('Error:', error)
  });
}

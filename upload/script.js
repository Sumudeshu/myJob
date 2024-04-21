document.getElementById("uploadimage").onchange = function () {//当input标签上传了一个图片时
  var file = this.files;//将当前图片文件赋值给file变量
  var reader = new FileReader();//创建一个新FileReader类
  reader.readAsDataURL(file[0]);//将图片文件传给该FileReder
  reader.onload = function ()//加载
  {
    var image = document.getElementById("showimage");
    image.src = reader.result;
  };
}

var formData = new FormData();
formData.set("file", document.getElementById('uploadimage').files[0]);

$.ajax({
  url: "images/insertOneImageFile",//后端Controller层处理图片文件的对应接口
  type: "post",
  data: formData,//发送的数据为FormData类
  async: false,
  cache: false,
  processData: false,   // 不处理发送的数据
  contentType: false,   // 不设置Content-Type请求头
  success: function (data) {
    $("#path").text(data);
    console.log(data);
  },
  error: function (error) {
    imagestring = "";
    alert("上传图片出错！");
  }
});
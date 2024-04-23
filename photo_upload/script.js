
    // 获取图片回显容器节点
    let pictureEchoContainer = document.querySelector("#pictureEcho");

    // upload picture
    function makePostRequest() {
        //获取表单输入框数据
        // 获取点击上传的按钮
        var files = document.getElementById('file');
        const file = files.files[0];
        // 获取表单数据
        const formData = new FormData();
        formData.append('file', file);

        fetch("http://localhost:8080/file2/upload", {
            method: 'POST',
            body: formData
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

    
    // 自定义回调函数 
    function pictureShowCallback(pictureName){
        // 创建img节点
        let img = document.createElement("img")
        // 将img节点添加到div容器中 
        pictureEchoContainer.append(img)
        // 给img节点添加src属性
        img.src = "http://127.0.0.1:8080/files/download/" + pictureName;
    }
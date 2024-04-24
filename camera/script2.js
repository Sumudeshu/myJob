function makeGetRequest() {
    fetch("http://localhost:8080/file2/getAll")
        .then(response => response.json())
        .then(data => jsonToTable(data.data))
        .catch(error => console.error('Error:', error));
  }
  
  function jsonToTable(jsonData) {
    var tr = document.getElementById("picBody");
        var str = ``;
        for (var i = 0; i < jsonData.length; i++) {
            var obj = jsonData[i];
            str += `<tr>
                <td>${obj.id}</td>
                <td>${obj.username}</td>
                <td>${obj.picname}</td>
                <td>${obj.picpath}</td>
                <td><img src="http://localhost:8080/file2/getPicture/${obj.id}"></td>
                <td>${obj.ctime}</td>
                <td>${obj.mtime}</td>
            </tr>`;
        }
    tr.innerHTML = str;
  }

//   const showPic = document.getElementById('showPic');
//   showPic.addEventListener('click', showPicture);

//   function showPicture() {
//     const picPath = showPic.parentNode.previousSibling.innerHTML;
//     fetch("http://localhost:8080/file2/getPicture" + picPath)
//     .then(response => response.json())
//     .then(data => jsonToTable(data.data))
//     .catch(error => console.error('Error:', error));
//   }
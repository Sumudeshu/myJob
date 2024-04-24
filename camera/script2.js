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
                <td>${obj.ctime}</td>
                <td>${obj.mtime}</td>
                <td>
                    <input type="button" class='data' value="show more msg">
                </td>
            </tr>`;
        }
    tr.innerHTML = str;
  }
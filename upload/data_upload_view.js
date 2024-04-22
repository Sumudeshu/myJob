// 主処理部
$(function(){

    // アップロードボタンを押下した
    $("#data_upload_form").submit(function(event){
        // 要素規定の動作をキャンセルする
        event.preventDefault();

        var ajaxUrl = "file/upload?";
        // ファイル種類
        ajaxUrl += "filetype=" + $("#select_file_type option:selected").val();

        if(window.FormData){
            var formData = new FormData($(this)[0]);

            $.ajax({
                type : "POST",                  // HTTP通信の種類
                url  : "http://localhost:6272/file/upload",                 // リクエストを送信する先のURL
                dataType : "json",              // サーバーから返されるデータの型
                data : formData,                // サーバーに送信するデータ
                processData : false,
                contentType: false,
            }).done(function(data) {        // Ajax通信が成功した時の処理
                alert("アップロードが完了しました。");
            }).fail(function(XMLHttpRequest, textStatus, errorThrown) { // Ajax通信が失敗した時の処理
                alert("アップロードが失敗しました。");
            });
        }else{
            alert("アップロードに対応できていないブラウザです。");
        }
    });
});
}

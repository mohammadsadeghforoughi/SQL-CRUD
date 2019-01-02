  var DB={
      host:prompt("Host??"),
     user: prompt("UserName"),
      password: prompt("password"),
     database:prompt("DataBase Name")
  }

$.ajax({
    type: "post",
    url: "/CreateDB",
    data:{data:JSON.stringify(DB)},
    success: function (response) {
        console.log(response)
        
    }
});

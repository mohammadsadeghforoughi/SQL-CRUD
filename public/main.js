var databaseOK=false;
$.ajax({
    type: "post",
    url: "/chaeckDB",
    success: function (response) {
        console.log(response)
        if(response=="false")
        {
            //ds
        }
        else{
            databaseOK=true
        }
    }
});
$("#UID").val(Number(Date.now().toString().split('').reverse().join('').slice(0, 5)));
$("#tablee").hide();
$("#inser").click(function () {
    $("#UID").val(Number(Date.now().toString().split('').reverse().join('').slice(0, 5)));
    event.preventDefault();
    $("#tablee").show();
    var user = {
        UID: $("#UID").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        city: $("#city").val(),
        phoneNumber: $("#phoneNumber").val(),
        position: $("#position").val(),
        postalCode: $("#postalCode").val(),
    }
    user = JSON.stringify(user)
    $.ajax({
        type: "post",
        url: "/insert",
        data: {
            data: user
        },
        success: function (response) {

        }
    });
    refresh();
});
refresh();

function refresh() {
    $("tbody").empty();
    $.ajax({
        type: "post",
        url: "/read",
        success: function (response) {
            if (response.length != 0) {
                $("#tablee").show();
            }

            console.log(response)
            var index;
            var UID
            var firstName;
            var lastName;
            var city;
            var phoneNumber;
            var position;
            var postalCode;
            for (var i in response) {
                index = Number(i) + 1;
                id = "td" + UID;
                idE = "tdE" + UID;
                UID = response[i].UID;
                firstName = response[i].firstName;
                lastName = response[i].lastName;
                city = response[i].city;
                phoneNumber = response[i].phoneNumber;
                postalCode = response[i].postalCode;
                position = response[i].position;
                console.log(UID, firstName, lastName, city, phoneNumber, position)
                $("tbody").append(`<tr> <td>${index}</td> <td>${UID}</td><td>${firstName}</td><td>${lastName}</td><td> ${city} </td> <td> ${phoneNumber} </td> <td> ${postalCode}
                 </td> <td>${position}</td>  <td><div class="btn-group">
                 <button id="${id}" class="btn btn-danger"  onclick="Delete(this.id)">Delete?</button>
                 <button id="${idE}" class="btn btn-primary" onclick="Edit(this.id)">Edit?</button>
             </div></td></tr>`);
            }
        }
    });
}

function Delete(id) {
    event.preventDefault();
    var arr = [];
    arr.push(Number(id.split("td").splice(1, 1).join('')))
    arr = JSON.stringify(arr);
    $.ajax({
        type: "post",
        url: "/remove",
        data: {
            data: arr
        },
        success: function (response) {
            console.log("ok")
        }
    });
    refresh();
}

function Edit(id) {
    event.preventDefault();
    console.log(id)
    console.log(id.split("tdE").splice(1, 1).join(''));
    var user = {
        UID: id.split("tdE").splice(1, 1).join(''),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        city: $("#city").val(),
        phoneNumber: $("#phoneNumber").val(),
        position: $("#position").val(),
        postalCode: $("#postalCode").val()
    }
    user = JSON.stringify(user)
    $.ajax({
        type: "post",
        url: "/update",
        data: {
            data: user
        },
        success: function (response) {
            console.log("ok")
        }
    });

    refresh();
}
import React, {Component} from 'react';

import './App.css';
import $ from 'jquery'

function addToDB(data) {
    $.ajax({
        type: "post",
        url: "http://localhost:3000/insert",
        data: {
            "data": JSON.stringify(data)
        },
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3001'
        },
      
        success: function (response) {
            console.log(response)
        }
    });
    console.log("Asdadasd", showDB())
}
function showDB(){
    var result=null;
    $.ajax({
        async: false,
        global: false,
        type: "post",
        url: "http://localhost:3000/read",
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3001'
        }
        ,success: function (response) {
            result=response;
        }
    });
    return result;
}
function EditData (Obj) { 
    console.log(Obj);
    $.ajax({
        type: "post",
        url: "http://localhost:3000/Update",
        data:Obj,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3001'
        }
        ,success: function (response) {
            console.log("edited")
        }
    });
 }

function DeletDB (arr){
    console.log('arr: ',arr)
    $.ajax({
        type: "post",
        url: "http://localhost:3000/remove",
        data: {
            "data":  JSON.stringify(arr)
        },
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3001'
        },
        success: function (response) {
            console.log(response)
        }
    });
    console.log("Asdadasd", showDB())
}
class RowTable extends Component {
    constructor(props) {
        super(props);
        const {firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            position,
            UID} = props.data;
            const index=props.index;
        this.state = {
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            position,
            UID,
            index,
            isEdit: false,
            selected: false,
            editStyle: {
                'display': 'none'
            },
            formStyle: {}
        }
    }
    changeHandler = (event) => {
        const {name, value, type, checked} = event.target;
        if (type === "text") {
            this.setState({[name]: value});
            console.log(name, value)
        } else {
            // if(name==="selected") {   this.setState({selected:true}); }
            this.setState({[name]: checked});
        }
    }
    edit = () => {
       
        this.setState({isEdit: true})
    }
    save = () => {
        const {
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            position,
            UID
        } = this.state;
        var infoEdit={
            UID,
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            position
        }
        console.log(infoEdit.UID)
        EditData(infoEdit);
        this.setState({isEdit: false})
    }
    removeHandler = () => {
        this
            .state
            .onClick
            .removeHandler(this.index);
    }
    onSelect = (event) => {
        console.log(this.state.UID, 'Selected')
        if (event.target.checked) {
            this.setState({
                editStyle: {
                    'display': 'block'
                },
                formStyle: {
                    'backgroundColor': '#f86133'
                }
            })
        }
        if (!event.target.checked) {
            this.setState({
                editStyle: {
                    'display': 'none'
                },
                formStyle: {
                    'backgroundColor': '#32383e'
                }
            })
        }
        this.props.onCheck(event.target.checked, this.state.UID);
    }
    render() {
        const {
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            position,
            UID,
            isEdit,
            selected,
            editStyle,
            formStyle,index
        } = this.state;

        if (isEdit) {
            return (

                <tr style={formStyle}>
                    <td><input type="checkbox" onChange={this.changeHandler} disabled/></td>
                    <td>{Number(index)+1}</td>

                    <td><input
                        className="form-control bg-dark text-light border border-success"
                        type="text"
                        name="UID"
                        value={UID}
                        onChange={this.changeHandler} disabled/></td>
                    <td><input
                        className="form-control bg-dark text-light border border-success"
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={this.changeHandler}/></td>
                         <td><input
                        className="form-control bg-dark text-light border border-success"
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={this.changeHandler}/></td>
                         <td><input
                        className="form-control bg-dark text-light border border-success"
                        type="text"
                        name="city"
                        value={city}
                        onChange={this.changeHandler}/></td>
                         <td><input
                        className="form-control bg-dark text-light border border-success"
                        type="text"
                        name="postalCode"
                        value={postalCode}
                        onChange={this.changeHandler}/></td>

                    <td><input
                        className="form-control bg-dark text-light border border-success"
                        type="text"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={this.changeHandler}/></td>
                        <td><input
                        className="form-control bg-dark text-light border border-success"
                        type="text"
                        name="position"
                        value={position}
                        onChange={this.changeHandler}/></td>
                    
                    <td>
                        <button onClick={this.save} className="btn btn-success">save</button>
                    </td>
                </tr>

            )
        }
        return (
            <tr style={formStyle}>
                <td><input
                    type="checkbox"
                    onChange={this.changeHandler}
                    onClick={this.onSelect}
                    checked={selected}
                    name="selected"/></td>
                <td>{Number(index)+1}</td>
                <td>{UID}</td>
                <td>{firstName}</td>
                <td>{lastName}</td>
                <td>{city}</td>
                <td>{postalCode}</td>
                <td>{phoneNumber}</td>
                <td>{position}</td>
                <td>
                    <button onClick={this.edit} style={editStyle} className="btn btn-secondary">Edit</button>
                </td>
            </tr>

        )
    }
}
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            city: "",
            postalCode: "",
            phoneNumber: "",
            position: "",
            UID:Number( Date.now().toString().split('').reverse().join('').slice(0, 5)),
            rows: showDB(),
            selectAll: false,
            selectedItems: []
        }
    }
    changeHandler = (event) => {
        const {name, value, type, checked} = event.target;
        if (type === "text") {
            this.setState({[name]: value});
            console.log(name, value)
        } else {
            this.setState({[name]: checked});
        }
    }
 

    AddRow = () => {
        const {
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            position,
            UID
        } = this.state;
        if ({
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            position
        } !== "") {
            var data = {
                firstName,
                lastName,
                city,
                postalCode,
                phoneNumber,
                position,
                UID
            };

            addToDB(data)
            
        }
        
        var data2=showDB();
        this.setState({
            firstName: "",
            lastName: "",
            city: "",
            postalCode: "",
            phoneNumber: "",
            position: "",
            UID:Number( Date.now().toString().split('').reverse().join('').slice(0, 5)),    
            rows:data2 
        });
     
      
    }
    selectHandler = (selected, id) => {
        const {selectedItems} = this.state;
        console.log(selected,id)
        if (selected) {
            selectedItems.push(id);

        } else if (!selected) {
            removeFromList(id, selectedItems);
        }

        this.setState({selectedItems});

    }
    removeHandler = (index) => {
        const {rows, selectAll, selectedItems} = this.state;

        if (selectAll) {
            selectedItems.length = 0;
           var arr= rows.map(item => item.UID)    
            DeletDB(arr);
            rows.length=0;
            selectedItems.length = 0;
        }
        else{
          DeletDB(selectedItems);
        }
        this.setState({rows:showDB(), selectAll: false})
    }
    render() {
        const {
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            position,
            rows,
            selectAll,
            selectedItems,
            UID
        } = this.state;
        return (
            <div className="container">
                <h4 className="mx-auto text-center text-warning mt-4 p-4 rounded  col-4  ">
                    <span className="effect">SQL Crud With ReactJS!!</span>
                </h4>
                <table className="table table-striped table-dark mt-4 opaciti ">

                    <tr>
                        <th scope="col">
                            <small>Select</small>
                        </th>
                        <th scope="col">Row</th>
                        <th scope="col">UID</th>
                        <th scope="col">FirstName</th>
                        <th scope="col">LastName</th>
                        <th scope="col">City</th>
                        <th scope="col">PostalCode</th>
                        <th scope="col">PhoneNumber</th>
                        <th scope="col">Position</th>
                        <th scope="col">Action</th>
                    </tr>
                    <tr>
                        <td><input
                            type="checkbox"
                            onChange={this.changeHandler}
                            checked={selectAll}
                            name="selectAll"/></td>
                        <td></td>

                        <td><input
                            type="text"
                            name="UID"
                            className="form-control bg-dark text-light border border-success"
                            value={UID}
                            disabled/></td>
                        <td><input
                            type="text"
                            name="firstName"
                            className="form-control bg-dark text-light border border-success"
                            value={firstName}
                            onChange={this.changeHandler}/></td>
                        <td><input
                            type="text"
                            name="lastName"
                            className="form-control bg-dark text-light border border-success"
                            value={lastName}
                            onChange={this.changeHandler}/></td>
                        <td><input
                            type="text"
                            name="city"
                            className="form-control bg-dark text-light border border-success"
                            value={city}
                            onChange={this.changeHandler}/></td>
                        <td><input
                            type="text"
                            name="postalCode"
                            className="form-control bg-dark text-light border border-success"
                            value={postalCode}
                            onChange={this.changeHandler}/></td>
                        <td><input
                            type="text"
                            name="phoneNumber"
                            className="form-control bg-dark text-light border border-success"
                            value={phoneNumber}
                            onChange={this.changeHandler}/></td>
                        <td><input
                            type="text"
                            name="position"
                            className="form-control bg-dark text-light border border-success"
                            value={position}
                            onChange={this.changeHandler}/></td>
                        <td>

                            <button onClick={this.AddRow} className="btn btn-primary">Add</button>
                        </td>
                    </tr>
                    {rows.map((item, index) => <RowTable
                        data={item}
                        index={index}
                        key={rows.id}
                        onRemove={this.removeHandler}
                        selectedItems={selectedItems}
                        onCheck={this.selectHandler}/>)}

                </table>

                <button className="btn btn-danger d-block" onClick={this.removeHandler}>
                    Delete {selectedItems.length}?
                </button>
            </div>
        );
    }
}
const removeFromList = (id, array = 0, rows) => {

    /********************* */
    for (var q = 0; q < array.length; q++) {
        if (id === array[q]) {
            array.splice(q, 1);
        }
    }
    return array;
}
 

export default App;

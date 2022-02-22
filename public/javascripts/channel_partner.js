let categories = []
let subcategories = []
let services = []


let table = '/admin/dashboard/store-listing/channel_partner'

$('#show').click(function(){
  
$.getJSON(`/api/get-channel_partner`, data => {
    services = data
    makeTable(data)
    
  
})

})





$.getJSON(`/api/get-state`, data => {
    categories = data
    fillDropDown('categoryid', data, 'Choose State', 0)
  
})


$.getJSON(`/api/get-city`, data => {
    subcategories = data
    fillDropDown('subcategoryid', [], 'Choose City', 0)
})


$('#categoryid').change(() => {
    const filteredData = subcategories.filter(item => item.stateid == $('#categoryid').val())
    fillDropDown('subcategoryid', filteredData, 'Choose City', 0)
})


function fillDropDown(id, data, label, selectedid = 0) {
    $(`#${id}`).empty()
    $(`#${id}`).append($('<option>').val("null").text(label))

    $.each(data, (i, item) => {
        if (item.id == selectedid) {
            $(`#${id}`).append($('<option selected>').val(item.id).text(item.name))
        } else {
            $(`#${id}`).append($('<option>').val(item.id).text(item.name))
        }
    })
}



    function makeTable(categories){
        let table = ` <div class="table-responsive">

        <button type="button" id="back" class="btn btn-primary" style="margin:20px">BacK</button>
    <table id="report-table" class="table table-bordered table-striped mb-0">
    <thead>
    <tr>
    <th>PAN Card</th>
    <th>Address Proof</th>

    <th>State Name</th>
    <th>City Name</th>

    <th>Name</th>
    <th>Mobile Number</th>


    <th>Options</th>
    </tr>
    </thead>
    <tbody>`

    $.each(categories,(i,item)=>{
    table+=`<tr>
    <td>
    <img src="/images/${item.image}" class="img-fluid img-radius wid-40" alt="" style="width:50px;height:50px">
    </td>
    <td>
    <img src="/images/${item.icon}" class="img-fluid img-radius wid-40" alt="" style="width:50px;height:50px">
    </td>
    <td>${item.categoryname}</td>
    <td>${item.subcategoryname}</td>

    <td>${item.name}</td>
    <td>${item.number}</td>


    <td>
    <a href="#!" class="btn btn-info btn-sm edits" id="${item.id}"><i class="feather icon-edit"></i>&nbsp;Edit </a>
    <a href="#!" class="btn btn-info btn-sm updateimage"  id="${item.id}"><i class="feather icon-edit"></i>&nbsp;Edit Image </a>
    <a href="#!" class="btn btn-danger btn-sm deleted" id="${item.id}"><i class="feather icon-trash-2"></i>&nbsp;Delete </a>
    </td>
    </tr>`
    })
    table+=`</tbody>
    </table>
    </div>

        
    <!-- End Row -->`
        $('#result').html(table)
        $('#insertdiv').hide()
        $('#result').show()
    }


$('#result').on('click', '.deleted', function() {
    const id = $(this).attr('id')
     $.get(`${table}/delete`,  { id }, data => {
        refresh()
    })
})


$('#pcategoryid').change(() => {
// alert($('#pcategoryid').val())
    const filteredData = subcategories.filter(item => item.stateid == $('#pcategoryid').val())
    console.log(filteredData)
    fillDropDown('psubcategoryid', filteredData, 'Choose City', 0)
})



$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = services.find(item => item.id == id);
    // fillDropDown('pcategoryid', categories, 'Choose Category', result.categoryid)
    fillDropDown('pcategoryid', categories, 'Choose Category', result.categoryid)
    $('#psubcategoryid').append($('<option>').val(result.subcategoryid).text(result.subcategoryname))
    $('#editdiv').show()
    $('#result').hide()
    $('#insertdiv').hide() 
    $('#pid').val(result.id)
    $('#pcategoryid').val(result.categoryid)
     $('#psubcategoryid').val(result.subcategoryid)
     $('#pname').val(result.name)
     $('#pnumber').val(result.number)

     $('#pcategoryid').val(result.categoryid)

   
 })



 $('#result').on('click', '.updateimage', function() {
    const id = $(this).attr('id')
    

    const result = subcategories.find(item => item.id == id);
    $('#peid').val(result.id)
})



 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        name: $('#pname').val(),
        categoryid:$('#pcategoryid').val(),
        subcategoryid:$('#psubcategoryid').val(),
        number:$('#pnumber').val(),

       
        }
console.log(updateobj)
    $.post(`${table}/update`, updateobj , function(data) {
       update()
    })
})






function refresh() 
{
    $.getJSON(`/api/get-channel_partner`, data => makeTable(data))
}
function update()
{
    $('#result').show()
    $('#editdiv').hide()
    $('#insertdiv').show() 
    refresh()
    refresh()
}

//================================Page Functionality=============================//
$('#editdiv').hide()
$('#updateimagediv').hide()

$('#result').on('click', '#back', function() {
    $('#result').hide()
    $('#insertdiv').show()
})

$('#back1').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()

})

$('#back2').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()
})

$('#result').on('click', '.updateimage', function() {
    $('#updateimagediv').show()
    $('#result').hide()
    $('#insertdiv').hide()
    $('#editdiv').hide()
})



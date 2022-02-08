let categories = []
let subcategories = []
let services = []


let table = '/merchant-api'
let vendorid = $('#vendorid').val()


$('#show').click(function(){
  
$.getJSON(`/merchant-api/coupon-show?vendorid='${vendorid}'`, data => {
    console.log(data)
    services = data
    makeTable(data)


    
  
})

})


$.getJSON(`/vendor-dashboard/subcategory`, data => {
    categories = data
    fillDropDown('subcategoryid', data, 'Choose Category', 0)
  
})



$.getJSON(`/api/get-brand`, data => {
    subcategories = data
    fillDropDown('brandid', [], 'Choose Brand', 0)
})

$('#subcategoryid').change(() => {
    const filteredData = subcategories.filter(item => item.subcategoryid == $('#subcategoryid').val())
    fillDropDown('brandid', filteredData, 'Choose Brand', 0)
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
<th>Image</th>

<th>Code</th>
<th>Type</th>
<th>Minimum Order Price</th>
<th>Maximum Cashback Price</th>
<th>Discount</th>
<th>Expiry</th>


<th>Options</th>

</tr>
</thead>
<tbody>`

$.each(categories,(i,item)=>{
table+=`<tr>
<td>
<img src="/images/${item.image}" class="img-fluid img-radius wid-40" alt="" style="width:50px;height:50px">
</td>



    
<td>${item.name}</td>
<td>${item.type}</td>
<td>${item.mimimum_price}</td>
<td>${item.maximum_cashback_price}</td>
<td>${item.discount}</td>
<td>${item.expiry}</td>



<td>

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
     $.get(`${table}/coupon/delete`,  { id }, data => {
        refresh()
    })
})



$('#pcategoryid').change(() => {
    const filteredData = subcategories.filter(item => item.categoryid == $('#pcategoryid').val())
    fillDropDown('psubcategoryid', filteredData, 'Choose Sub-Category', 0)
})



$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = services.find(item => item.id == id);
    fillDropDown('pcategoryid', categories, 'Choose Category', result.categoryid)
    $('#psubcategoryid').append($('<option>').val(result.subcategoryid).text(result.subcategoryname))
 
    $('#editdiv').show()
    $('#result').hide()
    $('#insertdiv').hide() 
    $('#pid').val(result.id)
     $('#pname').val(result.name)
     $('#pcategoryid').val(result.categoryid)
     $('#psubcategoryid').val(result.subcategoryid)
     $('#pprice').val(result.price)
     $('#pdiscount').val(result.discount)
     $('#pweight').val(result.weight)
   
 })



 $('#result').on('click', '.updateimage', function() {
    const id = $(this).attr('id')
    

    const result = services.find(item => item.id == id);
    $('#peid').val(result.id)
})



 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        name: $('#pname').val(),
        categoryid:$('#pcategoryid').val(),
       // subcategoryid:$('#psubcategoryid').val(),
        name:$('#pname').val(),
        price:$('#pprice').val(),
        status:$('#pstatus').val(),
        weight:$('#pweight').val(),

       
        }

    $.post(`${table}/update`, updateobj , function(data) {
       update()
    })
})






function refresh() 
{
    $.getJSON(`/merchant-api/coupon-show?vendorid='${vendorid}'`, data => {
        console.log(data)
        services = data
        makeTable(data)
    
    
        
      
    })
    
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



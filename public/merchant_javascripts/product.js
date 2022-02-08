let categories = []
let subcategories = []
let services = []


let vendorid = $('#vendorid').val()
let categoryid = $('#categoryid').val()

// alert(categoryid)

let table = '/merchant-api'

$('#show').click(function(){
  
$.getJSON(`/merchant-api/show-product?vendorid=${vendorid}`, data => {
    console.log(data)
    services = data
    makeTable(data)


    
  
})

})


$.getJSON(`/merchant-api/subcategory?categoryid=${categoryid}`, data => {
    categories = data
    console.log('su',data)
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
<th>Category Name</th>
<th>Subcategory Name</th>
<th>Name</th>
<th>Price</th>
<th>Discount</th>
<th>Net Amount</th>
<th>Quantity</th>
<th>Keywords</th>


<th>Options</th>

</tr>
</thead>
<tbody>`

$.each(categories,(i,item)=>{
table+=`<tr>
<td>
<img src="/images/${item.image}" class="img-fluid img-radius wid-40" alt="" style="width:50px;height:50px">
</td>

<td>${item.subcategoryname}</td>
<td>${item.brandname}</td>

    
<td>${item.name}</td>
<td>${item.price}</td>
<td>${item.discount}</td>
<td>${item.net_amount}</td>
<td>${item.keyword}</td>
<td>${item.quantity}</td>



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



$('#psubcategoryid').change(() => {
    const filteredData = subcategories.filter(item => item.subcategoryid == $('#psubcategoryid').val())
    fillDropDown('pbrandid', filteredData, 'Choose Brand', 0)
})


$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = services.find(item => item.id == id);
    fillDropDown('psubcategoryid', categories, 'Choose Category', result.subcategoryid)
    // $('#psubcategoryid').append($('<option>').val(result.subcategoryid).text(result.subcategoryname))
    $('#pbrandid').append($('<option>').val(result.brandid).text(result.brandname))

 
    $('#editdiv').show()
    $('#result').hide()
    $('#insertdiv').hide() 
    $('#pid').val(result.id)
     $('#pname').val(result.name)
     $('#pbrandid').val(result.brandid)
     $('#psubcategoryid').val(result.subcategoryid)
     $('#pprice').val(result.price)
     $('#pquantity').val(result.quantity)
     $('#psmall_description').val(result.small_description)
     $('#pkeyword').val(result.keyword)
    
     $('#pdiscount').val(result.discount)
     let table = `<p>${result.description}</p>
     `
     $('.peditor').html(table) 
   
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
        subcategoryid:$('#psubcategoryid').val(),
        brandid:$('#pbrandid').val(),
        name:$('#pname').val(),
        price:$('#pprice').val(),
       quantity : $('#pquantity').val(),
       small_description : $('#psmall_description').val(),
       keyword : $('#pkeyword').val(),
       discount : $('#pdiscount').val(),


       
        }

    $.post(`${table}/update`, updateobj , function(data) {
       update()
    })
})






function refresh() 
{
    $.getJSON(`/merchant-api/show-product?vendorid=${vendorid}`, data => {
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



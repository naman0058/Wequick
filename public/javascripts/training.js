let categories = []

let table = '/admin/dashboard/store-listing/training'





$('#show').click(function(){

$.getJSON('/api/get-training',data=>{
    categories = data
    makeTable(data)
})

})




function makeTable(categories){
    let table = ` <div class="table-responsive">

    <button type="button" id="back" class="btn btn-primary" style="margin:20px">BacK</button>
<table id="report-table" class="table  table-striped mb-0">
<thead>
<tr>
<th>Name</th>
<th>Description</th>
<th>Link</th>
<th>Thumbnail</th>

<th>Options</th>
</tr>
</thead>
<tbody>`

$.each(categories,(i,item)=>{
table+=`<tr>
<td>${item.name}</td>
<td>${item.description}</td>
<td>${item.link}</td>

<td>
<img src="/images/${item.image}" class="img-fluid img-radius wid-40" alt="" style="width:30px;height:30px">
</td>

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



$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = categories.find(item => item.id == id);
  
    $('#editdiv').show()
    $('#result').hide()
    $('#insertdiv').hide() 
    $('#pid').val(result.id)
     $('#pname').val(result.name)
     $('#pdescription').val(result.description)
     $('#plink').val(result.link)

   
 })



 $('#result').on('click', '.updateimage', function() {
    const id = $(this).attr('id')
    const result = categories.find(item => item.id == id);
    $('#peid').val(result.id)
})



 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        name: $('#pname').val(),
        description: $('#pdescription').val(),
        link: $('#plink').val(),

       
        }

    $.post(`${table}/update`, updateobj , function(data) {
       update()
    })
})






function refresh() 
{
    $.getJSON('/api/get-training',data=>{
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



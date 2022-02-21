
  let addgroup = []
  let wishes = []

  let subcategories = []
  let table = 'blogs'





  $.getJSON(`/city/show`, data => {
      addgroup = data
      console.log('leagues',data)
      fillDropDown('cityid', data, 'Choose City', 0)
    
  })




  $('#show').click(function(){
  $.getJSON(`/${table}/show`, data => {
      console.log(data)
      wishes = data
      makeTable(data)
    
  })
  })



  $('.save').click(function(){
    if($('#name').val()==[] || $('#name').val()=="") alert('Enter Name')
    else if($('#short_name').val()==[] || $('#short_name').val()=="") alert('Enter Short Name')
    else{
    let insertObj = {
      name : $('#name').val(),
      short_name:$('#short_name').val()
    }
    $.post(`/${table}/insert`,insertObj,data=>{
      alert('Successfully Inserted')
    })
    }
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

      





  function makeTable(board){
      let table = ` <div class="table-responsive">

      <button type="button" id="back" class="btn btn-primary" style="margin:20px">BacK</button>
<table id="report-table" class="table table-bordered table-striped mb-0">
              <thead>
                <tr>
                <th scope="col">Name</th>
                <th scope="col">Title</th>
                <th scope="col">Keywords</th>
                <th scope="col">Meta Description</th>
                


                <th scope="col">Image</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                    <tr>`
                    $.each(board, function(i, item) {
                      table += `


                      <th scope="row">
                        <div class="media align-items-center">
                          <div class="media-body">
                            <span class="mb-0 text-sm">${item.name}</span>
                          </div>
                        </div>
                      </th>

                    

                      <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.title}</span>
                        </div>
                      </div>
                    </th>



                    <th scope="row">
                    <div class="media align-items-center">
                      <div class="media-body">
                        <span class="mb-0 text-sm">${item.keyword}</span>
                      </div>
                    </div>
                  </th>



                  <th scope="row">
                  <div class="media align-items-center">
                    <div class="media-body">
                      <span class="mb-0 text-sm">${item.description}</span>
                    </div>
                  </div>
                </th>


                    


                  
                    



    <th scope="row">
              <div class="media align-items-center">
                <a href="#" class="avatar rounded-circle mr-3">
                  <img alt="Image placeholder" src="/images/${item.logo}" style='width:100px;'>
                </a>
                
              </div>
            </th>
          
            <td>
            <a href="#!" class="btn btn-info btn-sm edit" id="${item.id}"><i class="feather icon-edit"></i>&nbsp;Edit </a>
            <a href="#!" class="btn btn-info btn-sm updateimage"  id="${item.id}"><i class="feather icon-edit"></i>&nbsp;Edit Image </a>
            <a href="#!" class="btn btn-danger btn-sm delete" id="${item.id}"><i class="feather icon-trash-2"></i>&nbsp;Delete </a>
            </td>
                    </tr>`
                    })
                    
                table +=` </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>`
        $('#result').html(table)
        $('#insertdiv').hide()
        $('#result').show()
  }


  $('#result').on('click', '.delete', function() {
      const id = $(this).attr('id')
      $.get(`/${table}/delete`,  { id }, data => {
          refresh()
      })
  })






  $('#result').on('click', '.edit', function() {
      const id = $(this).attr('id')
      const result = wishes.find(item => item.id == id);
      fillDropDown('pleagueid', addgroup, 'Country Name', result.cityid)
      $('#editdiv').show()
      $('#insertdiv').hide() 
      $('#result').hide()
      $('#pid').val(result.id)
      $('#pname').val(result.name)
      $('#ptitle').val(result.title)
      $('#pdescription').val(result.description)
      $('#pkeyword').val(result.keyword)
      $('#ptype').val(result.type)
      $('#pname').val(result.name)
      $('#pproject_description').val(result.project_description)


    

      let table = `<p>${result.content}</p>
      `
      $('.peditor').html(table)


    
      

  })


  
  $('#update').click(function(){  //data insert in database


      let content = $(".peditor").html().trim();


      let updateobj = {
          id: $('#pid').val(),
          cityid:$('#pleagueid').val(),
          type:$('#ptype').val(),
          content:content,
          title:$('#ptitle').val(),
          keyword:$('#pkeyword').val(),
          description:$('#pdescription').val(),
          name:$('#pname').val(),
          project_description:$('#pproject_description').val(),


        


          
        
      }

      $.post(`/${table}/update`, updateobj , function(data) {
        update()
      })
  })


  function refresh() 
  {
    
    $.getJSON(`/${table}/show`, data => {
      console.log(data)
      wishes = data
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
      const id = $(this).attr('id')
      const result = wishes.find(item => item.id == id);
      $('#peid').val(result.id)
      $('#updateimagediv').show()
      $('#result').hide()
      $('#insertdiv').hide()
      $('#editdiv').hide()
  })

  //===================================Page Functioality Ends========================//
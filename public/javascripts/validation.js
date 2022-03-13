
// check isnumeric or not ?

let pincodeerror = ''
let agenterror = ''
let numbererror = ''
let state = ''
let city = ''

$('#aadhardoc').hide() 
$('#drivingl').hide()    
$('#panl').hide()    
$('#voterl').hide()    


$('.paymentsubscribe').hide()    
// 

function check_agent_code(){
    let agent_id = $('#agentid').val()
    
    $.post('/api/check-bde-code',{agent_id},data=>{
        // alert(data.msg)
        if(data.msg =='invalid'){
            let table = `<span style='color:red'>Invalid Executive Code</span>`
            agenterror = 'invalid'
            $('#result').html(table)

        }
        else{
            let table = `<span style='color:green'>Success</span>`
            agenterror = 'success'

            $('#result').html(table)

        }
    })
}


function isnumeric(evt)
{
	var charCode = (evt.which) ? evt.which : event.keyCode
	if (charCode > 31 && (charCode < 48 || charCode > 57))
	return false;

	return true;
}


//  check pincode


function done(){
    let pincode = $('.pincode').val();
    $.getJSON(`https://api.postalpincode.in/pincode/${pincode}`,data=>{
        // console.log(data[0].PostOffice)
        console.log(data[0].PostOffice)

      //   alert(data[0].PostOffice)

        if(data[0].PostOffice == null){
            
     let table = `<span style='color:red'>Invalid Pincode</span>`
     pincodeerror = 'invalid'

      $('#pincodeerror').html(table)
        }
        else{
            let table = `<span style='color:green'>Pincode Available</span>`
     pincodeerror = 'success'
     state = data[0].PostOffice[0].State
     city = data[0].PostOffice[0].Division


            $('#pincodeerror').html(table)
      fillDropDown('areaid', data[0].PostOffice, 'Choose Area', 0)
        }

    })
}




function fillDropDown(id, data, label, selectedid = 0) {
$(`#${id}`).empty()
$(`#${id}`).append($('<option>').val("null").text(label))

$.each(data, (i, item) => {
  if (item.id == selectedid) {
      $(`#${id}`).append($('<option selected>').val(item.Name).text(item.Name))
  } else {
      $(`#${id}`).append($('<option>').val(item.Name).text(item.Name))
  }
})
}



//  check mobile number

function checknumber(){
    let number = $('.number').val()
    
    $.post('/api/check-vendor-number',{number},data=>{
        alert(data.msg)
        if(data.msg =='invalid'){
           
            let table = `<span style='color:green'>Mobile Number Available</span>`
            numbererror = 'success'
            $('#numbererror').html(table)

        }
        else{
            let table = `<span style='color:red'>Mobile Number Exists</span>`
            numbererror = 'invalid'
            $('#numbererror').html(table)

        }
    })
}


$('#kyc_document').change(function(){
  
    if( $('#kyc_document').val() == 'Aadhar Card' ){
      

$('#aadhardoc').show()  
$('#drivingl').hide()    
$('#panl').hide()    
$('#voterl').hide()    
  
    }
    else if( $('#kyc_document').val() == 'Driving License' ){

        $('#aadhardoc').hide()  
        $('#drivingl').show()    
        $('#panl').hide()    
        $('#voterl').hide()    

    }
    else if( $('#kyc_document').val() == 'Voter ID Card' ){

        $('#aadhardoc').hide()  
        $('#drivingl').hide()    
        $('#panl').hide()    
        $('#voterl').show()     


    }
    else if( $('#kyc_document').val() == 'PAN Card' ){
$('#aadhardoc').hide()    

       
$('#aadhardoc').hide()  
$('#drivingl').hide()    
$('#panl').show()    
$('#voterl').hide()   
    }

    else {
        $('#aadhardoc').hide()  
        $('#drivingl').hide()    
        $('#panl').hide()    
        $('#voterl').hide()  

    }


   
})





$('#payment_type').change(function(){
  
    if( $('#payment_type').val() == 'Subscribe' ){
        $('.paymentsubscribe').show()
    }
    

    else {
        $('.paymentsubscribe').hide()

    }


   
})





$.getJSON(`/api/get-category`, data => {
    categories = data
    fillDropDown1('categoryid', data, 'Choose Category', 0)
  
})


function fillDropDown1(id, data, label, selectedid = 0) {
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




function submit(){

   
   

        if ($('#agentid').val() == "" || $('#agentid').val() == [] || $('#agentid').val() == null || agenterror == 'invalid')
     
            alert('Please Enter Valid Executive ID...')

        else if ($('#business_name').val() == "" || $('#business_name').val() == [])
       
            alert('Please Select Shop Name...')

        else if ($('#categoryid').val() == "" || $('#categoryid').val() == [] || $('#categoryid').val() == null || $('#categoryid').val() == 'null')
            alert('Please Select Shop Category...')
   

        else if ($('#number').val() == "" || $('#number').val() == [] || $('#number').val().length < 10 || numbererror == 'invalid')
            alert('Please Enter Valid Number No...')

        else if ($('#kyc_document').val() == "" || $('#kyc_document').val() == [] || $('#kyc_document').val() == null) {
            alert('Please Select Personal Document')
        }
        else if ($('#business_kyc').val() == "" || $('#business_kyc').val() == [] | $('#business_kyc').val() == null) {
            alert('Please Select Business Document..')
        }

        else if ($('#pincode').val() == "" || $('#pincode').val() == [] || pincodeerror == 'invalid')
         
            alert('Please Enter Pincode...')


        else if ($('#areaid').val() == "" || $('#areaid').val() == [] || $('#areaid').val() == null || $('#areaid').val() == 'null') {
            alert('Select Locality...')
        }

        else if (!$.trim($("#description").val())) {
            alert('Write Something About Your Business')
        }
        else if ($('#payment_type').val() == "" || $('#payment_type').val() == [] || $('#payment_type').val() == null) {
            alert('Select Account Type...')
        }

        //    else if ($('#payment_type').val() == "Subscribe") {
        //     if ($('#transaction_id').val() == "" || $('#transaction_id').val() == 'undefined'){
        //         alert('Transaction ID Must be valid')

        //     }
        // }

        //  else if ($('#transaction_image').val() == "" || $('#transaction_image').val() == 'undefined'){
        //         alert('Transaction Image Must be valid')

        //     }
        //             }

  


        else if ($('#personal_kyc_img').val() == "" || $('#personal_kyc_img').val() == []) alert("Upload Personal KYC Doc");
        else if ($('#business_kyc_img').val() == "" || $('#business_kyc_img').val() == []) alert("Upload Business KYC  Doc");
        else if ($('#image').val() == "" || $('#image').val() == []) alert("Upload Shop Insisde Image");
        else if ($('#shop_img2').val() == "" || $('#shop_img2').val() == []) alert("Upload Shop Outside Image ");
      
    //     else if ($('#kyc_document').val() == "Aadhar Card") {
    //         if ($('#aadhar_back').val() == "" || $('#aadhar_back').val() == 'undefined'){
    //                     alert('Aadhar Card Must be valid')
        
    //                 }
                    
    // }




        else {
          

     

            var formData = new FormData();
            formData.append('business_name', $('#business_name').val());

            formData.append('document_number', $('#doc_number').val());




            formData.append('number', $('#number').val());
            formData.append('categoryid', $('#categoryid').val());
            formData.append('personal_doc', $('#kyc_document').val());
            formData.append('business_kyc', $('#business_kyc').val());
            formData.append('pincode', $('#pincode').val());
            formData.append('latitude', '4545');
            formData.append('longitude', '6565');
            formData.append('description', $('#description').val());
            formData.append('agentid', $('#agentid').val());
            formData.append('transaction_id', $('#transaction_id').val());
            formData.append('locality', $('#areaid').val());
            formData.append('state', state);
            formData.append('account_type', $('#payment_type').val());
            formData.append('price', $('#price').val());
            formData.append('city', city);

formData.append('personal_kyc_img', document.getElementById("personal_kyc_img").files[0]);
formData.append('business_kyc_img', document.getElementById("business_kyc_img").files[0]);
formData.append('image', document.getElementById("image").files[0]);
formData.append('shop_img2', document.getElementById("shop_img2").files[0]);



if($('#transaction_image').val() == undefined || $('#transaction_image').val() == 'undefined' ){
    formData.append('transaction_image', '');

}
else{
formData.append('transaction_image', document.getElementById("transaction_image").files[0]);
   

}


if($('#aadhar_back').val() == undefined || $('#aadhar_back').val() == 'undefined' ){
    formData.append('aadhar_back', '');

}
else{
formData.append('aadhar_back', document.getElementById("aadhar_back").files[0]);
   

}





// //optional



// formData.append('transaction_image', document.getElementById("transaction_image").files[0]);

// if($('#aadhar_back').val() == undefined || $('#aadhar_back').val() == 'undefined' ){
//     formData.append('aadhar_back', '');

// }
// else{
//     formData.append('aadhar_back', document.getElementById("aadhar_back").files[0]);

// }
// formData.append('aadhar_back', document.getElementById("aadhar_back").files[0]);




        }

   
        $.ajax({
            type: "POST",
            url: "/api/save-merchant",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log(response);
                window.location.href = '/success'
            },
            error: function(errResponse) {
                console.log(errResponse);
            }
        });
        



    // }
}
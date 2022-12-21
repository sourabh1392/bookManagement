//--------------- Validation function for ISBN number----------------// 
function checkISBN(str) {
    var re = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    return re.test(str);
}

//--------------- Validation function for Date format----------------// 
function checkDate(str) {
    var re = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/ 
    return re.test(str);
}

//--------Function for Email Validation------------//
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
    return re.test(email);
}

//--------Function for Password------------------//
function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    return re.test(str);
}

//----------function for validation name--------------//
function checkName(str) {
    var re =/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g
    let bool =  re.test(str.trim());
    if(bool==true){
        str = str.trim()
        str= str.replace(str[0], str[0].toUpperCase())
        return str
    }else{
        return false
    }
}

function checkPhone(str) {
    var re = /^(\+\d{1,3}[- ]?)?\d{10}$/
    return re.test(str);
}


const validTitleBooks=function(title){
    const regexTittle=/^[A-Za-z0-9\s\-_,\.;?:()]+$/
    return regexTittle.test(title)
}
  
const isValidAddress =function(name){
    const  nameRegex =/^[a-zA-Z0-9,( \)]{2,20}$/
   return nameRegex.test(name.trim())
}

module.exports= {checkISBN, checkDate, validateEmail, checkPassword, checkName, checkPhone, validTitleBooks, isValidAddress}

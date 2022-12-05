//Input: s = "A man, a plan, a canal: Panama"


var isPalindrome = function(s) {
    let x = s.match(/[a-z]/gi)
    let str1 = ''
    let  str2 = ""
    x.forEach(x=>str1+=x)
    for(let i=x.length-1; i>=0; i--){
        str2+=x[i]
    }
   //let str1 = x.join("").toLowerCase()
   //let str2 = x.reverse().join("").toLowerCase()
   if(str1.toLowerCase()==str2.toLowerCase()){return true}
   else{return false}
};
 //console.log(isPalindrome("A man, a plan, a canal: Panama"))


 let v = {
    name :"   aman     "
 }

 v.name = v.name.trim()
 //console.log(v.name)


 ///^[A-Za-z0-9\s\-_,\.;:()]+$/

 const validTitleBooks=function(title){
    const regexTittle=/^[A-Za-z0-9\s\-_,\.;?:()]+$/
    return regexTittle.test(title)
}
console.log(validTitleBooks("Life is?"))
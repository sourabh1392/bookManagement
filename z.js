// let n = "978dd-3-16-148410-1"

// let x = n.match(/[0-9]/gi)///.match(/[a-z]/gi)
// let digits = n.match(/[a-z]/gi)
// console.log(x)
// console.log(x.length)
// console.log(digits)

// //(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)


// let reISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
// if (!reISBN.test(ISBN)) { return console.log(reISBN)}


//let x = '11-11-2022'

// function isValidDate(dateString)
// {
//     // First check for the pattern
//     let x = (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
//     console.log(x)
       
// }

function checkISBN(str) {
    var re = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    return re.test(str);
}
console.log(checkISBN('1234567890123'))

//"2022-05-10"
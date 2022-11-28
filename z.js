

// let time = new Date()
// let date = time.getDate()
// let month = time.getMonth()+1
// let year = time.getFullYear()
// let x = time.getUTCMonth()
// console.log(year+"-"+month+"-"+date)
// console.log(x)



function run(arr) {
    for(let i=arr.length-1; i>=0; i--){
        arr[i]=arr[i-1]
        
    }
    arr[0] = -1
    return arr
}
console.log(run([1,2,3,4]))

// Input:3     1 1 2
// Output:4
// Explanation: (1, 1) (1, 2) (2, 1) and (2, 2) are all the unique pairs, their count is 4, hence the output 4.


function koi(arr){
    let str = "";
    let res = [];
    for(let i=0; i<arr.length; i++){
        for(let j=0; j<arr.length; j++){
            str = str+arr[i]+arr[j];
            res.push(str)
            str=''
        }
        
    }
    return res.filter((x,i,a)=>a.indexOf(x)==i).length
    
}
console.log(koi([45, 45, 45, 45, 45, 45]))


const bird = {
    size : "small"
}

const mouse ={
    name :"mickey",
    small :true
}

console.log(mouse[bird.size])
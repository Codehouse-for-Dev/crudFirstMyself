const fun = () => { 
    console.log("hello");
}
// fun()
// console.log(fun())

let country = {
    country : "India"
}
function rough (state, something){
    console.log(`${state} \n ${something} \n ${this.country}`);
    
}

let newFunc = rough.bind(country , "Kerala" , "2434")
newFunc()
// console.log(newFunc)

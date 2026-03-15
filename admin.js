let data

async function loadData(){

const res = await fetch("data.json")

data = await res.json()

renderPackages()

}

function renderPackages(){

let html=""

data.packages.forEach((p,i)=>{

html+=`

<div>

${p.name} - ₹${p.price}

<button onclick="deletePackage(${i})">Delete</button>

</div>

`

})

document.getElementById("packageList").innerHTML=html

}

function addPackage(){

const name=document.getElementById("name").value
const price=document.getElementById("price").value
const duration=document.getElementById("duration").value
const image=document.getElementById("image").value

data.packages.push({name,price,duration,image})

renderPackages()

alert("Package added. Update data.json in GitHub to save.")

}

function deletePackage(i){

data.packages.splice(i,1)

renderPackages()

}

loadData()

var apiIng = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=";
var apiDrink = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";
var drink = "";
var drinkHistory = JSON.parse(localStorage.getItem("drinkHistory")) || [];
var formEl = $("#searchForm");
var inputEl = $("#termInput");
var drinkDisplay = $(".drinkDisplay")
var resetbutton = $("#resetbtn");
var selectedDrinkID = $("drink-id");

console.log("HERE ARE YOUR DRINK HISTORY, if you want to consume", drinkHistory)

formEl.on("submit", function (e) {
  
  e.preventDefault()
  var term = inputEl.val()
  var url = apiIng + term;
  console.log(term);
  //fetch
  fetch(`${url}`)
  .then(response => {
    return response.json()
    
  }).then(data => {
    console.log(data);
    document.querySelector('.drinkDisplay').innerHTML="";
    for (var i=0; i<data.drinks.length; i++) {
      var drinkData = data.drinks[i];
      createDrinkCard(drinkData)
  }


  }).catch(err => console.log(err));




});

//function that takes a drink's data and creates a drink card and put it on the page

function createDrinkCard(data){

  var drinkDiv = document.createElement("div");
  drinkDiv.setAttribute("drink-id", data.idDrink)
  drinkDiv.setAttribute("class", "alldrinks")
  drinkDiv.innerHTML += `
  <div style="vertical-align: middle;">
    <img style="flex-grow: 1; height: 200px;" src="${data.strDrinkThumb}" />
    <p style ="inline-size:200px">${data.strDrink}</p>
  </div>
`   
document.querySelector('.drinkDisplay').appendChild(drinkDiv)
   drinkDiv.addEventListener('click', function() {
 var drinkId = this.getAttribute("drink-id")
  var drinkIDS = (this.getAttribute("drink-id"));
  localStorage.setItem("drink-id", drinkIDS);
  getOneDrink(drinkId)
  //if you want to store all the drinks that user clicks on 
  saveDrinkHistory(drinkId)
  // Come back to this later
  // var oldIDS = localStorage.getItem("drink-id");
  // if (oldIDS) {
  //   oldIDS = JSON.parse(oldIDS)
  // }else {
  //   oldIDS = [];
  // }
  // //oldIDS.push('drink-id')
  // localStorage.setItem('drink-ids',JSON.stringify(oldIDS));
  // on click use apiDrink + drink-id to display drink with ingredients and instructions 
});
}



// TODO function that takes a drink's data and store in localStorage as favorite drinks
function saveToFavorites(drinkData){
  //saves to localStorage
}

function saveDrinkHistory(drinkId){
  //deduplicate the array;
  //only push if array doesn't already have this id
  drinkHistory.push(drinkId);
  localStorage.setItem("drinkHistory", JSON.stringify(drinkHistory));
}


function getOneDrink(drinkId){

  console.log("here's yo drink id", drinkId)
  //TODO - use drinkID and build API call, test to see if get data
  let theDrink = drinkId
  console.log("here is theDrink", theDrink)
  url2 = apiDrink + theDrink
    console.log( "here is the url", url2)  
    fetch(`${url2}`)
    .then(response => {
    return response.json()
    
  }).then(data => {
    console.log(data);
    document.querySelector('.singleDrink').innerHTML="";
    //filter_array_values(data)
    
      var selectedDrink = data.drinks[0]
      console.log("here is a selected drink", selectedDrink);
      var drinkIngredients = []
      for(var i = 1; i < 16; i++) {
        var name = selectedDrink['strIngredient'+i];
        //if there's an ingredient name, add to the list
        if(name){
          drinkIngredients.push({name: name.trim(), measurement: selectedDrink['strMeasure'+i]?.trim()})
        }else{
          break;
        }
      }
      selectedDrink.ingredients = drinkIngredients
      createMainDrinkCard(cleanUpNullish(selectedDrink));
;
    
  }).catch(err => console.log(err));

}

// function filter_array_values(arr) {
//   arr = arr.filter(isEligible);
//   return arr;
// }

// function isEligible(value) {
//   if(value !== false || value !== null || value !== 0 || value !== "") {
//     return value;
//   }
// }

function createMainDrinkCard(selectedDrink) {
  console.log("HERE'S YO DATA", selectedDrink);
var drinkSection = document.createElement("div");
drinkSection.setAttribute("drinkchoice", selectedDrink.idDrink)
drinkSection.setAttribute("class", "theDrinkSelected");
drinkSection.innerHTML += `
<div style ="vertical-align: middle; align-content:center; max-height: 100px; max-width: 100px;">
 <img style ="flex-grow: 1; height: 100px;" src="${selectedDrink.strDrinkThumb}" />
 <p>selectedDrink.ingredients</p>
</div>
 `
// if(getOneDrink()) {
  $('.drinkDisplay').hide();
  $('.singleDrink').append(drinkSection);
//   $('theDrinkSelected').removeId('hide');
//   //$('theDrinkSelected').addId('show');
// }
 }


 //this function is a utility that takes an object and removes the nullish fields
 var cleanUpNullish = obj => {
  Object.keys(obj).forEach(key => {
      obj[key] === null && (delete obj[key])
  });
  return obj
}


function clearInput() {
  document.getElementById("searchForm").reset();
  document.querySelector('.drinkDisplay').innerHTML="";
};

$("#resetbtn").on("click", clearInput)
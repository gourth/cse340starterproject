'use strict' 
 
 // Get a list of items in inventory based on the classification_id 
 let upgradeList = document.querySelector("#upgrade_id")
 console.log("test")
 upgradeList.addEventListener("change", function () { 
    console.log("help")
  let upgrade_id = upgradeList.value 
  console.log(`upgrade_id is: ${upgrade_id}`) 
  let classIdURL = "/inv/upgrade/"+upgrade_id 
 
  fetch(classIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { 
   console.log(data); 
    buildUpgradeDisplay(data); 
  }) 
  .catch(function (error) { 
   console.log('There was a problem: ', error.message) 
  }) 
 })



// Build inventory items into HTML table components and inject into DOM 
function buildUpgradeDisplay(data) { 
    let upgradeDisplay = document.getElementById("upgradeDisplay"); 
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Upgrade Details</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) { 
      dataTable += '<tr>';
      dataTable += `<td>Upgrade Name: ${element.upgrade_name}</td>`;
      
      dataTable += '<tr>';
      dataTable += `<td>Upgrade Description: ${element.upgrade_description}</td>`;
      
      dataTable += '<tr>';
      dataTable += `<td>Upgrade Price: $${element.upgrade_price}</td>`;
      dataTable += '</tr>';
    });
    dataTable += '</tbody>'; 
    // Display the contents in the Inventory Management view 
    upgradeDisplay.innerHTML = dataTable; 
   }


  
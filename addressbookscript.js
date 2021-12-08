$(function() {

    //Initialise empty array to store contact data when a input is submitted;
    let contacts = []
  
    //List functions to be called by event listeners 
  
    //function which allows user to edit address or number
    function editButtonClick(button) {
      button.parent().parent().attr("contenteditable", "true");
      button.parent().parent().next().attr("contenteditable", "true")
      button.attr("style", "display: none");
      button.next().attr("style", "display: visible");
    }
  
    //function which allows user to delete contact
    function deleteButtonClick(button) {
      let deleteIndex = contacts.findIndex((element) => button.parent().parent().children()[0].textContent.includes(element.fullname));
      contacts.splice(deleteIndex, 1);
      button.parent().parent().next().remove();
      button.parent().parent().next().remove();
      button.parent().parent().remove();
    }
  
    //function which allows user to save a contact after editing
    function saveButtonClick(button) {
      button.parent().parent().attr("contenteditable", "false");
      button.parent().parent().next().attr("contenteditable", "false");
      button.attr("style", "display: none");
      button.prev().attr("style", "display: visible");
    }
  
    //function to reveal address when you click on name.
    function showOrHideContact(row) {
      if (row.next().attr("style") === "display: none") {
        row.next().attr("style", "display: visible");
        row.next().next().attr("style", "display: visible");
      } else {
        row.next().attr("style", "display: none");
        row.next().next().attr("style", "display: none");
      }
    }
  
    //Initialise variable for addButton
    let addButton = $("#addcontact");
  
    //function which shows the 'form' when called
    function showForm() {
      $(form).attr("style", "display: visible");
      addButton.attr("style", "display: none");
    }
  
    //variable to store submit button 
    let submitButton = $("#submit");
  
    //function which handles what happens when submit button is clicked
    function submitForm() {
      //Hide submit button and show add contact button
      $("#form").attr("style", "display: none");
      addButton.attr("style", "display: visible");
  
      //Select all 'form' data
      let addContactData = $('#form .newcontact');
  
      //add 'form' data to a new object called 'inputData'
      let inputData = {
        forename: addContactData[0].value,
        secondname: addContactData[1].value,
        phonenumber: addContactData[2].value,
        address: addContactData[3].value,
        fullname: addContactData[0].value + " " + addContactData[1].value,
        fullnamestring: addContactData[0].value.toLowerCase() + addContactData[1].value.toLowerCase(),
      }
      //push this object to the array declared earlier called contacts
      contacts.push(inputData);
      //sort function to sort objects array according to name.
      //sort function snippet taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
      contacts.sort(function(a, b) {
        let nameA = a.fullname.toLowerCase();
        let nameB = b.fullname.toLowerCase();
  
        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        }
  
        return 0;
      });
      //find the index of the new object added to the contacts array after sorting
      let tableIndex = contacts.findIndex((element) => element.fullnamestring === inputData.fullnamestring);
  
      //Clear fields for future submissions
      $("#form .newcontact").val("");
  
      //Insert new row in table, using the index of the inputData object in the contacts array to add the new contact to the correct position in the table
      let tableBody = $("#addressBook");
      //Make sure to consider boundary cases such as where the contact is the first one to be added, or if it is last in the table alphabetically
      if (contacts.length === 1 || tableIndex === contacts.length - 1) {
        tableBody.append(`<tr class="row contactrow" style="display none" contenteditable="false">
            <td colspan="2">${inputData.fullname}</td>
            <td><button class="delete" contenteditable="false"><span class="material-icons">
                  delete_outline
                </span></button>
            </td>
          </tr>
          <tr class="row numberrow" style="display:none" contenteditable="false">
            <td colspan="2">Number: ${inputData.phonenumber}</td>
            <td colspan="1"><button class="edit" contenteditable="false" rowspan="2"><span class="material-icons">
                  edit_note
                </span></button>
            <button class="save" contenteditable="false" style="display:none" rowspan="2"><span class="material-icons">
                  save
                </span></button>
            </td>
          </tr>
          <tr class="row addressrow" style="display:none" contenteditable="false">
            <td>Address: ${inputData.address}</td>
          </tr>`)
      }
      //else append before the element at the same index as the object in the contacts array
      else {
        tableBody.children()[3 * tableIndex].insertAdjacentHTML("beforebegin", `<tr class="row contactrow" style="display none" contenteditable="false">
            <td colspan="2">${inputData.fullname}</td>
            <td><button class="delete" contenteditable="false"><span class="material-icons">
                  delete_outline
                </span></button>
            </td>
          </tr>
          <tr class="row numberrow" style="display:none" contenteditable="false">
            <td colspan="2">Number: ${inputData.phonenumber}</td>
            <td colspan="1"><button class="edit" contenteditable="false" rowspan="2"><span class="material-icons">
                  edit_note
                </span></button>
            <button class="save" contenteditable="false" style="display:none" rowspan="2"><span class="material-icons">
                  save
                </span></button>
            </td>
          </tr>
          <tr class="row addressrow" style="display:none" contenteditable="false">
            <td>Address: ${inputData.address}</td>
          </tr>`);
      }
    }
  
    //Now write search function which looks through contacts according to the string typed in the search bar
    //For this function I followed the tutorial from the following link: https://www.jamesqquick.com/blog/build-a-javascript-search-bar
    let searchInput = $("#searchentry");
  
    function searchName(event) {
      let searchString = event.target.value;
      //Split string if space included in search entry, and then rejoin without the space
      if (searchString.includes(" ")) {
        searchString = searchString.split(" ").join("");
      }
      //Get rows in address book
      let addressBookRows = $(".row");
      //loop through contacts array to find matches. If a match set relevant row displays to visible, else hide row displays so not shown.
      let contactLength = contacts.length;
      for (let i = 0; i < contactLength; i++) {
        if (!contacts[i].fullnamestring.includes(searchString.toLowerCase())) {
          addressBookRows[3 * i].setAttribute("style", "display: none");
          addressBookRows[3 * i + 1].setAttribute("style", "display: none");
          addressBookRows[3 * i + 2].setAttribute("style", "display: none");
        } else {
          addressBookRows[3 * i].setAttribute("style", "display: visible");
        }
      }
    }
  
    //function for hide button
    let hideButton = $("#hide");
  
    function hideForm() {
      $("#form").attr("style", "display:none");
      addButton.attr("style", "display:visible");
    }
  
    //Event listener for delete button
    //n.b. Used https://makitweb.com/attach-event-to-dynamically-created-elements-with-jquery/ to understand how to code event listeners to dynamically added elements by referencing a parent element
    $("tbody").on("click", ".delete", function() {
      deleteButtonClick($(this))
    });
  
    //Similar event listeners for edit and save button
    $("tbody").on("click", ".edit", function() {
      editButtonClick($(this))
    });
    $("tbody").on("click", ".save", function() {
      saveButtonClick($(this))
    });
  
    //Event listener for hiding or displaying the contact details
    $("tbody").on("click", ".contactrow", function() {
      showOrHideContact($(this))
    });
  
    //event listener for showForm on click of 'Add Contact' button
    addButton.on("click", showForm);
  
    //Event listener for submit button
    submitButton.on("click", submitForm);
  
    //Event listener for search bar
    searchInput.on("keyup", searchName);
  
    //Event listener for Hide button
    hideButton.on("click", hideForm);
  
  })
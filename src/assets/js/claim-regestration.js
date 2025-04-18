var current = 0;
var tabs = $('.tab');
var tabs_pill = $('.tab-pills');
var progressText = $(".tab-pills p");
var progressCheck = $(".check");
var bullet = $(".bullet");

loadFormData(current);

function loadFormData(n) {
    $(tabs_pill[n]).addClass('active');
    $(tabs[n]).removeClass('d-none');
    $(bullet[n]).addClass('active');
    $(progressCheck[n]).addClass('active');
    $(progressText[n]).addClass('active');
    // $(progressComplete[n]).addClass('completed');
    // $(progressTextComplete[n]).addClass('completed');
    $('#back_button').attr('disabled', n == 0 ? true : false);
    n == tabs.length - 1 ?
        $('#next_button').text('REGISTER').removeAttr('onclick') :
        $('#next_button')
        .attr('type', 'button')

    .attr('onclick', 'next()');
}

function next() {
    $(tabs[current]).addClass('d-none');
    $(tabs_pill[current]).removeClass('active');
    $(tabs_pill[current]).addClass('completed');
    $(bullet[current]).addClass('completed');
    $(progressCheck[current]).addClass('completed');
    $(progressText[current]).addClass('completed');

    $(bullet[current]).removeClass('active');
    $(progressCheck[current]).removeClass('active');
    $(progressText[current]).removeClass('active');
    current++;
    loadFormData(current);
}

function back() {
    $(tabs[current]).addClass('d-none');
    $(tabs_pill[current]).removeClass('active');
    $(tabs_pill[current]).addClass('completed');
    $(bullet[current]).addClass('completed');
    $(progressCheck[current]).addClass('completed');
    $(progressText[current]).addClass('completed');

    $(bullet[current]).removeClass('active');
    $(progressCheck[current]).removeClass('active');
    $(progressText[current]).removeClass('active');
    current--;
    loadFormData(current);
}


filterSelection("non")

function filterSelection(c) {
    var x, i;
    x = document.getElementsByClassName("filterDiv");
    if (c == "all") c = "";
    for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");
        if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
    }
}

function w3AddClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
            element.className += " " + arr2[i];
        }
    }
}

function w3RemoveClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(" ");
}



var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("table-btn");

// Add a click event listener to each button
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        // Remove the "active" class from all buttons
        for (var j = 0; j < btns.length; j++) {
            btns[j].classList.remove("active");
        }

        // Add the "active" class to the clicked button
        this.classList.add("active");
    });
}

// const el = document.getElementById('productselection');

// const box = document.getElementById('product1');

// el.addEventListener('change', function handleChange(event) {
//     if (event.target.value === 'Cashless') {
//         box.style.display = 'flex';
//     } else {
//         box.style.display = 'none';
//     }
// });
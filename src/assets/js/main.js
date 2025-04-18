//------------------Left Menubar------------------//
$('#toggle-left-menu').click(function() {
    if ($('#left-menu').hasClass('small-left-menu')) {
        $('#left-menu').removeClass('small-left-menu');
    } else {
        $('#left-menu').addClass('small-left-menu');
    }
    $('#logo').toggleClass('small-left-menu');
    $('#page-container').toggleClass('small-left-menu');
    $('#header .header-left').toggleClass('small-left-menu');

    $('#logo .big-logo').toggle('300');
    $('#logo .small-logo').toggle('300');
    $('#logo').toggleClass('p-0 pl-1');
});

$(document).on(
    'mouseover',
    '#left-menu.small-left-menu > ul > li',
    function() {
        if (!$(this).hasClass('has-sub')) {
            var label = $(this).find('span').text();
            var position = $(this).position();
            $('#show-lable').css({
                top: position.top + 79,
                left: position.left + 59,
                opacity: 1,
                visibility: 'visible',
            });

            $('#show-lable').text(label);
        } else {
            var position = $(this).position();
            $(this).find('ul').addClass('open');

            if ($(this).find('ul').hasClass('open')) {
                var height = 47;
                var count_submenu_li = $(this).find('ul > li').length;
                if (position.top >= 580) {
                    var style = {
                        top: position.top + 100 - height * count_submenu_li,
                        height: height * count_submenu_li + 'px',
                    };
                    $(this).find('ul.open').css(style);
                } else {
                    var style = {
                        top: position.top + 79,
                        height: height * count_submenu_li + 'px',
                    };

                    $(this).find('ul.open').css(style);
                }
            }
        }
    }
);

$(document).on('mouseout', '#left-menu.small-left-menu li a', function(e) {
    $('#show-lable').css({
        opacity: 0,
        visibility: 'hidden',
    });
});

$(document).on(
    'mouseout',
    '#left-menu.small-left-menu li.has-sub',
    function(e) {
        $(this).find('ul').css({
            height: 0,
        });
    }
);

$(window).resize(function() {
    windowResize();
});

$(window).on('load', function() {
    windowResize();
});

$('#left-menu li.has-sub > a').click(function() {
    var _this = $(this).parent();

    _this.find('ul').toggleClass('open');
    $(this).closest('li').toggleClass('rotate');

    _this
        .closest('#left-menu')
        .find('.open')
        .not(_this.find('ul'))
        .removeClass('open');
    _this
        .closest('#left-menu')
        .find('.rotate')
        .not($(this).closest('li'))
        .removeClass('rotate');
    _this.closest('#left-menu').find('ul').css('height', 0);

    if (_this.find('ul').hasClass('open')) {
        var height = 47;
        var count_submenu_li = _this.find('ul > li').length;
        _this.find('ul').css('height', height * count_submenu_li + 'px');
    }
});

function windowResize() {
    var width = $(window).width();
    if (width <= 992) {
        $('#left-menu').addClass('small-left-menu');
        $('#logo').addClass('small-left-menu p-0 pl-1');
    } else {
        $('#left-menu').removeClass('small-left-menu');
        $('#logo').removeClass('small-left-menu p-0 pl-1');
    }
}

//------------------Multiple select--------------------//

$(document).ready(function() {
    var multipleCancelButton = new Choices('#bussiness-no', {
        removeItemButton: true,
        maxItemCount: 5,
        searchResultLimit: 5,
        renderChoiceLimit: 5,
    });
});

//-------------------Multiple select------------------//
$(document).ready(function() {
    var multipleCancelButton = new Choices('#affiliations', {
        removeItemButton: true,
        maxItemCount: 5,
        searchResultLimit: 5,
        renderChoiceLimit: 5,
    });
});


//-------------------Multiple select-----------------//
$(document).ready(function() {
    var multipleCancelButton = new Choices('#product-category', {
        removeItemButton: true,
        maxItemCount: 5,
        searchResultLimit: 5,
        renderChoiceLimit: 5,
    });
});
//-- -- -- -- -- -- - Onboarding Tab-- -- -- -- -- -- -- -- - //
// var current = 0;
// var tabs = $('.tab');
// var tabs_pill = $('.tab-pills');

// loadFormData(current);

// function loadFormData(n) {
//     $(tabs_pill[n]).addClass('active');
//     $(tabs[n]).removeClass('d-none');
//     $('#back_button').attr('disabled', n == 0 ? true : false);
//     n == tabs.length - 1 ?
//         $('#next_button').text('Submit').removeAttr('onclick') :
//         $('#next_button')
//         .attr('type', 'button')

//     .attr('onclick', 'next()');
// }

// function next() {
//     $(tabs[current]).addClass('d-none');
//     $(tabs_pill[current]).removeClass('active');

//     current++;
//     loadFormData(current);
// }

// function back() {
//     $(tabs[current]).addClass('d-none');
//     $(tabs_pill[current]).removeClass('active');

//     current--;
//     loadFormData(current);
// }

//------------Image upload and preview---------------//

// JavaScript function to handle the image preview
function previewImage(event) {
    var input = event.target;
    var previewContainer = document.getElementById('preview-container');
    var previewImage = document.getElementById('preview-image');

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block'; // Show the preview container
        };

        reader.readAsDataURL(input.files[0]);
    }
}


// JavaScript function to handle the image preview
function previewImageTwo(event) {
    var input = event.target;
    var previewContainer = document.getElementById('preview-container2');
    var previewImage = document.getElementById('preview-image2');

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block'; // Show the preview container
        };

        reader.readAsDataURL(input.files[0]);
    }
}

//-----------------------//
function getFile() {
    document.getElementById('upfile').click();
}

function sub(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourBtn').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}
//-----------------------//
function getPan() {
    document.getElementById('upPan').click();
}

function subPan(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourPan').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}

//-----------------------//
function getPan2() {
    document.getElementById('upPan2').click();
}

function subPan2(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourPan2').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}

//-------------------------------//

function getCheque() {
    document.getElementById('upCheque').click();
}

function subCheque(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourCheque').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}

//-------------------------------//

function getCheque2() {
    document.getElementById('upCheque2').click();
}

function subCheque2(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourCheque2').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}


//-------------------------------//

function getGstNo() {
    document.getElementById('upGst').click();
}

function subGstNo(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourGst').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}

//-------------------------------//

//-------------------------------//

function getGstNo2() {
    document.getElementById('upGst2').click();
}

function subGstNo2(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourGst2').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}

//--------------------------------//

function getLicense() {
    document.getElementById('upfile').click();
}

function subLicense(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourBtn').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}

//--------------------------------//

function getUpload() {
    document.getElementById('upfile').click();
}

function subUpload(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourBtn').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}


//------------- Cost Plan Tab-----------------//
// var current = 0;
// var tabs = $('.tab');
// var tabs_pill = $('.tab-button');

// loadFormData(current);

// function loadFormData(n) {
//     $(tabs_pill[n]).addClass('active');
//     $(tabs[n]).removeClass('d-none');
//     $('#back_button').attr('disabled', n == 0 ? true : false);
//     n == tabs.length - 1 ?
//         $('#next_button').text('SUBMIT').removeAttr('onclick') :

//         $('#next_button')
//         .attr('type', 'button')

//     .attr('onclick', 'next()');
// }

// function next() {
//     $(tabs[current]).addClass('d-none');
//     $(tabs_pill[current]).removeClass('active');

//     current++;
//     loadFormData(current);
// }

// function back() {
//     $(tabs[current]).addClass('d-none');
//     $(tabs_pill[current]).removeClass('active');

//     current--;
//     loadFormData(current);
// }



//--------------------------------//

function getSlab() {
    document.getElementById('upfile').click();
}

function subSlab(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourBtn').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}


//--------------------


function changeInput() {
    document.getElementById("filename").value = document.getElementById('file').value;
}

// Date Picker JS 

var getDatePickerTitle = elem => {
    // From the label or the aria-label
    const label = elem.nextElementSibling;
    let titleText = '';
    if (label && label.tagName === 'LABEL') {
        titleText = label.textContent;
    } else {
        titleText = elem.getAttribute('aria-label') || '';
    }
    return titleText;
}

var elems = document.querySelectorAll('.datepicker_input');
for (const elem of elems) {
    const datepicker = new Datepicker(elem, {
        'format': 'dd/mm/yyyy', // UK format
        title: getDatePickerTitle(elem)
    });
}


//--------------------------------//

function getDocument() {
    document.getElementById('updoc').click();
}

function subDocument(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourDoc').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}

//--------------------------------//

function getDocument2() {
    document.getElementById('updoc2').click();
}

function subDocument2(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourDoc2').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}

//--------------------------------//

function getDocument3() {
    document.getElementById('updoc3').click();
}

function subDocument3(obj) {
    var file = obj.value;
    var fileName = file.split('\\');
    document.getElementById('yourDoc3').innerHTML = fileName[fileName.length - 1];
    document.myForm.submit();
    event.preventDefault();
}
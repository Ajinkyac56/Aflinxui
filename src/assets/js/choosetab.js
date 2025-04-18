var current = 1;
var tabs = $('.tab');
var tabs_pill = $('.tab-pills');
var progressText = $(".tab-pills p");
var progressCheck = $(".check");
var bullet = $(".bullet");

loadFormData(current);

function loadFormData(n)
 {
  $(tabs_pill[n]).addClass('active');
  $(tabs[n]).removeClass('d-none');
  $(bullet[n]).addClass('active');
  $(progressCheck[n]).addClass('active');
  $(progressText[n]).addClass('active');
  // $(progressComplete[n]).addClass('completed');
  // $(progressTextComplete[n]).addClass('completed');
  $('#back_button').attr('disabled', n == 1 ? true : false);
  n == tabs.length - 1 ?
    $('#next_button').text('SUBMIT').removeAttr('onclick') :
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
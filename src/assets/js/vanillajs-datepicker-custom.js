$(document).ready(function () {
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
  };

  var elems = document.querySelectorAll('.datepicker_input');
  for (const elem of elems) {
    const datepicker = new Datepicker(elem, {
      format: 'dd/mm/yyyy', // UK format
      title: getDatePickerTitle(elem),
    });
    elem.addEventListener('changeDate', function(e) {
      console.log('Date Selected:', e.detail.date);
      const customEvent = document.createEvent('Event');  
      customEvent.initEvent('change', true, true);
      elem.dispatchEvent(customEvent);
    });
  }
});

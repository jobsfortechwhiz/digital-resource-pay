
/**
 * TECHSPACE PAYMENT PAGE
 *
 * GitHub Pages frontend
 * Google Apps Script backend
 */


// ==================================================
// 1. GOOGLE APPS SCRIPT URL
// ==================================================

const GAS_URL =
  'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';


// ==================================================
// 2. PAGE ELEMENTS
// ==================================================

const paymentForm =
  document.getElementById('paymentForm');

const submitBtn =
  document.getElementById('submitBtn');

const result =
  document.getElementById('result');

const screenshotInput =
  document.getElementById('screenshot');

const fileInfo =
  document.getElementById('fileInfo');

const confirmationDialog =
  document.getElementById('confirmationDialog');

const closeDialog =
  document.getElementById('closeDialog');


// ==================================================
// 3. COPY BUTTONS
// ==================================================

document.querySelectorAll('[data-copy]')
  .forEach(function(button) {

    button.addEventListener('click', function() {

      const text =
        button.getAttribute('data-copy');


      if (!text || text.startsWith('YOUR_')) {

        alert(
          'Please configure the payment details first.'
        );

        return;

      }


      copyText(text, button);

    });

  });


async function copyText(text, button) {

  try {

    await navigator.clipboard.writeText(text);

    const originalText =
      button.textContent;


    button.textContent =
      'Copied ✓';


    setTimeout(function() {

      button.textContent =
        originalText;

    }, 1500);


  } catch (error) {

    // Fallback for browsers where clipboard
    // permission is unavailable.

    const temporaryInput =
      document.createElement('input');


    temporaryInput.value =
      text;


    document.body.appendChild(
      temporaryInput
    );


    temporaryInput.select();


    document.execCommand('copy');


    temporaryInput.remove();


    button.textContent =
      'Copied ✓';


    setTimeout(function() {

      button.textContent =
        'Copy';

    }, 1500);

  }

}


// ==================================================
// 4. FILE SELECTION
// ==================================================

screenshotInput.addEventListener(
  'change',
  function() {

    const file =
      screenshotInput.files[0];


    if (!file) {

      fileInfo.textContent =
        '';

      return;

    }


    const maxSize =
      5 * 1024 * 1024;


    if (file.size > maxSize) {

      fileInfo.textContent =
        'Please choose an image smaller than 5 MB.';


      screenshotInput.value =
        '';

      return;

    }


    if (!file.type.startsWith('image/')) {

      fileInfo.textContent =
        'Please choose a valid image file.';


      screenshotInput.value =
        '';

      return;

    }


    fileInfo.textContent =
      'Selected: ' + file.name;

  }

);


// ==================================================
// 5. PAYMENT SUBMISSION
// ==================================================

paymentForm.addEventListener(
  'submit',
  async function(event) {

    event.preventDefault();


    const name =
      document.getElementById('name')
        .value
        .trim();


    const email =
      document.getElementById('email')
        .value
        .trim()
        .toLowerCase();


    const method =
      document.getElementById('method')
        .value;


    const file =
      screenshotInput.files[0];


    // ----------------------------------------------
    // Validate form
    // ----------------------------------------------

    if (!name || !email || !method || !file) {

      result.textContent =
        'Please complete all required fields.';

      return;

    }


    if (!isValidEmail(email)) {

      result.textContent =
        'Please enter a valid email address.';

      return;

    }


    if (!file.type.startsWith('image/')) {

      result.textContent =
        'Please upload a valid image screenshot.';

      return;

    }


    if (file.size > 5 * 1024 * 1024) {

      result.textContent =
        'Screenshot must be smaller than 5 MB.';

      return;

    }


    // ----------------------------------------------
    // Disable button
    // ----------------------------------------------

    submitBtn.disabled =
      true;


    submitBtn.textContent =
      'Submitting...';


    result.textContent =
      'Uploading your payment screenshot...';


    try {

      // --------------------------------------------
      // Convert screenshot to base64
      // --------------------------------------------

      const screenshot =
        await fileToBase64(file);


      // --------------------------------------------
      // Prepare payment data
      // --------------------------------------------

      const paymentData = {

        name: name,

        email: email,

        amount: '499',

        method: method,

        screenshot: screenshot

      };


      // --------------------------------------------
      // Submit to Google Apps Script
      // --------------------------------------------

      const form =
        document.createElement('form');


      form.method =
        'POST';


      form.action =
        GAS_URL;


      form.target =
        'gasFrame';


      const hiddenInput =
        document.createElement('input');


      hiddenInput.type =
        'hidden';


      hiddenInput.name =
        'data';


      hiddenInput.value =
        JSON.stringify(paymentData);


      form.appendChild(
        hiddenInput
      );


      document.body.appendChild(
        form
      );


      form.submit();


      // --------------------------------------------
      // Show confirmation dialog
      // --------------------------------------------

      result.textContent =
        '';


      confirmationDialog.hidden =
        false;


      paymentForm.reset();


      fileInfo.textContent =
        '';


    } catch (error) {

      console.error(error);


      result.textContent =
        'Unable to submit payment details. Please try again.';


    } finally {

      submitBtn.disabled =
        false;


      submitBtn.textContent =
        'DONE — SUBMIT PAYMENT';

    }

  }

);


// ==================================================
// 6. CLOSE CONFIRMATION DIALOG
// ==================================================

closeDialog.addEventListener(
  'click',
  function() {

    confirmationDialog.hidden =
      true;

  }

);


// ==================================================
// 7. CLOSE DIALOG BY CLICKING OUTSIDE
// ==================================================

confirmationDialog.addEventListener(
  'click',
  function(event) {

    if (
      event.target === confirmationDialog
    ) {

      confirmationDialog.hidden =
        true;

    }

  }

);


// ==================================================
// 8. HELPER FUNCTIONS
// ==================================================

function fileToBase64(file) {

  return new Promise(function(resolve, reject) {

    const reader =
      new FileReader();


    reader.onload =
      function() {

        resolve(reader.result);

      };


    reader.onerror =
      function() {

        reject(
          new Error('Unable to read screenshot.')
        );

      };


    reader.readAsDataURL(file);

  });

}


function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

}

/**
 * TECHSPACE PAYMENT PAGE
 *
 * File: pay.js
 *
 * Handles:
 * 1. Copy payment details
 * 2. Screenshot validation
 * 3. Payment submission
 * 4. Confirmation dialog
 */


// ==================================================
// 1. GOOGLE APPS SCRIPT WEB APP URL
// ==================================================

const GAS_URL =
'https://script.google.com/macros/s/AKfycbybGBnUvU4AVn3BxacrRGu5eo-Nap88dD441liL9R0jGgUoWEaGG19q-jAFz9I4ge2p3w/exec';

  // 'https://script.google.com/macros/s/AKfycbybGBnUvU4AVn3BxacrRGu5eo-Nap88dD441liL9R0jGgUoWEaGG19q-jAFz9I4ge2p3w/exec';


// ==================================================
// 2. PAYMENT CONFIGURATION
// ==================================================

const PAYMENT_AMOUNT = '40';

// ===============================
// PAYMENT DETAILS
// ===============================

const PAYMENT_DETAILS = {

    // UPI
    upiId: "Techmindspace26@ybl",

    // QR image
    qrImage: "images/tech.PNG",

    // PayPal
   paypalLink: "https://www.paypal.com/ncp/payment/CGQLYWWVBXK5L",

    // Bank transfer
    bankAccountNumber: "105155300001220",
    bankIfsc: "YESB0001051",

    // Payment amount
    amount: "40",
    currency: "INR"
};


// ==================================================
// 3. PAGE ELEMENTS
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

// const closeDialog =
//   document.getElementById('closeDialog');

  document.addEventListener("DOMContentLoaded", function () {

    // QR
    const qrImage = document.getElementById("qrImage");

    if (qrImage) {
        qrImage.src = PAYMENT_DETAILS.qrImage;
    }


    // Masked UPI
    const upiId = document.getElementById("upiId");

    if (upiId) {
        upiId.textContent =
            maskUpi(PAYMENT_DETAILS.upiId);
    }


    // Masked bank account
    const bankAccount =
        document.getElementById("bankAccount");

    if (bankAccount) {
        bankAccount.textContent =
            maskAccountNumber(
                PAYMENT_DETAILS.bankAccountNumber
            );
    }


    // Masked IFSC
    const bankIfsc =
        document.getElementById("bankIfsc");

    if (bankIfsc) {
        bankIfsc.textContent =
            maskIfsc(
                PAYMENT_DETAILS.bankIfsc
            );
    }


    // PayPal
   const paypalButton =
            document.getElementById(
                "paypalPaymentLink"
            );

        if (paypalButton) {

            paypalButton.href =
                PAYMENT_DETAILS.paypalLink;

        }

});

// ==========================================
// MASKING
// ==========================================

function maskUpi(upi) {

    if (!upi) {
        return "UPI not configured";
    }

    const parts = upi.split("@");

    if (parts.length !== 2) {
        return "****";
    }

    const username = parts[0];
    const provider = parts[1];

    if (username.length <= 2) {
        return "**@" + provider;
    }

    return username.substring(0, 2) +
           "*".repeat(username.length - 2) +
           "@" +
           provider;
}


function maskAccountNumber(account) {

    if (!account) {
        return "****";
    }

    if (account.length <= 4) {
        return "*".repeat(account.length);
    }

    return "*".repeat(account.length - 4) +
           account.slice(-4);
}


function maskIfsc(ifsc) {

    if (!ifsc) {
        return "****";
    }

    if (ifsc.length <= 4) {
        return "*".repeat(ifsc.length);
    }

    return ifsc.substring(0, 4) +
           "*".repeat(ifsc.length - 4);
}

// ==================================================
// 4. COPY BUTTONS
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

  const originalText =
    button.textContent;


  try {

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      await navigator.clipboard.writeText(text);

    } else {

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

    }


    button.textContent =
      'Copied ✓';


    setTimeout(function() {

      button.textContent =
        originalText;

    }, 1500);


  } catch (error) {

    console.error(
      'Copy failed:',
      error
    );


    alert(
      'Unable to copy. Please copy the value manually.'
    );

  }

}

// ==========================================
// COPY PAYMENT DETAILS
// ==========================================

function getPaymentValue(type) {

    switch (type) {

        case "upi":
            return PAYMENT_DETAILS.upiId;

        case "account":
            return PAYMENT_DETAILS.bankAccountNumber;

        case "ifsc":
            return PAYMENT_DETAILS.bankIfsc;

        default:
            return "";
    }
}


// ------------------------------------------
// Main copy function
// ------------------------------------------

async function copyPaymentDetail(type, button) {

    const value = getPaymentValue(type);

    if (!value || value.trim() === "") {

        alert("Payment detail is not configured.");

        return;
    }


    try {

        // Try modern Clipboard API first
        if (navigator.clipboard &&
            window.isSecureContext) {

            await navigator.clipboard.writeText(value);

            showCopied(button);

            return;
        }

        // Otherwise use fallback
        copyUsingFallback(value, button);

    }
    catch (error) {

        console.error("Clipboard error:", error);

        copyUsingFallback(value, button);
    }
}


// ------------------------------------------
// Fallback copy method
// ------------------------------------------

function copyUsingFallback(value, button) {

    const textArea =
        document.createElement("textarea");

    textArea.value = value;

    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "0";

    textArea.setAttribute("readonly", "");

    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(
        0,
        textArea.value.length
    );


    let successful = false;

    try {

        successful =
            document.execCommand("copy");

    }
    catch (error) {

        console.error(
            "Fallback copy failed:",
            error
        );

    }


    document.body.removeChild(textArea);


    if (successful) {

        showCopied(button);

    }
    else {

        alert(
            "Copy failed. Please copy the value manually."
        );

    }
}


// ------------------------------------------
// Show "Copied!"
// ------------------------------------------

function showCopied(button) {

    const oldText =
        button.textContent;

    button.textContent = "Copied!";

    button.classList.add("copied");


    setTimeout(function () {

        button.textContent = oldText;

        button.classList.remove("copied");

    }, 1500);
}


// ------------------------------------------
// Attach Copy buttons
// ------------------------------------------

document
    .querySelectorAll(".copy-btn")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                copyPaymentDetail(
                    button.dataset.copy,
                    button
                );

            }
        );

    });
// ==================================================
// 5. SCREENSHOT VALIDATION
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
// 6. PAYMENT FORM SUBMISSION
// ==================================================

paymentForm.addEventListener(
  'submit',
  async function(event) {

    event.preventDefault();


    const submitButton =
            document.getElementById("submitPayment");

        const nameElement =
            document.getElementById("name");

        const emailElement =
            document.getElementById("email");

        const methodElement =
            document.getElementById("method");

        const screenshotElement =
            document.getElementById("screenshot");
  if (
            !nameElement ||
            !emailElement ||
            !methodElement ||
            !screenshotElement
        ) {

            alert(
                "One or more payment form fields are missing."
            );

            return;
        }

         const name =
            nameElement.value.trim();

        const email =
            emailElement.value.trim();

        const method =
            methodElement.value;

        const screenshot =
            screenshotElement.files[0];

             if (!name || !email || !method || !screenshot) {

            alert(
                "Please complete all fields and select a screenshot."
            );

            return;
        }


        if (screenshot.size > 5 * 1024 * 1024) {

            alert(
                "Screenshot must be smaller than 5 MB."
            );

            return;
        }

         if (submitButton) {

            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";

        }


        const reader =
            new FileReader();


        reader.onload = function () {

            const fileResult =
                reader.result;

            const base64Screenshot =
                fileResult.split(",")[1];

                console.log("Screenshot name:", screenshot.name);
console.log("Screenshot type:", screenshot.type);
console.log("Screenshot data exists:", !!base64Screenshot);
console.log(
  "Screenshot data length:",
  base64Screenshot ? base64Screenshot.length : 0
);

 const paymentData = {

                name: name,

                email: email,

                amount: PAYMENT_DETAILS.amount,

                currency: PAYMENT_DETAILS.currency,

                method: method,

                screenshotName: screenshot.name,

                screenshotType: screenshot.type,

                screenshotData: base64Screenshot

            };

             if (
      !GAS_URL ||
      GAS_URL.includes('YOUR_GOOGLE')
    ) {

      result.textContent =
        'Google Apps Script URL is not configured.';

      return;

    }


        reader.onerror = function () {

            alert(
                "Unable to read the screenshot file."
            );

            resetSubmitButton(submitButton);

        };

         submitPaymentToGoogleScript(paymentData)
    .then(result => {
      console.log("Payment submitted:", result);
    })
    .catch(error => {
      console.error("Payment submission failed:", error);
    });
};

          reader.readAsDataURL(screenshot);

         
      }

);

// ==================================================
// 7. SUBMIT TO GOOGLE APPS SCRIPT
// ==================================================

function submitToGoogleAppsScript(paymentData) {

  return new Promise(function(resolve, reject) {

    const callbackName =
      'techspacePaymentCallback_' +
      Date.now();


    const callbackTimeout =
      setTimeout(function() {

        cleanup();

        reject(
          new Error(
            'Payment submission timed out. Please try again.'
          )
        );

      }, 30000);


    // ----------------------------------------------
    // JSONP callback
    // ----------------------------------------------

    window[callbackName] =
      function(response) {

        cleanup();

        resolve(response);

      };


    // ----------------------------------------------
    // Create GET request
    // ----------------------------------------------

    const script =
      document.createElement('script');


    const params =
      new URLSearchParams({

        action: 'submit',

        callback: callbackName,

        data: JSON.stringify(paymentData)

      });


    // script.src =
    //   GAS_URL + '?' + params.toString();


    // script.onerror =
    //   function() {

    //     cleanup();

    //     reject(
    //       new Error(
    //         'Unable to connect to Google Apps Script.'
    //       )
    //     );

    //   };


    // document.body.appendChild(
    //   script
    // );


    function cleanup() {

      clearTimeout(callbackTimeout);


      delete window[callbackName];


      script.remove();

    }

  });

}

// =====================================================
// PAYMENT SUBMISSION USING POST
// =====================================================

function submitPaymentUsingPost(paymentData, submitButton) {

    const paymentFrame =
        document.getElementById("paymentFrame");

    if (!paymentFrame) {

        alert(
            'Missing iframe. Add id="paymentFrame" to index.html.'
        );

        resetSubmitButton(submitButton);

        return;
    }

    // This listener waits for the Google Apps Script
    // response loaded inside the hidden iframe.
    paymentFrame.onload = function () {

       console.log("Google Apps Script response received.");
      //  openConfirmationDialog();

        resetSubmitButton(submitButton);

        const paymentForm =
            document.getElementById("paymentForm");

        if (paymentForm) {
            paymentForm.reset();
        }

    };


    // Create a temporary POST form.
    const postForm =
        document.createElement("form");

    postForm.method = "POST";
    postForm.action = GAS_URL;
    postForm.target = "paymentFrame";
    postForm.style.display = "none";


    // Send the payment data inside the POST body.
    const dataInput =
        document.createElement("input");

    dataInput.type = "hidden";
    dataInput.name = "data";
    dataInput.value =
        JSON.stringify(paymentData);


    postForm.appendChild(dataInput);

    document.body.appendChild(postForm);

    // This sends POST, not GET.
    postForm.submit();

    document.body.removeChild(postForm);
}

// =====================================================
// RESET SUBMIT BUTTON
// =====================================================

function resetSubmitButton(submitButton) {

    if (!submitButton) {
        return;
    }

    submitButton.disabled = false;
    submitButton.textContent = "Done";
}
// ==================================================
// 8. CONFIRMATION DIALOG
// ==================================================

function openConfirmationDialog() {

    const dialog =
        document.getElementById("confirmationDialog");

    if (dialog) {
        dialog.hidden = false;
    }
}


function closeConfirmationDialog() {

    const dialog =
        document.getElementById("confirmationDialog");

    if (dialog) {
        dialog.hidden = true;
    }
}


const closeDialog =
    document.getElementById("closeDialog");

if (closeDialog) {

    closeDialog.addEventListener(
        "click",
        closeConfirmationDialog
    );
}


// ==================================================
// 11. CLOSE WITH ESCAPE KEY
// ==================================================

document.addEventListener(
  'keydown',
  function(event) {

    if (
      event.key === 'Escape' &&
      !confirmationDialog.hidden
    ) {

      closeConfirmationDialog();

    }

  }

);


// ==================================================
// 12. HELPER FUNCTIONS
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
          new Error(
            'Unable to read screenshot.'
          )
        );

      };


    reader.readAsDataURL(file);

  });

}


function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

}

// =====================================================
// RECEIVE GOOGLE APPS SCRIPT RESULT
// =====================================================

window.addEventListener("message", function (event) {

    const message =
        event.data;

    if (
        !message ||
        message.source !== "techspace-payment"
    ) {
        return;
    }


    const result =
        message.result;


    const submitButton =
        document.getElementById("submitPayment");


    if (result && result.success) {

        openConfirmationDialog();

    } else {

        alert(
            result && result.message
                ? result.message
                : "Payment submission failed."
        );

    }


    resetSubmitButton(submitButton);

});

function submitPaymentToGoogleScript(paymentData) {
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbybGBnUvU4AVn3BxacrRGu5eo-Nap88dD441liL9R0jGgUoWEaGG19q-jAFz9I4ge2p3w/exec";

  return fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(paymentData)
  })
  .then(response => {
    console.log("HTTP status:", response.status);

    if (!response.ok) {
      throw new Error("Google Apps Script returned HTTP " + response.status);
    }

    return response.json();
  })
  .then(result => {
    console.log("Google Apps Script response received:", result);

    if (!result.success) {
      throw new Error(result.error || "Apps Script reported failure.");
    }

    return result;
  });
}

// signup.js
export function initSignupForm(formSelector, progressSelector) {
  const form = document.querySelector(formSelector);
  const steps = form.querySelectorAll('.step');
  const progressBar = document.querySelector(progressSelector);
  let currentStep = 0;

  
// Reset form on page load
form.reset();

// Also clear any validation states
const allFields = form.querySelectorAll('input, select, textarea');
allFields.forEach(field => {
  field.classList.remove('is-invalid');
  field.setCustomValidity('');
});


  // Account dropdown & groups
  const accountChoice = document.getElementById('accountChoice');
  const ctGroup = document.getElementById('councilTaxGroup');
  const brGroup = document.getElementById('businessRatesGroup');
  const neitherGroup = document.getElementById('neitherGroup');

  // Patterns
  const patterns = {
    councilTaxAccount: /^\d{8,10}$/,             // 8–10 digits
    businessRatesAccount: /^[A-Za-z0-9\-]{6,12}$/, // 6–12 letters/digits/hyphen
    // UK postcode (common formats, incl. GIR 0AA and outliers; simplified but practical)
    ukPostcode: /^(GIR\s?0AA|(?:[A-Z]{1,2}\d{1,2}|[A-Z]{1,2}\d[A-Z]|[A-Z]{1,2}\d{1,2}[A-Z])\s?\d[A-Z]{2})$/i
  };

  /** Utility: return only visible fields in the current step (ignores `display:none` / `.d-none`) */
  function getVisibleFields() {
    const stepEl = steps[currentStep];
    const all = stepEl.querySelectorAll('input, select, textarea');
    return Array.from(all).filter(el => {
      // Visible if it has a layout box; `offsetParent` is null when display:none or in a hidden ancestor.
      return el.offsetParent !== null;
    });
  }

  function showStep(index) {
    steps.forEach((step, i) => step.classList.toggle('d-none', i !== index));
    const progressPercent = ((index + 1) / steps.length) * 100;
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
      progressBar.setAttribute('aria-valuenow', `${progressPercent}`);
    }
    updateNextButtonState();
  }

  /** Apply custom validity messages (keeps HTML5 `checkValidity()` truthy once corrected) */
  function applyCustomValidity(field) {
    const id = field.id;
    const value = (field.value || '').trim();

    // Clear any previous custom message
    field.setCustomValidity('');

    // Council Tax group
    if (id === 'ctAccountNumber' && field.required) {
      if (!patterns.councilTaxAccount.test(value)) {
        field.setCustomValidity('Account number must be 8–10 digits.');
      }
    }
    if (id === 'ctPostcode' && field.required) {
      if (!patterns.ukPostcode.test(value)) {
        field.setCustomValidity('Enter a valid UK postcode.');
      }
    }
    if (id === 'ctaccountname' && field.required) {
      if (value.length < 2) {
        field.setCustomValidity('Name on the bill must be at least 2 characters.');
      }
    }

    // Business Rates group
    if (id === 'brAccountNumber' && field.required) {
      if (!patterns.businessRatesAccount.test(value)) {
        field.setCustomValidity('Account number must be 6–12 letters/digits (hyphen allowed).');
      }
    }
    if (id === 'brPostcode' && field.required) {
      if (!patterns.ukPostcode.test(value)) {
        field.setCustomValidity('Enter a valid UK postcode.');
      }
    }
    if (id === 'braccountname' && field.required) {
      if (value.length < 2) {
        field.setCustomValidity('Business name must be at least 2 characters.');
      }
    }

    // Generic names used elsewhere
    if ((id === 'firstName' || id === 'lastName') && field.required) {
      if (value.length < 2) {
        field.setCustomValidity('Must be at least 2 characters.');
      }
    }

    // Mobile 
    if (id === 'mobilenumber' && field.required) {
      if (!/^\+?\d{5,13}$/.test(value) || value.length < 13 ) {
        field.setCustomValidity('Enter 5–13 digits; optional leading +.');
      }
    }
  }

  /** Validate an individual field (HTML5 + custom validity); update invalid class */
  function validateField(field) {
    applyCustomValidity(field);
    const valid = field.checkValidity();
    field.classList.toggle('is-invalid', !valid);
    return valid;
  }

  /** Validate *only visible fields* in the current step */
  function isStepValid() {
    const visibleFields = getVisibleFields();

    // Validate each visible field
    const allValid = visibleFields.every(validateField);

    return allValid;
  }

  function updateNextButtonState() {
    const nextBtn = steps[currentStep].querySelector('.next-step');
    if (nextBtn) nextBtn.disabled = !isStepValid();
  }

  /** Toggle required attributes within a group */
  function setRequired(groupEl, required) {
    if (!groupEl) return;
    const inputs = groupEl.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (required) {
        input.setAttribute('required', 'required');
      } else {
        input.removeAttribute('required');
        input.classList.remove('is-invalid');
        input.setCustomValidity('');
      }
    });
  }

  /** Dropdown change: show group, apply required, then re-check button state */
  function handleSelection() {
    const value = accountChoice?.value || '';

    // Hide all groups first
    [ctGroup, brGroup, neitherGroup].forEach(g => g?.classList.add('d-none'));

    // Clear required from all groups
    setRequired(ctGroup, false);
    setRequired(brGroup, false);
    setRequired(neitherGroup, false); // neither has nothing required

    if (value === 'council-tax') {
      ctGroup?.classList.remove('d-none');
      setRequired(ctGroup, true);
    } else if (value === 'business-rates') {
      brGroup?.classList.remove('d-none');
      setRequired(brGroup, true);
    } else if (value === 'neither') {
      neitherGroup?.classList.remove('d-none');
      // no required inputs inside neither
    }

    // After changing visibility/required, re-run validation on visible fields
    getVisibleFields().forEach(validateField);
    updateNextButtonState();
  }

  // --- Event wiring ---
  // Validate and re-evaluate on *any* input or change (selects fire change, not input)
  form.addEventListener('input', () => {
    getVisibleFields().forEach(validateField);
    updateNextButtonState();
  });
  form.addEventListener('change', () => {
    getVisibleFields().forEach(validateField);
    updateNextButtonState();
  });

  // Navigation
  form.addEventListener('click', (e) => {
    if (e.target.classList.contains('next-step')) {
      if (isStepValid() && currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    }
    if (e.target.classList.contains('prev-step')) {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    }
  });

  // Enter key: advance or submit
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextBtn = steps[currentStep].querySelector('.next-step');
      if (nextBtn && !nextBtn.disabled) {
        nextBtn.click();
      } else if (currentStep === steps.length - 1 && isStepValid()) {
        form.submit();
      }
    }
  });
  
// Handle final form submission
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default submission

  if (isStepValid()) {
    // Get the email address from the form
    const emailField = form.querySelector('#email');
    const email = emailField ? emailField.value.trim() : '';

    // Store email in sessionStorage
    if (email) {
      sessionStorage.setItem('signupEmail', email);
    }

    // Redirect to confirmation page
    window.location.href = '/register/confirm.html';
  }
});


  // Init
  if (accountChoice) {
    accountChoice.addEventListener('change', handleSelection);
    // Run once so initial Next button reflects current selection
    handleSelection();
  }
  showStep(currentStep);
}

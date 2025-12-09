/**
 * Load data from JSON file
 */
export async function loadData() {
    try {
        const response = await fetch('/assets/data.json');
        if (!response.ok) throw new Error('Failed to load data');
        return await response.json();
    } catch (error) {
        console.error('loadData error:', error.message);
        return null;
    }
}

/**
 * Utility: Format date as dd/mm/yyyy
 */
export function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date)) throw new Error('Invalid date');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('formatDate error:', error.message);
        return 'Invalid date';
    }
}

/**
 * Fetch data globally
 */
export async function getData() {
    try {
        const data = await loadData();
        if (!data) throw new Error('Data not found');
        return data;
    } catch (error) {
        console.error('getData error:', error.message);
        return null;
    }
}

/**
 * check whether the item exists.
 */
function setTextIfExists(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

/**
 * Show loading spinner and hide page content
 */
export function showSpinnerAndHideContent(contentId = 'pageContent') {
    const spinner = document.getElementById('loading-spinner');
    const content = document.getElementById(contentId);

    if (spinner) spinner.style.display = 'block';
    if (content) content.classList.remove('show'); // Hide content
}

/**
 * Hide loading spinner and show page content
 */
export function hideSpinnerAndShowContent(contentId = 'pageContent') {
    const spinner = document.getElementById('loading-spinner');
    const content = document.getElementById(contentId);

    if (spinner) spinner.style.display = 'none';
    if (content) content.classList.add('show'); // Show content
}


export function checkPartyId(customer) {
    const banner = document.getElementById('alertBannerNoAccountsWarning');

    if (!customer || !customer.partyId) {
        if (banner) {
            banner.style.display = 'block';
            banner.classList.add('show');
        }
    } else {
        if (banner) {
            banner.style.display = 'none';
            banner.classList.remove('show');
        }
    }
}





/**
 * get Customer info
 */

/**
 * Update customer details dynamically based on a mapping
 */
export function getCustomerFields(customer, fieldMap) {
    try {
        if (!customer || typeof customer !== 'object') {
            throw new Error('Customer data missing or invalid');
        }

        // Helper to safely get nested properties
        const getValue = (obj, path) => {
            return path.split('.').reduce((acc, key) => acc && acc[key] ? acc[key] : '', obj);
        };

        // Loop through mapping and update DOM
        Object.entries(fieldMap).forEach(([elementId, fieldPath]) => {
            const el = document.getElementById(elementId);
            if (el) {
                el.textContent = getValue(customer, fieldPath) || 'Not available';
            } else {
                console.warn(`Element with ID '${elementId}' not found`);
            }
        });

        console.log('Customer fields updated successfully');
    } catch (error) {
        console.error('getCustomerFields error:', error.message);
    }
}


/**
 * Update notifications count and message
 */
export function updateNotifications(data) {
    try {
        const unread = data.mynotifications.filter(n => n.isread !== "Y");
        const count = unread.length;
        const message = count === 0
            ? "You have 0 unread notifications."
            : count === 1
                ? "You have 1 unread notification."
                : `You have ${count} unread notifications.`;

        setTextIfExists('mynotificationscount-header', count);
        setTextIfExists('mynotificationscount-menu', count);
        setTextIfExists('mynotificationscount-widget', message);
    } catch (error) {
        console.error('updateNotifications error:', error.message);
    }
}

/**
 * Render notifications in modal
 */
export function renderModalNotifications(data) {
    try {
        const container = document.getElementById('notificationModal');
        if (!container) throw new Error('Notification modal container not found');
        container.innerHTML = '';

        const typeIcons = {
            "alert": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-square" viewBox="0 0 16 16">
				<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
				<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
				</svg>`,
            "message": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
				<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
				<path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
				</svg>`,
            "letter": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-paper" viewBox="0 0 16 16">
				<path d="M4 0a2 2 0 0 0-2 2v1.133l-.941.502A2 2 0 0 0 0 5.4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5.4a2 2 0 0 0-1.059-1.765L14 3.133V2a2 2 0 0 0-2-2zm10 4.267.47.25A1 1 0 0 1 15 5.4v.817l-1 .6zm-1 3.15-3.75 2.25L8 8.917l-1.25.75L3 7.417V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm-11-.6-1-.6V5.4a1 1 0 0 1 .53-.882L2 4.267zm13 .566v5.734l-4.778-2.867zm-.035 6.88A1 1 0 0 1 14 15H2a1 1 0 0 1-.965-.738L8 10.083zM1 13.116V7.383l4.778 2.867L1 13.117Z"/>
				</svg>`,
            "phone": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
				<path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
				</svg>`,
            "information": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
				<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
				<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
				</svg>`,
        };
        const defaultIcon = typeIcons.message;

        data.mynotifications
            .filter(n => n.isread !== "Y")
            .forEach(n => {
                const iconHTML = typeIcons[n.type] || defaultIcon;
                const card = `
                    <div class="item p-2">
                        <div class="row gx-2 justify-content-between align-items-center">
                            <div class="col-auto"><div class="app-icon-holder">${iconHTML}</div></div>
                            <div class="col">
                                <div><strong>${n.category}</strong></div>
                                <div>${n.description.length > 60
                        ? n.description.substring(0, n.description.lastIndexOf(" ", 60)) + "...read more."
                        : n.description}</div>
                            </div>
                            <div class="col-auto">${formatDate(n.date)}</div>
                        </div>
                        <a class="link-mask" href="notifications.html"></a>
                    </div>`;
                container.insertAdjacentHTML('beforeend', card);
            });
    } catch (error) {
        console.error('renderModalNotifications error:', error.message);
    }
}

/**
 * Populate accounts dropdown for Residential or Business accounts
 */
export function populateAccountsDropdown(data, accountType = "Residential") {
    try {
        const dropdown = document.getElementById('accountDropdown');
        if (!dropdown) throw new Error('Dropdown element not found');
        dropdown.innerHTML = '';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeAccounts = data.accounts.filter(account => {
            if (account.type !== accountType) return false;
            if (!account.expiry || account.expiry.trim() === "") return true;
            const expiryDate = new Date(account.expiry);
            expiryDate.setHours(0, 0, 0, 0);
            return expiryDate >= today;
        });

        if (activeAccounts.length === 0) {
            dropdown.insertAdjacentHTML('beforeend', `<option>No active ${accountType} accounts.</option>`);
        } else {
            dropdown.insertAdjacentHTML('beforeend', `<option value="">Select a ${accountType} account</option>`);
            activeAccounts.forEach(acc => {
                dropdown.insertAdjacentHTML('beforeend', `<option value="${acc.id}">${acc.name}</option>`);
            });

            // Auto-select if only one account
            if (activeAccounts.length === 1) {
                dropdown.value = activeAccounts[0].id;
            }
        }

        return dropdown;
    } catch (error) {
        console.error('populateAccountsDropdown error:', error.message);
        return null;
    }
}

/**
 * Toggle page content visibility
 */
export function togglePageContent(dropdownId, contentId) {
    const dropdown = document.getElementById(dropdownId);
    const content = document.getElementById(contentId);

    if (!dropdown || !content) {
        console.error('togglePageContent error: Elements not found');
        return;
    }

    if (dropdown.value) {
        content.classList.add('show');
    } else {
        content.classList.remove('show');
    }

    dropdown.addEventListener('change', function () {
        if (this.value) {
            content.classList.add('show');
        } else {
            content.classList.remove('show');
        }
    });
}

/**
 * Render subscriptions table
 */
export function renderSubscriptionsTable(data, selectedId) {
    try {
        const tbody = document.querySelector('#table-mysubs tbody');
        if (!tbody) throw new Error('Subscriptions table body not found');
        tbody.innerHTML = '';

        if (!selectedId) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Please select an account</td></tr>`;
            return;
        }

        const subs = data.mysubscriptions.filter(sub =>
            sub.status !== 'closed' &&
            String(sub.accountid).toLowerCase().trim() === String(selectedId).toLowerCase().trim()
        );
        console.log(subs);

        if (subs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No subscriptions exist for this account.</td></tr>`;
        } else {
            subs.forEach(sub => {
                tbody.insertAdjacentHTML('beforeend', `
                    <tr>
                        <td>${sub.id}</td>
                        <td>${sub.category}</td>
                        <td>${sub.name}</td>
                        <td>${sub.status}</td>
                        <td>${formatDate(sub.expiry)}</td>
                        <td class="text-center">${sub.autorenew}</td>
                        <td><a href="subscription/subscription.html?id=${sub.id}">View</a></td>
                    </tr>
                `);
            });
        }
    } catch (error) {
        console.error('renderSubscriptionsTable error:', error.message);
    }
}

/**
 * Render service requests table
 */
export function renderServiceRequestsTable(data, selectedId) {
    try {
        const tbody = document.querySelector('#table-myservicerequests tbody');
        if (!tbody) throw new Error('Service requests table body not found');
        tbody.innerHTML = '';

        if (!selectedId) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Please select an account</td></tr>`;
            return;
        }

        const requests = data.myservicerequests.filter(req =>
            req.status !== 'closed' &&
            String(req.accountid).toLowerCase().trim() === String(selectedId).toLowerCase().trim()
        );

        if (requests.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">You have no open service requests for this account.</td></tr>`;
        } else {
            requests.forEach(req => {
                tbody.insertAdjacentHTML('beforeend', `
                    <tr>
                        <td>${req.id}</td>
                        <td>${req.subject}</td>
                        <td>${req.category}</td>
                        <td>${req.status}</td>
                        <td><a href="service/request.html?id=${req.id}">View</a></td>
                    </tr>
                `);
            });
        }
    } catch (error) {
        console.error('renderServiceRequestsTable error:', error.message);
    }
}

/**
 * Garden Waste UI
 */
export function updateGardenWasteUI(hasSubscription, subscriptionEndDate = null) {
    const GWiconElement = document.getElementById('garden-icon');
    const GWmessageElement = document.getElementById('garden-message');
    const info = document.getElementById('gw-info');
    const nosub = document.getElementById('gw-nosub');
    if (!GWiconElement || !GWmessageElement || !info || !nosub) return;

    if (hasSubscription) {
        GWiconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
            <path d="M10.97 5.97a.75.75 0 0 1 1.07 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 9.384a.75.75 0 1 1 1.06-1.06l1.94 1.94 3.646-4.293z"/>
        </svg>`;
        GWmessageElement.textContent = `Your subscription ends on ${subscriptionEndDate}`;
        info.style.display = 'block';
        nosub.style.display = 'none';
    } else {
        GWiconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="red" class="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>`;
        GWmessageElement.textContent = 'No Garden Waste subscription';
        info.style.display = 'none';
        nosub.style.display = 'block';
    }
}



/**
 * set tax type
 */

function getTaxType(filteredTaxAccount) {
    try {
        if (!filteredTaxAccount) {
            console.warn("No matching account found");
            return ""; // Return empty string if no account
        }

        let taxType = "";
        if (filteredTaxAccount.accountType === "Residential") {
            taxType = "Council Tax";
        } else if (filteredTaxAccount.accountType === "Business") {
            taxType = "NNDR";
        }

        return taxType;
    } catch (error) {
        console.error("Error determining taxType:", error);
        return ""; // Fallback if something goes wrong
    }
}


/**
 * get Ctax/NNDR account Years data
 */

// Populate Year Dropdown
function populateYearDropdown(filteredTaxAccount) {
    const yearDropdown = document.getElementById("yearDropdown");
    yearDropdown.innerHTML = "";

    if (!filteredTaxAccount.years || filteredTaxAccount.years.length === 0) {
        console.warn("No years data found for this account");
        return;
    }

    filteredTaxAccount.years.forEach(yearObj => {
        const option = document.createElement("option");
        option.value = yearObj.year;
        option.textContent = yearObj.yearDisplay;
        yearDropdown.appendChild(option);
    });

    // Default to current year
    const today = new Date();
    const currentYearObj = filteredTaxAccount.years.find(y => {
        const start = new Date(y.liabilityStartDate);
        const end = new Date(y.liabilityEndDate);
        return today >= start && today <= end;
    });

    if (currentYearObj) {
        yearDropdown.value = currentYearObj.year;
        updateYearData(currentYearObj);
    }

    yearDropdown.onchange = function () {
        const selectedYear = this.value;
        const selectedYearObj = filteredTaxAccount.years.find(y => y.year === selectedYear);
        if (selectedYearObj) {
            updateYearData(selectedYearObj);
        }
    };
}

/**
 * Get Council Tax information for the selected account to display on the widget summary
 */
export function updateTaxUI(data, selectedId) {
    try {
        const taxWidget = document.getElementById('widget-tax-nextpayment');
        const alertTAXbanner = document.getElementById('tax-alert-noaccount');
        const divTAXinfo = document.getElementById('tax-account-info');

        if (!taxWidget || !alertTAXbanner || !divTAXinfo) {
            throw new Error('Required elements for Tax UI not found');
        }

        const filteredTaxAccounts = data.accountActivities.filter(activity =>
            String(activity.accountid).trim() === String(selectedId).trim()
        );

        if (!filteredTaxAccounts || filteredTaxAccounts.length === 0) {
            taxWidget.textContent = 'No account information available.';
            alertTAXbanner.style.display = 'block';
            divTAXinfo.style.display = 'none';
            return;
        }

        const account = filteredTaxAccounts[0];
        const taxType = getTaxType(account);

        const today = new Date();
        const currentYearObj = account.years.find(year => {
            const start = new Date(year.liabilityStartDate);
            const end = new Date(year.liabilityEndDate);
            return today >= start && today <= end;
        });

        const nextPayment = currentYearObj?.nextPaymentDue || {};
        const nextPaymentMessage = (!nextPayment.dueDate || !nextPayment.amount)
            ? 'No payments scheduled.'
            : `Next Payment: £${nextPayment.amount} - ${formatDate(nextPayment.dueDate)}.`;

        taxWidget.textContent = nextPaymentMessage;
        alertTAXbanner.style.display = 'none';
        divTAXinfo.style.display = 'block';
    } catch (error) {
        console.error('updateTaxUI error:', error.message);
    }
}


/**
 * get Ctax/NNDR account info
 */
function updateAccountDetails(filteredTaxAccount) {
    setTextIfExists("accountAddress", filteredTaxAccount.accountAddress);
    setTextIfExists("accountNumber", filteredTaxAccount.accountid);
}
function updatePropertyDetails(propertyDetails) {
    setTextIfExists("propertyBand", propertyDetails.propertyBand);
    setTextIfExists("propertyAddress", propertyDetails.address);
    setTextIfExists("propertyPostcode", propertyDetails.postcode);
    setTextIfExists("rateableValue", propertyDetails.rateableValue);
}

function updateYearData(yearObj) {
    setTextIfExists("outStandingBalance", yearObj.outStandingBalance);
    setTextIfExists("liablePersons", yearObj.liablePersons);
    setTextIfExists("liabilityStartDate", formatDate(yearObj.liabilityStartDate));
    setTextIfExists("liabilityEndDate", formatDate(yearObj.liabilityEndDate));
    setTextIfExists("nextPayDate", formatDate(yearObj.nextPaymentDue.dueDate));
    setTextIfExists("nextPayAmount", yearObj.nextPaymentDue.amount);
    setTextIfExists("paymentMethod", yearObj.paymentMethod);
    setTextIfExists("paymentFrequency", yearObj.paymentFrequency);
    setTextIfExists("instalmentsDue", yearObj.instalmentsDue);
    renderDiscountsTable(yearObj.discounts || []);
    renderInstalmentsTable(yearObj.instalments || []);
    renderPaymentsTable(yearObj.paymentsMade || []);

}

function clearAccountDetails(filteredTaxAccount, yearObj) {
    setTextIfExists("accountAddress", "");
    setTextIfExists("accountNumber", "");
    setTextIfExists("outStandingBalance", "");
    setTextIfExists("liablePersons", "");
    setTextIfExists("liabilityStartDate", "");
    setTextIfExists("liabilityEndDate", "");
    setTextIfExists("nextPayDate", "");
    setTextIfExists("nextPayAmount", "");
    setTextIfExists("paymentMethod", "");
    setTextIfExists("paymentFrequency", "");
    setTextIfExists("instalmentsDue", "");
}

function clearTables() {
    setTextIfExists("instalmentsTableBody", "");
    setTextIfExists("paymentsTableBody", "");
}



/**
 * get Ctax/NNDR instalments
 */
function renderInstalmentsTable(instalments) {
    const tbody = document.getElementById("instalmentsTableBody");
    tbody.innerHTML = "";
    if (!instalments.length) {
        tbody.innerHTML = "<tr><td colspan='2'>No instalments available</td></tr>";
        return;
    }
    instalments.forEach(i => {
        const row = `<tr><td>${formatDate(i.dueDate)}</td><td>£${i.amount}</td></tr>`;
        tbody.insertAdjacentHTML("beforeend", row);
    });
}

/**
 * get Ctax/NNDR payments into a table
 */

function renderPaymentsTable(payments) {
    const tbody = document.getElementById("paymentsTableBody");
    tbody.innerHTML = "";
    if (!payments.length) {
        tbody.innerHTML = "<tr><td colspan='3'>No payments made</td></tr>";
        return;
    }
    payments.forEach(p => {
        const row = `<tr><td>${formatDate(p.dueDate)}</td><td>£${p.amount}</td><td>${p.paymentMethod}</td></tr>`;
        tbody.insertAdjacentHTML("beforeend", row);
    });
}

/**
 * get Ctax/NNDR discounts into a table
 */
function renderDiscountsTable(discounts) {
    const tbody = document.getElementById("discountsTableBody");
    tbody.innerHTML = "";
    if (!discounts.length) {
        tbody.innerHTML = "<tr><td colspan='3'>No discounts applied</td></tr>";
        return;
    }
    discounts.forEach(d => {
        const row = `<tr><td>${d.name}</td><td>${formatDate(d.startDate)}</td><td>${formatDate(d.endDate)}</td></tr>`;
        tbody.insertAdjacentHTML("beforeend", row);
    });
}

/**
 * get linked accounts
 */

export function getLinkedAccounts(data, countElementId = 'count-accounts', tableSelector = '#table-linkedaccounts tbody') {
    try {
        if (!data || !Array.isArray(data.accounts)) {
            throw new Error('Accounts data is missing or invalid');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const validAccounts = data.accounts.filter(account => {
            if (!account.enddate || account.enddate.trim() === '') return true;
            const expiryDate = new Date(account.enddate);
            expiryDate.setHours(0, 0, 0, 0);
            return expiryDate >= today;
        });

        const countElement = document.getElementById(countElementId);
        if (countElement) {
            countElement.textContent = validAccounts.length;
        } else {
            console.warn(`Element with ID '${countElementId}' not found`);
        }

        const tbody = document.querySelector(tableSelector);
        if (!tbody) {
            console.warn(`Table body with selector '${tableSelector}' not found`);
            return;
        }

        tbody.innerHTML = ''; // ✅ Clears only rows, not headers

        if (validAccounts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No linked accounts found.</td></tr>`;
            return;
        }

        validAccounts.forEach(account => {
            const row = `
                <tr>
                    <td class="cell">${account.id}</td>
                    <td class="cell">${account.type}</td>
                    <td class="cell">${account.name}</td>
                    <td class="cell">${account.role}</td>
                    <td class="cell text-center">${account.responseparty}</td>
                    <td><a class="btn-sm app-btn-secondary" href="#">Remove Account</a></td>
                </tr>
                `
            tbody.insertAdjacentHTML('beforeend', row);
        });

        console.log('Linked accounts updated successfully');
    } catch (error) {
        console.error('updateLinkedAccounts error:', error.message);
    }
}


/**
 * Display count of subscriptions expiring within the next 90 days
 */

export function showExpiringSubscriptions(
    data,
    elementId = 'count-subscriptions',
    days = 90,
    selectedId = null
) {
    try {
        // Validate data
        if (!data || !Array.isArray(data.mysubscriptions)) {
            throw new Error('Subscriptions data is missing or invalid');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + days);

        // Apply optional accountid filter
        let subscriptions = data.mysubscriptions;
        if (selectedId) {
            subscriptions = subscriptions.filter(sub => sub.accountid === selectedId);
        }

        // Filter subscriptions expiring within the next X days
        const expiringSoon = subscriptions.filter(sub => {
            if (!sub.expiry) return false;
            const expiryDate = new Date(sub.expiry);
            if (isNaN(expiryDate)) return false; // Invalid date
            expiryDate.setHours(0, 0, 0, 0);
            return expiryDate >= today && expiryDate <= targetDate;
        });

        // Build message
        const count = expiringSoon.length;
        const message =
            count === 0
                ? `0 subscriptions expire within ${days} days.`
                : count === 1
                    ? `1 subscription expires within ${days} days.`
                    : `${count} subscriptions expire within ${days} days.`;

        // Update DOM if element exists
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = message;
        } else {
            console.warn(`Element with ID '${elementId}' not found`);
        }

        console.log(`Expiring subscriptions count: ${count}`);
    } catch (error) {
        console.error('showExpiringSubscriptions error:', error.message);
    }
}



/**
 * Display count of active linked accounts
 */
export function showLinkedAccountsCount(data, elementId = 'count-accounts') {
    try {
        // Validate data
        if (!data || !Array.isArray(data.accounts)) {
            throw new Error('Accounts data is missing or invalid');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter out expired accounts
        const validAccounts = data.accounts.filter(account => {
            if (!account.enddate || account.enddate.trim() === '') return true; // No expiry date
            const expiryDate = new Date(account.enddate);
            if (isNaN(expiryDate)) return false; // Invalid date
            expiryDate.setHours(0, 0, 0, 0);
            return expiryDate >= today;
        });

        const count = validAccounts.length;
        const message =
            count === 0
                ? 'No linked accounts found. Click to link.'
                : count === 1
                    ? 'You have 1 linked account.'
                    : `You have ${count} linked accounts.`;

        // Update DOM if element exists
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = message;
        } else {
            console.warn(`Element with ID '${elementId}' not found`);
        }

        console.log(`Active linked accounts: ${count}`);
    } catch (error) {
        console.error('showLinkedAccountsCount error:', error.message);
    }
}




/**
 * Display service requests count and render table with optional filter
 */
export function showServiceRequests(
    data,
    countElementId = 'count-servicerequests',
    tableSelector = '#table-myservicerequests tbody',
    filter = 'all'
) {
    try {
        if (!data || !Array.isArray(data.myservicerequests)) {
            throw new Error('Service requests data is missing or invalid');
        }

        const countEl = document.getElementById(countElementId);
        const tbody = document.querySelector(tableSelector);

        if (!tbody) {
            console.warn(`Table body with selector '${tableSelector}' not found`);
            return;
        }

        // ✅ Apply filter logic correctly
        let filteredRequests = data.myservicerequests;
        if (filter.toLowerCase() === 'open') {
            filteredRequests = filteredRequests.filter(req => req.status?.toLowerCase() !== 'closed');
        } else if (filter.toLowerCase() === 'closed') {
            filteredRequests = filteredRequests.filter(req => req.status?.toLowerCase() === 'closed');
        }

        const count = filteredRequests.length;

        // ✅ Build message dynamically
        const message =
            count === 0
                ? `You have 0 ${filter === 'all' ? '' : filter.toLowerCase()} service requests.`
                : count === 1
                    ? `You have 1 ${filter === 'all' ? '' : filter.toLowerCase()} service request.`
                    : `You have ${count} ${filter === 'all' ? '' : filter.toLowerCase()} service requests.`;

        if (countEl) {
            countEl.textContent = message;
        } else {
            console.warn(`Element with ID '${countElementId}' not found`);
        }

        // ✅ Clear previous rows
        tbody.innerHTML = '';

        if (count === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; font-style:italic;">
                        You have no ${filter === 'all' ? '' : filter.toLowerCase()} service requests.
                    </td>
                </tr>
            `;
            return;
        }

        console.log(filteredRequests);

        // ✅ Render filtered rows
        filteredRequests.forEach(req => {
            const row = `
                <tr>
                    <td class="cell"><a href="servicerequest.html">${req.id}</a></td>
                    <td class="cell"><span class="truncate">${req.subject}</span></td>
                    <td class="cell">${req.category}</td>
                    <td class="cell">${req.status}</td>
                    <td class="cell"><a href="/service/request.html?id=${req.id}">View</a></td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });

        console.log(`Service requests rendered successfully with filter: ${filter}`);
    } catch (error) {
        console.error('showServiceRequests error:', error.message);
    }
}




/**
 * Render subscriptions with a status filter and account name lookup.
 * - Status options: "Active" or "Expired"
 * - Defaults to filter "Active" (any status other than 'expired')
 * - Looks up account name from data.accounts by matching subscription.accountid.
 */
export function renderSubscriptionsWithFilter(
    data,
    tableSelector = '#table-mysubs tbody',
    filterSelectId = 'subscriptionStatusFilter'
) {
    try {
        // ----- Validate inputs -----
        if (!data || !Array.isArray(data.mysubscriptions)) {
            throw new Error('Subscriptions data (data.mysubscriptions) is missing or invalid');
        }

        const tbody = document.querySelector(tableSelector);
        if (!tbody) {
            console.warn(`Table body not found for selector '${tableSelector}'`);
            return;
        }

        const filterSelect = document.getElementById(filterSelectId);
        if (!filterSelect) {
            console.warn(`Filter <select> not found with id '${filterSelectId}'`);
            return;
        }

        // ----- Build account name lookup -----
        const accountNameById = new Map();
        if (Array.isArray(data.accounts)) {
            data.accounts.forEach(acc => {
                const key = String(acc?.id ?? '').trim();
                const name = acc?.name ?? '';
                if (key) accountNameById.set(key, name);
            });
        } else {
            console.warn('Accounts data (data.accounts) missing or invalid—account names will be blank');
        }

        // ----- Populate filter dropdown with "Active" and "Expired" -----
        filterSelect.innerHTML = '';
        ['Active', 'Expired'].forEach(status => {
            const opt = document.createElement('option');
            opt.value = status;
            opt.textContent = status;
            filterSelect.appendChild(opt);
        });

        // Default to "Active"
        filterSelect.value = 'Active';

        // ----- Helpers -----
        const formatDateSafe = (dateString) => {
            try {
                const date = new Date(dateString);
                if (isNaN(date)) return 'Invalid date';
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();
                return `${dd}/${mm}/${yyyy}`;
            } catch {
                return 'Invalid date';
            }
        };

        const formatAutoRenew = (val) => {
            const v = String(val ?? '').toLowerCase();
            return v === 'y' || v === 'yes' || v === 'true' ? 'Yes' : 'No';
        };

        const renderTable = (statusFilter) => {
            tbody.innerHTML = '';

            const filterLower = (statusFilter ?? '').toLowerCase();
            const filteredSubs = data.mysubscriptions.filter(sub => {
                const statusLower = (sub.status ?? '').toLowerCase();
                if (filterLower === 'active') return statusLower !== 'expired';
                if (filterLower === 'expired') return statusLower === 'expired';
                return true;
            });

            if (filteredSubs.length === 0) {
                tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align:center; font-style:italic;">
              No subscriptions found for status: ${statusFilter}.
            </td>
          </tr>
        `;
                return;
            }

            filteredSubs.forEach(sub => {
                const accountIdKey = String(sub?.accountid ?? '').trim();
                const accountName = accountNameById.get(accountIdKey) || '';

                const rowHtml = `
          <tr>
            <td class="cell">${sub.id ?? ''}</td>
            <td class="cell">${sub.category ?? ''}</td>
            <td class="cell">
              ${sub.name ?? ''}
              ${accountName ? `<br><small class="text-muted">${accountName}</small>` : ''}
            </td>
            <td class="cell">${sub.status ?? ''}</td>
            <td class="cell">${formatDateSafe(sub.expiry)}</td>
            <td class="cell text-center">${formatAutoRenew(sub.autorenew)}</td>
            <td class="cell"><a href="subscription/subscription.html?id=${sub.id}">Manage</a></td>
          </tr>
        `;
                tbody.insertAdjacentHTML('beforeend', rowHtml);
            });
        };

        // Initial render
        renderTable(filterSelect.value);

        // Update on dropdown change
        filterSelect.addEventListener('change', (e) => {
            renderTable(e.target.value);
        });

        console.log('Subscriptions table rendered with Active/Expired filter and account lookup');
    } catch (error) {
        console.error('renderSubscriptionsWithFilter error:', error.message);
    }
}








/**
 * Render notifications with category filter and unread-first sorting
 */
export function renderNotificationsSection(data, containerId = 'notificationContainer', filterSelectId = 'categoryFilter') {
    try {
        // Validate data
        if (!data || !Array.isArray(data.mynotifications)) {
            throw new Error('Notifications data is missing or invalid');
        }

        const typeIcons = {
            "alert": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-square" viewBox="0 0 16 16">
				<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
				<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
				</svg>`,
            "message": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
				<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
				<path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
				</svg>`,
            "letter": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-paper" viewBox="0 0 16 16">
				<path d="M4 0a2 2 0 0 0-2 2v1.133l-.941.502A2 2 0 0 0 0 5.4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5.4a2 2 0 0 0-1.059-1.765L14 3.133V2a2 2 0 0 0-2-2zm10 4.267.47.25A1 1 0 0 1 15 5.4v.817l-1 .6zm-1 3.15-3.75 2.25L8 8.917l-1.25.75L3 7.417V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm-11-.6-1-.6V5.4a1 1 0 0 1 .53-.882L2 4.267zm13 .566v5.734l-4.778-2.867zm-.035 6.88A1 1 0 0 1 14 15H2a1 1 0 0 1-.965-.738L8 10.083zM1 13.116V7.383l4.778 2.867L1 13.117Z"/>
				</svg>`,
            "phone": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
				<path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
				</svg>`,
            "information": `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
				<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
				<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
				</svg>`,
        };
        const defaultIcon = typeIcons.message;

        // Sort notifications: unread first
        data.mynotifications.sort((a, b) => (a.isread === b.isread ? 0 : a.isread ? 1 : -1));

        // Populate filter options
        const filterSelect = document.getElementById(filterSelectId);
        if (!filterSelect) {
            console.warn(`Filter select element with ID '${filterSelectId}' not found`);
            return;
        }

        const categories = [...new Set(data.mynotifications.map(n => n.category))];
        filterSelect.innerHTML = '<option value="all">All Categories</option>'; // Reset options
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            filterSelect.appendChild(option);
        });

        // Render notifications function
        const renderNotifications = (filter = 'all') => {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`Notification container with ID '${containerId}' not found`);
                return;
            }

            container.innerHTML = ''; // Clear previous notifications

            const filtered = data.mynotifications.filter(n => filter === 'all' || n.category === filter);

            if (filtered.length === 0) {
                container.innerHTML = `<p style="text-align:center; font-style:italic;">No notifications found.</p>`;
                return;
            }

            filtered.forEach(n => {
                const iconHTML = typeIcons[n.type] || defaultIcon;
                const card = document.createElement('div');
                card.className = 'app-card app-card-notification shadow-sm mb-4 col-12';
                card.innerHTML = `
                    <div class="app-card-header px-4 py-3">
                        <div class="row g-3 align-items-center">
                            <div class="col-12 col-lg-auto text-center text-lg-start">
                                <div class="app-icon-holder">${iconHTML}</div>
                            </div>
                            <div class="col-12 col-lg-auto text-center text-lg-start">
                                <div class="notification-type mb-2">
                                    <span class="badge bg-info">${n.category}</span>
                                </div>
                                <h4 class="notification-title mb-1">${n.subject}</h4>
                                <ul class="notification-meta list-inline mb-0">
                                    <li class="list-inline-item">${formatDate(n.date)}</li>
                                    ${!n.isread ? '<li class="list-inline-item text-danger fw-bold">Unread</li>' : ''}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="app-card-body p-4">
                        <div class="notification-content">${n.description}</div>
                    </div>
                    
                `;
                container.appendChild(card);
            });
        };

        // Initial render
        renderNotifications();

        // Filter change event
        filterSelect.addEventListener('change', e => {
            renderNotifications(e.target.value);
        });

        console.log('Notifications section rendered successfully');
    } catch (error) {
        console.error('renderNotificationsSection error:', error.message);
    }
}


/**
 * Display next lease payment info for the selected business account.
 */
export function showNextLeasePayment(data, selectedId, widgetId = 'widget-lease-nextpayment') {
    try {
        const widget = document.getElementById(widgetId);
        if (!widget) {
            console.warn(`Widget element not found: ${widgetId}`);
            return;
        }

        if (!selectedId || selectedId.trim() === '') {
            widget.textContent = 'Please select a business account.';
            return;
        }

        if (!data || !Array.isArray(data.leasedpremises)) {
            widget.textContent = 'Lease data not available.';
            return;
        }

        // Filter active premises for the selected business
        const activePremises = data.leasedpremises.filter(
            premise => premise.accountid === selectedId && premise.status === 'Active'
        );

        console.log('Active premises found:', activePremises);

        if (activePremises.length === 0) {
            widget.textContent = 'No active leases linked to this account.';
            return;
        }

        if (activePremises.length > 1) {
            widget.textContent = 'Multiple leases exist. Click to view lease.';
            return;
        }

        // If only one active premise, show next payment details
        const nextPayment = activePremises[0]?.payments?.[0]?.nextpayment?.[0];
        if (nextPayment && nextPayment.dueDate && nextPayment.amount) {
            widget.textContent = `Next Payment Due: £${nextPayment.amount} - ${formatDate(nextPayment.dueDate)}`;
        } else {
            widget.textContent = 'Next payment info not available.';
        }
    } catch (error) {
        console.error('showNextLeasePayment error:', error.message);
    }
}


/**
 * Populate lease years dropdown based on active premises payments.
 */
export function initLeaseYearsDropdown(activePremises, dropdownId = 'leaseyearsDropdown') {
    try {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) {
            console.warn(`Dropdown element not found: ${dropdownId}`);
            return null;
        }

        if (!Array.isArray(activePremises) || activePremises.length === 0) {
            dropdown.innerHTML = `<option>No years found.</option>`;
            return null;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Collect all payments from active premises
        const allPayments = activePremises.flatMap(premise => premise.payments || []);

        // Extract unique years
        const years = [...new Set(allPayments.map(payment => payment.year).filter(Boolean))];

        // Determine current year based on today's date
        let currentYear = null;
        allPayments.forEach(payment => {
            const start = new Date(payment.startdate);
            const end = new Date(payment.enddate);
            if (today >= start && today <= end) {
                currentYear = payment.year;
            }
        });

        // Populate dropdown
        dropdown.innerHTML = ''; // Clear existing options
        if (years.length === 0) {
            dropdown.insertAdjacentHTML('beforeend', `<option>No years found.</option>`);
        } else {
            dropdown.insertAdjacentHTML('beforeend', `<option value="">Select a Year</option>`);
            years.forEach(leaseYear => {
                const isSelected = leaseYear === currentYear ? 'selected' : '';
                dropdown.insertAdjacentHTML('beforeend', `<option value="${leaseYear}" ${isSelected}>${leaseYear}</option>`);
            });
        }

        // Track selected year
        let selectedLeaseYearID = dropdown.value;

        getLeaseInfoForYear(activePremises, selectedLeaseYearID);

        dropdown.addEventListener('change', function () {
            selectedLeaseYearID = this.value;
            console.log('Selected Lease Year:', selectedLeaseYearID);
            getLeaseInfoForYear(activePremises, selectedLeaseYearID);
        });

        return selectedLeaseYearID;
    } catch (error) {
        console.error('initLeaseYearsDropdown error:', error.message);
        return null;
    }
}


/**
 * get lease details in the UI for a selected year.
 */

/**
 * get lease details in the UI for a selected year.
 * Renders base lease fields and payment fields, and writes instalments into a table <tbody>
 * using the "innerHTML + insertAdjacentHTML" approach.
 */
export function getLeaseInfoForYear(
  activePremises,
  selectedLeaseYearID,
  options = {}
) {
  const ids = {
    // Banner + container
    bannerAlert: 'premises-alert-noleases',
    leaseInfo: 'premises-lease-info',

    // Lease fields
    ref: 'lease-ref',
    type: 'lease-type',
    expiry: 'lease-expiry',

    // Payment fields
    annualcharge: 'lease-annualcharge',
    paidtoDate: 'lease-paidtodate',
    remainingbalance: 'lease-remainingbalance',
    paymentMethodDescription: 'lease-paymentmethod',
    paymentFrequency: 'lease-paymentfrequency',

    // Instalments table elements
    instalmentsTable: 'lease-instalments-table', // optional, for show/hide
    instalmentsTbody: 'lease-instalments-tbody',

    // Optional formatting options
    currency: 'GBP',

    ...options.ids,
  };

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`[getLeaseInfoForYear] Element with ID '${id}' not found`);
      return;
    }
    el.textContent = value ?? '—';
  };

  // Show/Hide helpers
  const show = id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
  };
  const hide = id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  };

  // ---- Basic data validation ----
  if (!Array.isArray(activePremises)) {
    console.error('[getLeaseInfoForYear] activePremises must be an array.');
    show(ids.bannerAlert);
    hide(ids.leaseInfo);
    // Clear instalments table if present
    const tbody = document.getElementById(ids.instalmentsTbody);
    if (tbody) tbody.innerHTML = '';
    return {
      premiseId: null,
      yearUsed: null,
      paymentFound: false,
      paymentDetails: null,
      instalmentsRendered: false,
      instalmentsCount: 0,
    };
  }

  // No premises → show banner, hide info
  if (activePremises.length === 0) {
    show(ids.bannerAlert);
    hide(ids.leaseInfo);
    const tbody = document.getElementById(ids.instalmentsTbody);
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="2" style="text-align:center; font-style:italic;">
            No instalments to display.
          </td>
        </tr>
      `;
    }
    return {
      premiseId: null,
      yearUsed: null,
      paymentFound: false,
      paymentDetails: null,
      instalmentsRendered: true,
      instalmentsCount: 0,
    };
  }

  // There are premises → hide banner, show info section
  hide(ids.bannerAlert);
  show(ids.leaseInfo);

  // ---- Determine the year to use ----
  let yearToUse = selectedLeaseYearID ?? null;
  if (!yearToUse) {
    // Default to latest payment year across all premises (if available)
    const years = [];
    for (const premise of activePremises) {
      if (Array.isArray(premise.payments)) {
        premise.payments.forEach(p => {
          const y = Number(p?.year);
          if (!isNaN(y)) years.push(y);
        });
      }
    }
    if (years.length > 0) {
      yearToUse = Math.max(...years);
    }
  }

  // ---- Find the first premise with a payment for the target year ----
  let matchedPremise = null;
  let paymentDetails = null;

  if (yearToUse != null) {
    for (const premise of activePremises) {
      const payment = Array.isArray(premise.payments)
        ? premise.payments.find(p => String(p?.year) === String(yearToUse))
        : null;
      if (payment) {
        matchedPremise = premise;
        paymentDetails = payment;
        break;
      }
    }
  }

  // Fallback for base lease fields
  const basePremise = matchedPremise || activePremises[0];

  // ---- Render lease fields ----
  setText(ids.ref, basePremise?.id ?? '—');
  setText(ids.type, basePremise?.leasetype ?? '—');
  setText(ids.expiry, basePremise?.expiry ? formatDate(basePremise.expiry) : '—');

  // ---- Render payment fields ----
  setText(ids.annualcharge, paymentDetails?.annualcharge ?? '—');
  setText(ids.paidtoDate, paymentDetails?.paidtoDate ?? '—');
  setText(ids.remainingbalance, paymentDetails?.remainingbalance ?? '—');
  setText(ids.paymentMethodDescription, paymentDetails?.paymentMethodDescription ?? '—');
  setText(ids.paymentFrequency, paymentDetails?.paymentFrequency ?? '—');

  // ---- Instalments table rendering (innerHTML approach) ----
  const tbody = document.getElementById(ids.instalmentsTbody);
  const tableEl = document.getElementById(ids.instalmentsTable);

  const formatAmount = (value) => {
    if (value === null || value === undefined || value === '') return '—';
    const num = Number(value);
    if (!Number.isFinite(num)) return String(value);
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: ids.currency || 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    } catch {
      return num.toFixed(2);
    }
  };

  /**
   * Writes instalment rows into the tbody using innerHTML + insertAdjacentHTML,
   * following the "renderTable" approach you provided.
   */
  const renderInstalmentsTable = (instalments) => {
    if (!tbody) {
      console.warn(`[getLeaseInfoForYear] <tbody id="${ids.instalmentsTbody}"> not found`);
      return { rendered: false, count: 0 };
    }

    // Ensure table is visible if present
    if (tableEl) tableEl.style.display = 'table';

    // Clear previous rows
    tbody.innerHTML = '';

    const rows = Array.isArray(instalments) ? instalments : [];

    if (rows.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="2" style="text-align:center; font-style:italic;">
            No instalments for the selected year${yearToUse ? ` (${yearToUse})` : ''}.
          </td>
        </tr>
      `;
      return { rendered: true, count: 0 };
    }

    rows.forEach(item => {
      const dueDateText = item?.dueDate ? formatDate(item.dueDate) : '—';
      const amountText = formatAmount(item?.amount);

      const rowHtml = `
        <tr>
          <td class="cell">${dueDateText}</td>
          <td class="cell">${amountText}</td>
        </tr>
      `;
      tbody.insertAdjacentHTML('beforeend', rowHtml);
    });

    return { rendered: true, count: rows.length };
  };

  const { rendered: instalmentsRendered, count: instalmentsCount } =
    renderInstalmentsTable(paymentDetails?.instalments ?? []);

  return {
    premiseId: basePremise?.id ?? null,
    yearUsed: yearToUse ?? null,
    paymentFound: !!paymentDetails,
    paymentDetails: paymentDetails ?? null,
    instalmentsRendered,
    instalmentsCount,
  };
}




/* Render MyDocuments */

const ALL_VALUE = '__all__';

/* ---------- Date helpers ---------- */
function parseUploadDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const s = dateStr.trim();
  // ISO yyyy-mm-dd or yyyy/mm/dd
  if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(s)) {
    const [y, m, d] = s.split(/[-/]/).map(Number);
    return new Date(y, m - 1, d);
  }
  // UK dd/mm/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split('/').map(Number);
    return new Date(y, m - 1, d);
  }
  const fallback = new Date(s);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function addMonths(date, months) {
  const d = new Date(date.getTime());
  const targetMonth = d.getMonth() + months;
  const lastOfTarget = new Date(d.getFullYear(), targetMonth + 1, 0);
  d.setMonth(targetMonth);
  if (d.getDate() > lastOfTarget.getDate()) d.setDate(lastOfTarget.getDate());
  return d;
}

function isDocumentNew(uploadDateStr) {
  const uploadDate = parseUploadDate(uploadDateStr);
  if (!uploadDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const threshold = addMonths(uploadDate, 3);
  return threshold >= today;
}

/* ---------- Utilities ---------- */
function base64ToBlob(base64, mimeType = 'application/pdf') {
  const cleaned = (base64 || '').replace(/^data:.*;base64,/, '');
  if (!cleaned) return new Blob([], { type: mimeType });
  const byteCharacters = atob(cleaned);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

function htmlToElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function toSafeFilename(name, ext = '.pdf') {
  const base = (name || 'document')
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 120);
  return base.toLowerCase().endsWith(ext) ? base : base + ext;
}

/* ---------- Row builder ---------- */
function buildDocumentRow(doc) {
  const title = doc.Title || 'Untitled document';
  const category = doc.category || 'Unknown';
  const uploaded = doc.UploadDate || '';
  const showNew = isDocumentNew(uploaded);

  const el = htmlToElement(`
    <div class="col-12 col-md-12 col-xl-12 col-xxl-12 document-row">
      <div class="app-card app-card-doc shadow-sm h-100">
        <div class="container">
          <div class="row p-2">
            <div class="col p-1">
              <div class="app-card-thumb-holder p-2 position-relative">
                <span class="icon-holder"><i class="fas fa-file-alt text-file"></i></span>
                ${showNew ? '<span class="badge bg-success position-absolute" style="top:5px;">NEW</span>' : ''}
                <!-- Link mask triggers view -->
                <a class="app-card-link-mask js-view-doc" href="#" aria-label="Open document" data-bs-toggle="modal" data-bs-target="#documentModal"></a>
              </div>
            </div>
            <div class="col-8 p-3">
              <div class="app-card-body p-1">
                <h4 class="truncate mb-2">
                  <a href="#" class="js-view-doc" data-bs-toggle="modal" data-bs-target="#documentModal">${title}</a>
                </h4>
                <div class="row">
                  <div class="col-auto"><p class="truncate mb-0"><span class="text-muted">Category:</span> ${category}</p></div>
                  <div class="col-auto"><p class="truncate mb-0"><span class="text-muted">Uploaded:</span> ${uploaded}</p></div>
                </div>
              </div>
            </div>
            <div class="col p-3 justify-content-end d-sm-flex">
              <div class="row">
                <div class="col-auto">
                  <a class="btn app-btn-primary js-download-doc" href="#"><i class="fa fa-download"></i> Download</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`);

  // Attach data for handlers
  el.dataset.base64 = doc.base64 || '';
  el.dataset.title = title;
  el.dataset.category = category;
  el.dataset.uploadDate = uploaded;

  return el;
}

/* ---------- State ---------- */
const __docUIState = {
  allDocs: [],
  filteredDocs: [],
  categoriesOrig: [],   // ['Council Tax', 'Housing', ...] (original casing)
  categoriesLower: [],  // ['council tax', 'housing', ...] (lowercased for matching)
  currentPage: 1,
  pageSize: 10,
  elements: {
    list: null,
    filter: null,
    pager: null,
    modalSelector: '#documentModal',
    modalContentSelector: '#documentModal iframe'
  }
};

/* ---------- Filter helpers (integrated & robust) ---------- */
function getCategoriesFromDocs(docs) {
  const set = new Map(); // lower -> original
  docs.forEach(d => {
    const orig = (d.category || 'Unknown').trim();
    const lower = orig.toLowerCase();
    if (!set.has(lower)) set.set(lower, orig);
  });
  const entries = Array.from(set.entries()).sort((a, b) => a[1].localeCompare(b[1], undefined, { sensitivity: 'base' }));
  return {
    categoriesLower: entries.map(([lower]) => lower),
    categoriesOrig: entries.map(([, orig]) => orig)
  };
}

/** Populate dropdown with categories + "All documents" option (value = '__all__'). */
function populateCategoryFilter(selectEl) {
  const { categoriesOrig, categoriesLower } = __docUIState;

  // Clear existing options
  selectEl.options.length = 0;

  // "All documents" — default selected
  const allOpt = document.createElement('option');
  allOpt.value = ALL_VALUE;
  allOpt.textContent = 'All Categories';
  allOpt.selected = true;
  allOpt.defaultSelected = true;
  selectEl.appendChild(allOpt);

  // Category options: value = lowercased, label = original
  categoriesOrig.forEach((orig, idx) => {
    const opt = document.createElement('option');
    opt.value = categoriesLower[idx];
    opt.textContent = orig;
    selectEl.appendChild(opt);
  });

  // Ensure selection
  forceSelect(selectEl, ALL_VALUE);
  // Guard against external resets
  guardAgainstBlank(selectEl);
}

/** Force the <select> to show a specific value (or fallback to first option). */
function forceSelect(selectEl, value) {
  const options = Array.from(selectEl.options || []);
  const idx = options.findIndex(o => o.value === value);
  if (idx >= 0) {
    options.forEach(o => { o.selected = false; o.defaultSelected = false; });
    options[idx].selected = true;
    options[idx].defaultSelected = true;
    selectEl.selectedIndex = idx;
    selectEl.value = value;
  } else {
    selectEl.selectedIndex = 0;
    selectEl.value = options[0]?.value || ALL_VALUE;
  }
}

/** Watch for external resets and re-assert a valid value (ALL_VALUE). */
function guardAgainstBlank(selectEl) {
  const obs = new MutationObserver(() => {
    if (!selectEl.value || selectEl.selectedIndex === -1) {
      forceSelect(selectEl, ALL_VALUE);
    }
  });
  obs.observe(selectEl, { attributes: true, attributeFilter: ['value'], childList: true });
}

/** Normalize filter to either ALL or a lowercased category present in data. */
function normalizeFilter(val) {
  const v = (val || '').toLowerCase();
  if (v === ALL_VALUE || v === 'all') return ALL_VALUE;
  return __docUIState.categoriesLower.includes(v) ? v : ALL_VALUE;
}

/** Read initial filter from URL (?filter=...) or `defaultFilter`. */
function getInitialFilter(defaultFilter = ALL_VALUE) {
  try {
    const qs = new URLSearchParams(window.location.search);
    const fromUrl = qs.get('filter'); // may be category or 'all'
    return normalizeFilter(fromUrl || defaultFilter);
  } catch {
    return normalizeFilter(defaultFilter);
  }
}

/* ---------- Sorting / Filtering / Rendering ---------- */
function sortDocsByDate(docs) {
  return docs.sort((a, b) => {
    const dateA = parseUploadDate(a.UploadDate) || new Date(0);
    const dateB = parseUploadDate(b.UploadDate) || new Date(0);
    return dateB - dateA; // newest first
  });
}

function applyFilter(selectedLower) {
  const sel = normalizeFilter(selectedLower);
  if (!__docUIState.elements.filter) return;
  forceSelect(__docUIState.elements.filter, sel);

  const docs = __docUIState.allDocs;
  __docUIState.filteredDocs = (sel === ALL_VALUE)
    ? docs.slice()
    : docs.filter(d => (d.category || 'Unknown').trim().toLowerCase() === sel);

  __docUIState.currentPage = 1;
}

function renderListPage() {
  const { list } = __docUIState.elements;
  const { filteredDocs, currentPage, pageSize } = __docUIState;
  if (!list) return;

  list.innerHTML = '';

  if (!filteredDocs || filteredDocs.length === 0) {
    list.innerHTML = '<p class="text-muted">No documents available.</p>';
    return;
  }

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, filteredDocs.length);
  const fragment = document.createDocumentFragment();

  for (let i = startIdx; i < endIdx; i++) {
    fragment.appendChild(buildDocumentRow(filteredDocs[i]));
  }

  list.appendChild(fragment);
}

function renderPagination() {
  const { pager } = __docUIState.elements;
  const { filteredDocs, currentPage, pageSize } = __docUIState;
  if (!pager) return;

  const total = filteredDocs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Documents pagination');

  const ul = document.createElement('ul');
  ul.className = 'pagination mb-0';

  const addPageItem = (label, page, { disabled = false, active = false, ariaLabel = null } = {}) => {
    const li = document.createElement('li');
    li.className = `page-item${disabled ? ' disabled' : ''}${active ? ' active' : ''}`;
    const a = document.createElement('a');
    a.className = 'page-link js-page';
    a.href = '#';
    a.textContent = label;
    if (ariaLabel) a.setAttribute('aria-label', ariaLabel);
    if (!disabled) a.dataset.page = String(page);
    li.appendChild(a);
    ul.appendChild(li);
  };

  const addEllipsis = () => {
    const li = document.createElement('li');
    li.className = 'page-item disabled';
    li.innerHTML = '<span class="page-link">&hellip;</span>';
    ul.appendChild(li);
  };

  addPageItem('«', currentPage - 1, { disabled: currentPage === 1, ariaLabel: 'Previous page' });

  const maxButtons = 7;
  let start = Math.max(1, currentPage - 3);
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);

  if (start > 1) {
    addPageItem('1', 1, { active: currentPage === 1 });
    if (start > 2) addEllipsis();
  }

  for (let p = start; p <= end; p++) addPageItem(String(p), p, { active: p === currentPage });

  if (end < totalPages) {
    if (end < totalPages - 1) addEllipsis();
    addPageItem(String(totalPages), totalPages, { active: currentPage === totalPages });
  }

  addPageItem('»', currentPage + 1, { disabled: currentPage === totalPages, ariaLabel: 'Next page' });

  nav.appendChild(ul);

  const info = document.createElement('p');
  info.className = 'mt-2 text-muted small mb-0';
  info.textContent = `Showing page ${currentPage} of ${totalPages} (${total} document${total === 1 ? '' : 's'})`;

  pager.innerHTML = '';
  pager.appendChild(nav);
  pager.appendChild(info);
}

/* ---------- Interactions ---------- */
function wireInteractions() {
  const { filter, pager, list, modalSelector, modalContentSelector } = __docUIState.elements;

  // Filter change
  if (filter && !filter.dataset.bound) {
    filter.addEventListener('change', () => {
      const selected = normalizeFilter(filter.value);
      applyFilter(selected);
      renderListPage();
      renderPagination();
    });
    filter.dataset.bound = 'true';
  }

  // Pagination click
  if (pager && !pager.dataset.bound) {
    pager.addEventListener('click', (e) => {
      const link = e.target.closest('.js-page');
      if (!link || !link.dataset.page) return;
      e.preventDefault();
      const page = Number(link.dataset.page);
      const totalPages = Math.max(1, Math.ceil(__docUIState.filteredDocs.length / __docUIState.pageSize));
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        __docUIState.currentPage = page;
        renderListPage();
        renderPagination();
        __docUIState.elements.list.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    pager.dataset.bound = 'true';
  }

  // View (delegated on list)
  if (list && !list.dataset.viewBound) {
    list.addEventListener('click', function (e) {
      const viewBtn = e.target.closest('.js-view-doc');
      if (!viewBtn) return;
      e.preventDefault();

      const row = viewBtn.closest('.document-row') || viewBtn.closest('.col-12') || viewBtn.closest('.app-card') || viewBtn.closest('.row');
      const base64 = (row?.dataset?.base64) || '';
      const title = (row?.dataset?.title) || 'Document';
      if (!base64) {
        console.warn('No base64 found for this document.');
        return;
      }

      const blob = base64ToBlob(base64);
      const url = URL.createObjectURL(blob);

      const iframe = document.querySelector(modalContentSelector);
      if (iframe) {
        iframe.src = url;
        iframe.title = title;
      }

      // Open modal programmatically (reliable even if already open)
      const modalEl = document.querySelector(modalSelector);
      if (modalEl && window.bootstrap && typeof window.bootstrap.Modal === 'function') {
        const instance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        instance.show();
      }

      // Cleanup on close
      if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', () => {
          if (iframe) iframe.src = '';
          URL.revokeObjectURL(url);
        }, { once: true });
      }
    });
    list.dataset.viewBound = 'true';
  }

  // Download (delegated on list)
  if (list && !list.dataset.downloadBound) {
    list.addEventListener('click', function (e) {
      const dlBtn = e.target.closest('.js-download-doc');
      if (!dlBtn) return;
      e.preventDefault();

      const row = dlBtn.closest('.document-row') || dlBtn.closest('.col-12') || dlBtn.closest('.app-card') || dlBtn.closest('.row');
      const base64 = (row?.dataset?.base64) || '';
      const title = (row?.dataset?.title) || 'document';
      if (!base64) {
        console.warn('No base64 found for this document.');
        return;
      }

      const blob = base64ToBlob(base64);
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = toSafeFilename(title, '.pdf');
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    list.dataset.downloadBound = 'true';
  }
}

/* ---------- Ensurers ---------- */
function ensureFilterElement(selector, listEl) {
  let selectEl = document.querySelector(selector);
  if (!selectEl) {
    selectEl = document.createElement('select');
    selectEl.className = 'form-select mb-3';
    selectEl.id = selector.replace(/^#/, '') || 'docCategoryFilter';
    // insert before the list
    listEl.parentNode.insertBefore(selectEl, listEl);
  }
  return selectEl;
}

function ensurePagerElement(selector, listEl) {
  let pagerEl = document.querySelector(selector);
  if (!pagerEl) {
    pagerEl = document.createElement('div');
    pagerEl.id = selector.replace(/^#/, '') || 'documentsPagination';
    pagerEl.className = 'mt-3';
    // insert after the list
    if (listEl.nextSibling) {
      listEl.parentNode.insertBefore(pagerEl, listEl.nextSibling);
    } else {
      listEl.parentNode.appendChild(pagerEl);
    }
  }
  return pagerEl;
}

/* ---------- Exported entry point ---------- */
/**
 * Render documents UI with integrated filter + pagination.
 * @param {Object} config
 * @param {string} config.container - Selector for list container (e.g., '#documentsList')
 * @param {string} [config.filterSelector='#docCategoryFilter'] - Dropdown selector
 * @param {string} [config.pagerSelector='#documentsPagination'] - Pagination container selector
 * @param {string} [config.dataUrl='data.json'] - Path to JSON with { mydocuments: [...] }
 * @param {number} [config.pageSize=10] - Items per page
 * @param {string} [config.modalSelector='#documentModal'] - Bootstrap modal selector
 * @param {string} [config.modalContentSelector='#documentModal iframe'] - Iframe inside modal
 * @param {string} [config.defaultFilter='__all__'] - Initial filter if URL doesn't provide one
 */
export async function renderMyDocuments({
  container,
  filterSelector = '#docCategoryFilter',
  pagerSelector = '#documentsPagination',
  dataUrl = 'data.json',
  pageSize = 10,
  modalSelector = '#documentModal',
  modalContentSelector = '#documentModal iframe',
  defaultFilter = ALL_VALUE
} = {}) {
  const listEl = document.querySelector(container);
  if (!listEl) {
    console.error(`Container not found: ${container}`);
    return;
  }

  const filterEl = ensureFilterElement(filterSelector, listEl);
  const pagerEl = ensurePagerElement(pagerSelector, listEl);

  __docUIState.elements.list = listEl;
  __docUIState.elements.filter = filterEl;
  __docUIState.elements.pager = pagerEl;
  __docUIState.elements.modalSelector = modalSelector;
  __docUIState.elements.modalContentSelector = modalContentSelector;
  __docUIState.pageSize = Math.max(1, Number(pageSize) || 10);

  try {
    const res = await fetch(dataUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch ${dataUrl}: ${res.status} ${res.statusText}`);
    const data = await res.json();

    // Prepare docs and categories
    let docs = Array.isArray(data.mydocuments) ? data.mydocuments : [];
    docs = sortDocsByDate(docs); // newest first
    __docUIState.allDocs = docs.slice();

    const { categoriesLower, categoriesOrig } = getCategoriesFromDocs(__docUIState.allDocs);
    __docUIState.categoriesLower = categoriesLower;
    __docUIState.categoriesOrig = categoriesOrig;

    // Populate filter dropdown
    populateCategoryFilter(filterEl);

    // Determine initial filter (URL or default) and apply
    const initialFilter = getInitialFilter(defaultFilter);
    applyFilter(initialFilter);

    // Render UI and bind events
    renderListPage();
    renderPagination();
    wireInteractions();
  } catch (err) {
    console.error(err);
    listEl.innerHTML = '<p class="text-danger">There was a problem loading your documents.</p>';
    // Bind events anyway (in case a later retry is added)
    wireInteractions();
  }
}

/**
 * Display MyDocuments banner
 */
export function getMyDocCount(data) {
    try {
        const unreadDocs = data.mydocuments.filter(docs => docs.isRead !== "Y");
        const countDocs = unreadDocs.length;
        setTextIfExists('mydocumentscount-menu', countDocs);
    } catch (error) {
        console.error('getMyDocCount error:', error.message);
    }
}




/**
 * FOOTER - add footer to every page.
 */
(function () {
    function injectFooter() {
        const footerHTML = `
            <footer class="app-footer">
                <div class="container text-center py-3">
                    <p>&copy;2025 - Newcastle-under-Lyme Borough Council</p>
                    <small><strong>Help us improve this site!</strong><a href="mailto:crelations@newcastle-staffs.gov.uk"> Leave your feedback</a> on how we can improve our services.
                    </small>
                </div>
            </footer>
        `;

        // Append footer to the body
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    // Run after DOM is ready
    document.addEventListener('DOMContentLoaded', injectFooter);

    // Export if needed elsewhere
    window.injectFooter = injectFooter;
})();



/**
 * When dropdown changes, reload all of the data from the json - RESIDENTIAL
 */

export async function handleAccountChange(data, selectedId, contentId = 'pageContent') {
    try {
        showSpinnerAndHideContent(contentId);
        await new Promise(resolve => setTimeout(resolve, 500));

        const filteredTaxAccounts = data?.accountActivities?.filter(activity =>
            String(activity?.accountid).trim() === String(selectedId).trim()
        );

        if (!filteredTaxAccounts || filteredTaxAccounts.length === 0) {
            clearAccountDetails(); // Pass nothing to clear UI
            clearTables();
            hideSpinnerAndShowContent(contentId);
            updateTaxUI(data, selectedId);
        } else {
            const filteredTaxAccount = filteredTaxAccounts[0];
            updateTaxUI(data, selectedId);
            updateAccountDetails(filteredTaxAccount);
            populateYearDropdown(filteredTaxAccount);
        }

        // Garden waste subscriptions
        const gwSub = data.mysubscriptions.find(sub =>
            sub.category?.toLowerCase() === 'garden waste' &&
            String(sub.accountid).trim() === String(selectedId).trim() &&
            sub.status?.toLowerCase() !== 'closed'
        );
        if (gwSub) {
            updateGardenWasteUI(!!gwSub, gwSub ? formatDate(gwSub.expiry) : null);
        } else {
            updateGardenWasteUI(!!gwSub, gwSub ? formatDate(gwSub.expiry) : null);
        }


        // Render tables
        renderSubscriptionsTable(data, selectedId);
        renderServiceRequestsTable(data, selectedId);

        //get subscriptions expiring in 90 days
        showExpiringSubscriptions(data, 'count-subscriptions', 90, selectedId);

        //Lease - next payment
        const widgetElement = document.getElementById('widget-lease-nextpayment');

        if (widgetElement && data && selectedId) {
            showNextLeasePayment(data, selectedId, 'widget-lease-nextpayment');
        } else {
            console.warn('Lease - no lease payments found.');
        }


        //Lease - populate the dropdown
        const leaseDropdown = document.getElementById('leaseyearsDropdown');
        const activePremises = data.leasedpremises.filter(
            premise => premise.accountid === selectedId && premise.status === 'Active'
        );
        let selectedLeaseYear = null;

        if (leaseDropdown) {
            selectedLeaseYear = initLeaseYearsDropdown(activePremises, 'leaseyearsDropdown');
        } else {
            console.warn('Lease - no years found.');
        }


        hideSpinnerAndShowContent(contentId);
    } catch (error) {
        console.error('handleAccountChange error:', error.message);
        hideSpinnerAndShowContent(contentId);
    }
}


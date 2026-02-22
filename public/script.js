// Get the "Create Account" link and form container
function openTab(event, tabName) {
    // Hide all tab content
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    // Show the selected tab
    document.getElementById(tabName).style.display = "block";
}
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Send the form data via an AJAX POST request
    fetch('/create-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // Update the non-editable fields with the auto-generated values
            document.getElementById('customer-id').value = result.customerID;
            document.getElementById('account-number').value = result.accountNumber;
            
            alert('Account created successfully!');
        } else {
            alert('Failed to create account: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});
function createAccountresetForm() {
    document.querySelector('form').reset(); // This will reset all form fields to their initial values
    document.getElementById('customer-id').value = ''; // Clear the auto-generated Customer ID field
    document.getElementById('account-number').value = ''; // Clear the auto-generated Account Number field
}

function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString();
    document.getElementById('currentTime').textContent = now.toLocaleTimeString();
}



function depositFormresetForm() {
    // Get the form element
    const form = document.getElementById('depositForm');
    
    // Reset text and date fields
    form.reset();

    // Clear readonly fields
    document.getElementById('name-user').value = '';
    document.getElementById('customerID').value = '';
    document.getElementById('mobileNo').value = '';
    document.getElementById('date').value = '';
}



// Handle account search by account number
document.querySelector('.find-btn').addEventListener('click', function() {
    const accountNo = document.getElementById('accountNo').value.trim();  // Ensure no extra spaces

    if (!accountNo) {
        alert('Please enter an account number.');
        return;
    }

    fetch(`/account-details/${accountNo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Populate the fields with the fetched data
                document.getElementById('name-user').value = data.name;
                document.getElementById('customerID').value = data.customerID;
                document.getElementById('mobileNo').value = data.mobile;
                document.getElementById('date').value = data.date;
            } else {
                alert('Account not found');
            }
        })
        .catch(error => {
            console.error('Error fetching account details:', error);
            alert('Error fetching account details');
        });
});

// Handle deposit form submission
document.getElementById('depositForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const accountNo = document.getElementById('accountNo').value.trim();
    const depositAmount = document.getElementById('depositAmount').value.trim();

    if (!accountNo || !depositAmount || isNaN(depositAmount) || depositAmount <= 0) {
        alert('Please enter a valid account number and deposit amount.');
        return;
    }

    const data = {
        accountNumber: accountNo,
        depositAmount: depositAmount
    };

    fetch('/deposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Deposit successful! New balance: ' + result.balance);
            document.getElementById('depositAmount').value = '';  // Clear deposit field after success
        } else {
            alert('Deposit failed: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error processing deposit:', error);
        alert('Error processing deposit');
    });
});












// Handle account search for withdrawal
document.querySelector('.btnFindWithdraw').addEventListener('click', function() {
    const accountNo = document.getElementById('withdrawAccountNumber').value.trim();

    if (!accountNo) {
        alert('Please enter an account number.');
        return;
    }

    fetch(`/account-details/${accountNo}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('withdrawName').value = data.name;
                document.getElementById('withdrawCustomerId').value = data.customerID;
                document.getElementById('withdrawMobileNumber').value = data.mobile;
                document.getElementById('withdrawDate').value = data.date;
            } else {
                alert('Account not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching account details:', error);
            alert('Error fetching account details.');
        });
});

// Handle withdraw form submission
document.getElementById('withdrawalForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const accountNo = document.getElementById('withdrawAccountNumber').value.trim();
    const withdrawAmount = document.getElementById('withdrawAmount').value.trim();

    if (!accountNo || !withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
        alert('Please enter a valid account number and amount.');
        return;
    }

    const data = {
        accountNumber: accountNo,
        withdrawAmount: withdrawAmount
    };

    fetch('/withdraw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Withdrawal successful! New balance: ' + result.balance);
            document.getElementById('withdrawAmount').value = '';  // Clear withdrawal field
        } else {
            alert('Withdrawal failed: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error processing withdrawal:', error);
        alert('Error processing withdrawal.');
    });
});

function WithdrawresetForm() {
    // Get the form element
    const form = document.getElementById('withdrawalForm');
    
    // Reset text and date fields
    form.reset();

    // Clear readonly fields
    document.getElementById('name-user').value = '';
    document.getElementById('customerID').value = '';
    document.getElementById('mobileNo').value = '';
    document.getElementById('date').value = '';
}














// Find Account Details (for both sender and receiver)
// Function to find account details (for both sender and receiver)
function findAccount(type) {
    const accountNo = document.getElementById(`${type}AccountNumber`).value.trim();

    if (!accountNo) {
        alert('Please enter an account number.');
        return;
    }

    fetch(`/account-details/${accountNo}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById(`${type}Name`).value = data.name;
                document.getElementById(`${type}CustomerId`).value = data.customerID;
                document.getElementById(`${type}Mobile`).value = data.mobile;
            } else {
                alert('Account not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching account details:', error);
            alert('Error fetching account details.');
        });
}

// Attach event listeners to the "Find" buttons
document.querySelector('.transferFindBtn1').addEventListener('click', function() {
    findAccount('from');
});

document.querySelector('.transferFindBtn').addEventListener('click', function() {
    findAccount('to');
});

// Handle the form submission for transferring money
document.getElementById('transferForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form from submitting the traditional way

    const fromAccount = document.getElementById('fromAccountNumber').value.trim();
    const toAccount = document.getElementById('toAccountNumber').value.trim();
    const amount = document.getElementById('amount').value.trim();

    // Check if all required values are valid
    if (!fromAccount || !toAccount || isNaN(amount) || amount <= 0) {
        alert('Please enter valid details.');
        return;
    }

    const data = {
        fromAccountNumber: fromAccount,
        toAccountNumber: toAccount,
        amount: amount
    };

    // Send the data to the server
    fetch('/transfer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convert the form data to JSON format
    })
    .then(response => response.json()) // Convert response to JSON
    .then(result => {
        if (result.success) {
            alert('Transfer successful!');
            document.getElementById('transferForm').reset(); // Reset the form
        } else {
            alert('Transfer failed: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error during transfer:', error); // Log errors if any
        alert('Error processing transfer.');
    });
});











function fetchAccountDetails() {
    const accountNumber = document.getElementById('accountNumber').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!accountNumber) {
        alert('Please enter an account number.');
        return;
    }

    // Build the query parameters for date filtering if provided
    let query = '';
    if (startDate && endDate) {
        query = `?startDate=${startDate}&endDate=${endDate}`;
    }

    // Fetch account details and transaction history
    fetch(`/view-balance/${accountNumber}${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Populate the balance and name fields
                document.getElementById('currentAmount').value = data.balance;
                document.getElementById('CustomersName').value = data.name;

                // Populate the transaction table
                const transactionTableBody = document.getElementById('transactionTableBody');
                transactionTableBody.innerHTML = '';  // Clear existing data

                data.transactions.forEach(transaction => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${new Date(transaction.transaction_date).toLocaleDateString()}</td>
                        <td>${transaction.transaction_type}</td>
                        <td>${transaction.source_account_number || 'N/A'}</td>
                        <td>${transaction.amount}</td>
                        <td>${transaction.destination_account_number || 'N/A'}</td>
                    `;
                    transactionTableBody.appendChild(row);
                });
            } else {
                alert('Account not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching account details and transactions:', error);
            alert('Error fetching account details.');
        });
}






function ViewresetForm() {
    // Reset account number input field
    document.getElementById('accountNumber').value = '';
    
    // Reset current amount and customer name fields
    document.getElementById('currentAmount').value = '';
    document.getElementById('CustomersName').value = '';
    
    // Reset date fields
    document.getElementById('startDate').value = '';
    setEndDateToTomorrow();  // Reset the endDate to tomorrow
    
    // Clear the transaction table
    document.getElementById('transactionTableBody').innerHTML = '';
}
//--------------------------------------------------------------------------------


// Function to load all customer details
function loadAllCustomers() {
    fetch('/all-customers')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const customerTableBody = document.getElementById('ConttransactionTableBody');
                customerTableBody.innerHTML = '';  // Clear existing data

                data.customers.forEach(customer => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${customer.accountNumber}</td>
                        <td>${customer.customerID}</td>
                        <td>${customer.branch}</td>
                        <td>${customer.name}</td>
                        <td>${customer.accountType}</td>
                        <td>${new Date(customer.dob).toLocaleDateString()}</td>
                        <td>${customer.gender}</td>
                        <td>${customer.aadhar}</td>
                        <td>${customer.pan}</td>
                        <td>${customer.mobile}</td>
                    `;
                    customerTableBody.appendChild(row);
                });
            } else {
                alert('Error loading customers.');
            }
        })
        .catch(error => {
            console.error('Error loading customers:', error);
            alert('Error loading customers.');
        });
}

// Load all customers when the "All Customers" tab is opened
document.querySelector('[onclick="openTab(event, \'allCustomers\')"]').addEventListener('click', loadAllCustomers);


function fetchCustomerDetails() {
    const accountNo = document.getElementById('contoaccountNumber').value.trim();

    if (!accountNo) {
        alert('Please enter an account number.');
        return;
    }

    fetch(`/account-details/${accountNo}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('constCustomersName').value = data.name;
                document.getElementById('CustomersId').value = data.customerID;
            } else {
                alert('Account not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching customer details:', error);
            alert('Error fetching customer details.');
        });
}
function confirmDeactivate() {
    const accountNo = document.getElementById('contoaccountNumber').value.trim();

    if (!accountNo) {
        alert('Please enter an account number.');
        return;
    }

    if (confirm('Are you sure you want to deactivate this account? This action cannot be undone.')) {
        fetch(`/delete-account/${accountNo}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Account successfully deactivated.');
                    
                    // Reset the form after successful deletion
                    resetCustomerForm();

                    // Refresh the customer list
                    loadAllCustomers();
                } else {
                    alert('Error deactivating account.');
                }
            })
            .catch(error => {
                console.error('Error deactivating account:', error);
                alert('Error deactivating account.');
            });
    }
}
function resetCustomerForm() {
    // Clear account number and customer details fields
    document.getElementById('contoaccountNumber').value = '';
    document.getElementById('constCustomersName').value = '';
    document.getElementById('CustomersId').value = '';
}
//------------------------------------------------------------------

function validateForm() {
    const dob = document.getElementById("kycDob").value;
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 18) {
        alert("You must be at least 18 years old.");
        return false;
    }
    return true;
}
//------------------------------------------------------------------

// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // Handle the "Find" button click for the update section
    document.querySelector('.find-button').addEventListener('click', function () {
        const accountNumber = document.getElementById('kycAccountNumber').value.trim();

        if (!accountNumber) {
            alert('Please enter an account number.');
            return;
        }

        // Fetch account details
        fetch(`/account/${accountNumber}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const account = data.account;

                    // Populate the form with the fetched data
                    document.getElementById('kycBranchName').value = account.branch;
                    document.getElementById('kycCustomerId').value = account.customerID;
                    document.getElementById('kycAccountType').value = account.accountType;
                    document.getElementById('kycName').value = account.name;
                    document.getElementById('kycDob').value = account.dob.split('T')[0]; // Format date
                    document.getElementById('kycGender').value = account.gender;
                    document.getElementById('kycGuardianName').value = account.guardian;
                    document.getElementById('kycReligion').value = account.religion;
                    document.getElementById('kycPanNumber').value = account.pan;
                    document.getElementById('kycAadharNumber').value = account.aadhar;
                    document.getElementById('kycMobileNumber').value = account.mobile;
                    document.getElementById('kycEmail').value = account.email;
                    document.getElementById('kycAddress').value = account.address;

                    // If there are additional fields, populate them accordingly
                    // Ensure all IDs match the form fields
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching account details:', error);
                alert('Error fetching account details');
            });
    });

    // Handle the "Update" form submission
    document.querySelector('.kyc-form').addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission

        // Gather updated data from the form
        const updatedData = {
            accountNumber: document.getElementById('kycAccountNumber').value.trim(),
            branch: document.getElementById('kycBranchName').value,
            accountType: document.getElementById('kycAccountType').value,
            name: document.getElementById('kycName').value,
            dob: document.getElementById('kycDob').value,
            gender: document.getElementById('kycGender').value,
            guardian: document.getElementById('kycGuardianName').value,
            religion: document.getElementById('kycReligion').value,
            pan: document.getElementById('kycPanNumber').value,
            aadhar: document.getElementById('kycAadharNumber').value,
            mobile: document.getElementById('kycMobileNumber').value,
            email: document.getElementById('kycEmail').value,
            address: document.getElementById('kycAddress').value,
            // Include any additional fields as needed
        };

        // Send the updated data to the server
        fetch('/update-account', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Account updated successfully!');
                // Optionally, reset the form or redirect the user
            } else {
                alert('Failed to update account: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error updating account:', error);
            alert('Error updating account');
        });
    });

});


window.onload = function () {
    setMaxDOB();
};

// Function to set max date for DOB (18 years ago)
function setMaxDOB() {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago

    // Format the maxDate as YYYY-MM-DD
    const formattedMaxDate = maxDate.toISOString().split('T')[0];

    // Set the max attribute for the DOB input
    document.getElementById('kycDob').setAttribute('max', formattedMaxDate);
}


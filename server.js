const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize express
const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Redirect to login page automatically
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Connect to MongoDB (without deprecated options)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyward_bank')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define a User schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

// Create a User model
const User = mongoose.model('User', userSchema);

// Define the Account schema
const accountSchema = new mongoose.Schema({
    branch: { type: String, required: true },
    customerID: { type: String, required: true, unique: true }, // Auto-generated
    accountNumber: { type: String, required: true, unique: true }, // Auto-generated
    accountType: { type: String, required: true },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    guardian: { type: String, required: true },
    nationality: { type: String, required: true },
    occupation: { type: String, required: true },
    income: { type: String, required: true },
    category: { type: String, required: true },
    religion: { type: String, required: true },
    pan: { type: String, required: true },
    aadhar: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    balance: { type: Number, default: 0 }  // Account balance
});
const accountSchema2 = new mongoose.Schema({
    branch: { type: String, required: true },
    customerID: { type: String, required: true, unique: true }, // Auto-generated
    accountNumber: { type: String, required: true, unique: true }, // Auto-generated
    accountType: { type: String, required: true },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    guardian: { type: String, required: true },
    nationality: { type: String, required: true },
    occupation: { type: String, required: true },
    income: { type: String, required: true },
    category: { type: String, required: true },
    religion: { type: String, required: true },
    pan: { type: String, required: true },
    aadhar: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
});

// Create the Account model
const Account = mongoose.model('Account', accountSchema);
const CustomerRecord = mongoose.model('CustomerRecord', accountSchema);
// Serve static files for HTML and assets
app.use(express.static('public'));

// Handle login requests
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user in the database
        const user = await User.findOne({ username });

        if (!user) {
            return res.json({ success: false, message: 'User not found....?' });
        }

        // Check if the password matches
        if (user.password === password) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: 'Wrong password....' });
        }
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'An error occurred, please try again' });
    }
});

// Redirect to dashboard after login
app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/Dashboard.html');
});

// Utility function to generate a random number with a specified number of digits
function generateRandomNumber(length) {
    let number = Math.floor(Math.random() * Math.pow(10, length)); 
    while (number.toString().length !== length || number.toString().startsWith('0')) {
        number = Math.floor(Math.random() * Math.pow(10, length)); 
    }
    return number;
}

// Handle account creation form submission
app.post('/create-account', async (req, res) => {
    try {
        const accountData = req.body;

        // Generate Customer ID (6 digits) and Account Number (13 digits)
        const customerID = generateRandomNumber(6);
        const accountNumber = generateRandomNumber(13);

        // Create a new account document with auto-generated values
        const newAccount = new Account({
            branch: accountData.branch,
            customerID: customerID.toString(), // Auto-generated
            accountNumber: accountNumber.toString(), // Auto-generated
            accountType: accountData['account-type'],
            name: accountData.name,
            dob: accountData.dob,
            gender: accountData.gender,
            maritalStatus: accountData['marital-status'],
            guardian: accountData.guardian,
            nationality: accountData.nationality,
            occupation: accountData.occupation,
            income: accountData.income,
            category: accountData.category,
            religion: accountData.religion,
            pan: accountData.pan,
            aadhar: accountData.aadhar,
            mobile: accountData.mobile,
            email: accountData.email,
            address: accountData.address,
            amount: accountData.amount
        });
        const newAccount2 = new CustomerRecord({
            branch: accountData.branch,
            customerID: customerID.toString(), // Auto-generated
            accountNumber: accountNumber.toString(), // Auto-generated
            accountType: accountData['account-type'],
            name: accountData.name,
            dob: accountData.dob,
            gender: accountData.gender,
            maritalStatus: accountData['marital-status'],
            guardian: accountData.guardian,
            nationality: accountData.nationality,
            occupation: accountData.occupation,
            income: accountData.income,
            category: accountData.category,
            religion: accountData.religion,
            pan: accountData.pan,
            aadhar: accountData.aadhar,
            mobile: accountData.mobile,
            email: accountData.email,
            address: accountData.address,
           
        });
        // Save the account document to MongoDB
        await newAccount.save();
        await newAccount2.save();
        res.json({
            success: true,
            message: 'Account created successfully!',
            customerID: customerID,
            accountNumber: accountNumber
        });
    } catch (error) {
        console.error('Error saving account:', error);
        res.status(500).json({ success: false, message: 'An error occurred while creating the account.' });
    }
});



//------------------------------------------------------------------------------------------

const transactionSchema = new mongoose.Schema({
    account_number: { type: String, required: true },
    transaction_date: { type: Date, required: true },
    transaction_type: { type: String, required: true },  // e.g., 'Deposit'
    source_account_number: { type: String, default: null },  // Null for deposit
    amount: { type: Number, required: true },
    destination_account_number: { type: String, default: null }  // Null for deposit
});

// Create the TransactionStatement model
const TransactionStatement = mongoose.model('TransactionStatement', transactionSchema);

module.exports = TransactionStatement;


//----------------------------------------------------------------------------------------------




app.get('/account-details/:accountNumber', async (req, res) => {
    const accountNumber = req.params.accountNumber;

    try {
        const account = await Account.findOne({ accountNumber });
        
        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        res.json({
            success: true,
            name: account.name,
            customerID: account.customerID,
            mobile: account.mobile,
            date: new Date().toISOString().slice(0, 10)  // current date in YYYY-MM-DD format
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching account details' });
    }
});

// Handle deposit money and update account balance
app.post('/deposit', async (req, res) => {
    const { accountNumber, depositAmount } = req.body;
    
    try {
        const account = await Account.findOne({ accountNumber });

        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        // Convert depositAmount to a number and add it to the existing balance
        const deposit = parseFloat(depositAmount);
        if (isNaN(deposit) || deposit <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid deposit amount' });
        }

        account.balance += deposit;  // Accumulate deposit

        // Save the updated account balance
        await account.save();



//----------------------------------------------------------------------------------------------
        const transaction = new TransactionStatement({
            account_number: accountNumber,
            transaction_date: new Date(),  // Current date
            transaction_type: 'Deposit',  // Transaction type: Deposit
            amount: deposit
        });

        // Save the transaction to the database
        await transaction.save();

//----------------------------------------------------------------------------------------------



        // Optionally save deposit history here if needed

        res.json({ success: true, message: 'Deposit successful', balance: account.balance });
    } catch (err) {
        console.error('Error processing deposit:', err);
        res.status(500).json({ success: false, message: 'Error processing deposit' });
    }
});


/*----------------------------------------------------------------------------------------------*/






app.post('/withdraw', async (req, res) => {
    const { accountNumber, withdrawAmount } = req.body;

    try {
        const account = await Account.findOne({ accountNumber });

        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        const withdrawal = parseFloat(withdrawAmount);
        if (isNaN(withdrawal) || withdrawal <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
        }

        if (account.balance < withdrawal) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        // Deduct the withdrawal amount
        account.balance -= withdrawal;
        await account.save();

        // Save the transaction
        const transaction = new TransactionStatement({
            account_number: accountNumber,
            transaction_date: new Date(),
            transaction_type: 'Withdraw',
            amount: withdrawal
        });
        await transaction.save();

        res.json({ success: true, message: 'Withdrawal successful', balance: account.balance });
    } catch (err) {
        console.error('Error processing withdrawal:', err);
        res.status(500).json({ success: false, message: 'Error processing withdrawal' });
    }
});





/*----------------------------------------------------------------------------------------------*/





// Route to fetch account details by account number
// Route to handle the transfer of money between accounts
app.post('/transfer', async (req, res) => {
    const { fromAccountNumber, toAccountNumber, amount } = req.body;

    try {
        const fromAccount = await Account.findOne({ accountNumber: fromAccountNumber });
        const toAccount = await Account.findOne({ accountNumber: toAccountNumber });

        if (!fromAccount || !toAccount) {
            return res.status(404).json({ success: false, message: 'One or both accounts not found' });
        }

        const transferAmount = parseFloat(amount);

        if (isNaN(transferAmount) || transferAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid transfer amount' });
        }

        if (fromAccount.balance < transferAmount) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        // Update balances
        fromAccount.balance -= transferAmount;
        toAccount.balance += transferAmount;

        await fromAccount.save();
        await toAccount.save();

        // Save the transaction for the sender
        const senderTransaction = new TransactionStatement({
            account_number: fromAccountNumber,
            transaction_date: new Date(),
            transaction_type: 'Transfer',
            source_account_number: fromAccountNumber,
            destination_account_number: toAccountNumber,
            amount: transferAmount
        });
        await senderTransaction.save();

        // Save the transaction for the receiver
        const receiverTransaction = new TransactionStatement({
            account_number: toAccountNumber,
            transaction_date: new Date(),
            transaction_type: 'Receive',
            source_account_number: fromAccountNumber,
            destination_account_number: toAccountNumber,
            amount: transferAmount
        });
        await receiverTransaction.save();

        res.json({ success: true, message: 'Transfer successful' });
    } catch (err) {
        console.error('Error processing transfer:', err);
        res.status(500).json({ success: false, message: 'Error processing transfer' });
    }
});


//---------------------------------------------------------------------------------------------



// Route to get account balance and transactions by account number (with optional date filter)
app.get('/view-balance/:accountNumber', async (req, res) => {
    const accountNumber = req.params.accountNumber;
    const { startDate, endDate } = req.query;  // Optional date filter

    try {
        // Find the account by account number
        const account = await Account.findOne({ accountNumber });

        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        // Get the balance
        const balance = account.balance;

        // Fetch transactions for the account, with optional date filtering
        const query = { account_number: accountNumber };
        if (startDate && endDate) {
            query.transaction_date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const transactions = await TransactionStatement.find(query).sort({ transaction_date: -1 });

        res.json({
            success: true,
            name: account.name,
            balance: balance,
            transactions: transactions
        });
    } catch (err) {
        console.error('Error fetching balance and transactions:', err);
        res.status(500).json({ success: false, message: 'Error fetching balance and transactions' });
    }
});



//----------------------------------------------------------------------------------------------





// Fetch all customer details
app.get('/all-customers', async (req, res) => {
    try {
        const customers = await Account.find({});
        res.json({ success: true, customers });
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ success: false, message: 'Error fetching customers' });
    }
});
// Handle account deletion
app.delete('/delete-account/:accountNumber', async (req, res) => {
    const accountNumber = req.params.accountNumber;

    try {
        const account = await Account.findOneAndDelete({ accountNumber });

        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({ success: false, message: 'Error deleting account' });
    }
});










// Fetch account details for updating
app.get('/account/:accountNumber', async (req, res) => {
    const accountNumber = req.params.accountNumber;

    try {
        const account = await Account.findOne({ accountNumber });

        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        res.json({
            success: true,
            account
        });
    } catch (err) {
        console.error('Error fetching account details:', err);
        res.status(500).json({ success: false, message: 'Error fetching account details' });
    }
});

// Update account details
app.put('/update-account', async (req, res) => {
    const accountData = req.body;

    try {
        // Find the account by account number and update its fields
        const updatedAccount = await Account.findOneAndUpdate(
            { accountNumber: accountData.accountNumber },
            {
                branch: accountData.branch,
                accountType: accountData.accountType,
                name: accountData.name,
                dob: accountData.dob,
                gender: accountData.gender,
                guardian: accountData.guardian,
                religion: accountData.religion,
                pan: accountData.pan,
                aadhar: accountData.aadhar,
                mobile: accountData.mobile,
                email: accountData.email,
                address: accountData.address,
                // Include any additional fields as necessary
            },
            { new: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        res.json({ success: true, message: 'Account updated successfully!' });
    } catch (err) {
        console.error('Error updating account:', err);
        res.status(500).json({ success: false, message: 'Error updating account' });
    }
});







//-------------------------------------------------------------------------------------------------

// Assuming you are using express-session middleware for managing sessions
const session = require('express-session');

app.use(session({
    secret: '15d483cc0b84576ef7d96c2f3bd2de1498bd0dc2aab20796ebd9d4c619b09ed0322c96a4fa3a88b555caef127a6862c8c2752b7cc634b9b8c20696b23e797c63',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

// Logout Route
app.get('/logout', (req, res) => {
    // Destroy the session and redirect to login page
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Unable to log out');
        }
        res.redirect('/login.html');  // Redirect to the login page
    });
});


//--------------------------------------------------------------------------------------------------------------


const debitCardSchema = new mongoose.Schema({
    accountNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    customerID: { type: String, required: true },
    cardNumber: { type: String, required: true, unique: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true },
    pin: { type: String, required: true }
});

const DebitCard = mongoose.model('DebitCard', debitCardSchema);
app.get('/find-account/:accountNumber', async (req, res) => {
    const accountNumber = req.params.accountNumber;

    // Check if the account exists in the debit_card schema
    const debitCard = await DebitCard.findOne({ accountNumber });
    if (debitCard) {
        // If debit card exists, return the card details
        return res.json({ success: true, debitCard });
    }

    // Otherwise, fetch from the Account schema
    const account = await Account.findOne({ accountNumber });
    if (!account) {
        return res.status(404).json({ success: false, message: 'Account not found' });
    }

    // Auto-generate card details
    const cardDetails = generateCardDetails();
    
    // Return account details along with generated card details
    res.json({
        success: true,
        account: {
            name: account.name,
            customerID: account.customerID
        },
        cardDetails
    });
});
function generateCardDetails() {
    const cardNumber = generateRandomNumber(16);
    const expiryDate = `${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getFullYear() + 10).slice(2)}`;
    const cvv = generateRandomNumber(3);
    const pin = generateRandomNumber(4);
    return { cardNumber, expiryDate, cvv, pin };
}

function generateRandomNumber(length) {
    let number = Math.floor(Math.random() * Math.pow(10, length)); 
    while (number.toString().length !== length || number.toString().startsWith('0')) {
        number = Math.floor(Math.random() * Math.pow(10, length)); 
    }
    return number.toString();
}
app.post('/activate-debit-card', async (req, res) => {
    const { accountNumber, name, customerID, cardNumber, expiryDate, cvv, pin } = req.body;

    // Check if the card already exists
    const existingCard = await DebitCard.findOne({ accountNumber });
    if (existingCard) {
        return res.status(400).json({ success: false, message: 'Card already exists for this account' });
    }

    // Create a new debit card record
    const newCard = new DebitCard({
        accountNumber,
        name,
        customerID,
        cardNumber,
        expiryDate,
        cvv,
        pin
    });

    await newCard.save();
    res.json({ success: true, message: 'Debit card activated successfully!' });
});


app.delete('/deactivate-debit-card/:accountNumber', async (req, res) => {
    const accountNumber = req.params.accountNumber;

    try {
        // Check if the debit card exists
        const existingCard = await DebitCard.findOneAndDelete({ accountNumber });

        if (!existingCard) {
            return res.status(404).json({ success: false, message: 'Debit card not found for this account' });
        }

        res.json({ success: true, message: 'Debit card deactivated successfully' });
    } catch (err) {
        console.error('Error deactivating debit card:', err);
        res.status(500).json({ success: false, message: 'An error occurred while deactivating the debit card' });
    }
});


//------------------------------------------------------------------------------------------
// Define Services schema
const servicesSchema = new mongoose.Schema({
    accountNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    chequeBook: { type: String, enum: ['Activated', 'Deactivated'], default: 'Deactivated' },
    emailStatement: { type: String, enum: ['Activated', 'Deactivated'], default: 'Deactivated' },
    smsAlert: { type: String, enum: ['Activated', 'Deactivated'], default: 'Deactivated' },
    internetBanking: { type: String, enum: ['Activated', 'Deactivated'], default: 'Deactivated' },
    safeDeposit: { type: String, enum: ['Activated', 'Deactivated'], default: 'Deactivated' }
});

// Create the Services model
const Services = mongoose.model('Services', servicesSchema);
app.post('/create-account', async (req, res) => {
    try {
        const accountData = req.body;

        // Generate Customer ID and Account Number
        const customerID = generateRandomNumber(6);
        const accountNumber = generateRandomNumber(13);

        // Create new account
        const newAccount = new Account({
            ...accountData,
            customerID,
            accountNumber
        });

        // Save account to the database
        await newAccount.save();

        // Automatically create services for the new account
        const newServices = new Services({
            accountNumber,
            name: accountData.name, // Ensure 'name' is part of accountData
            // Services will have default 'Deactivated' values
        });
        await newServices.save();

        res.json({
            success: true,
            message: 'Account and services created successfully!',
            customerID,
            accountNumber
        });
    } catch (error) {
        console.error('Error creating account or services:', error);
        res.status(500).json({ success: false, message: 'Error creating account and services.' });
    }
});
app.post('/update-services', async (req, res) => {
    const { accountNumber, name, chequeBook, emailStatement, smsAlert, internetBanking, safeDeposit } = req.body;

    try {
        // Check if the services record exists
        let services = await Services.findOne({ accountNumber });

        if (!services) {
            // If not, create a new services record
            services = new Services({
                accountNumber,
                name,
                chequeBook,
                emailStatement,
                smsAlert,
                internetBanking,
                safeDeposit
            });
            await services.save();
            return res.json({ success: true, message: 'Services created successfully!' });
        } else {
            // If exists, update the services
            services.name = name; // Update name if necessary
            services.chequeBook = chequeBook;
            services.emailStatement = emailStatement;
            services.smsAlert = smsAlert;
            services.internetBanking = internetBanking;
            services.safeDeposit = safeDeposit;
            await services.save();
            return res.json({ success: true, message: 'Services updated successfully!' });
        }
    } catch (error) {
        console.error('Error updating services:', error);
        res.status(500).json({ success: false, message: 'Error updating services.' });
    }
});


//-----------------------------------------------------------------------------



const creditCardSchema = new mongoose.Schema({
    accountNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    customerID: { type: String, required: true },
    cardNumber: { type: String, required: true, unique: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true },
    pin: { type: String, required: true },
    creditLimit: { type: Number, default: 50000 }, // Default Credit Limit
    billingCycle: { type: String, default: '1st to 30th' }, // Default Billing Cycle
    interestRate: { type: Number, default: 3.5 } // Default Interest Rate
});

const CreditCard = mongoose.model('CreditCard', creditCardSchema);
app.get('/find-credit-account/:accountNumber', async (req, res) => {
    const accountNumber = req.params.accountNumber;

    // Check if the account exists in the credit card schema
    const creditCard = await CreditCard.findOne({ accountNumber });
    if (creditCard) {
        // If credit card exists, return the card details
        return res.json({ 
            success: true, 
            creditCard: {
                name: creditCard.name,
                customerID: creditCard.customerID,
                cardNumber: creditCard.cardNumber,
                expiryDate: creditCard.expiryDate,
                cvv: creditCard.cvv,
                pin: creditCard.pin,
                creditLimit: creditCard.creditLimit,
                billingCycle: creditCard.billingCycle,
                interestRate: creditCard.interestRate
            }
        });
    }

    // Otherwise, fetch from the Account schema if credit card doesn't exist
    const account = await Account.findOne({ accountNumber });
    if (!account) {
        return res.status(404).json({ success: false, message: 'Account not found' });
    }

    // Auto-generate card details
    const cardDetails = generateCardDetails();

    res.json({
        success: true,
        account: {
            name: account.name,
            customerID: account.customerID
        },
        cardDetails,
        creditLimit: 50000, // Default Credit Limit
        billingCycle: '1st to 30th', // Default Billing Cycle
        interestRate: 3.5 // Default Interest Rate
    });
});


app.post('/activate-credit-card', async (req, res) => {
    const { accountNumber, name, customerID, cardNumber, expiryDate, cvv, pin } = req.body;

    // Check if the card already exists
    const existingCard = await CreditCard.findOne({ accountNumber });
    if (existingCard) {
        return res.status(400).json({ success: false, message: 'Credit card already exists for this account' });
    }

    // Create a new credit card record
    const newCard = new CreditCard({
        accountNumber,
        name,
        customerID,
        cardNumber,
        expiryDate,
        cvv,
        pin
    });

    await newCard.save();
    res.json({ success: true, message: 'Credit card activated successfully!' });
});


app.delete('/deactivate-credit-card/:accountNumber', async (req, res) => {
    const accountNumber = req.params.accountNumber;

    try {
        const deletedCard = await CreditCard.findOneAndDelete({ accountNumber });

        if (!deletedCard) {
            return res.status(404).json({ success: false, message: 'Credit card not found for this account' });
        }

        res.json({ success: true, message: 'Credit card deactivated and deleted successfully' });
    } catch (err) {
        console.error('Error deactivating credit card:', err);
        res.status(500).json({ success: false, message: 'Error occurred while deactivating the credit card' });
    }
});












//----------------------------------------------------------------
app.get('/all-customer-records', async (req, res) => {
    try {
        // Fetching data from CustomerRecord schema
        const customers = await CustomerRecord.find({}); // Correct schema
        res.json({ success: true, customers });
    } catch (err) {
        console.error('Error fetching customer records:', err);
        res.status(500).json({ success: false, message: 'Error fetching customer records' });
    }
});
// Define the Employee schema
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Create the Employee model
const Employee = mongoose.model('Employee', employeeSchema);
app.post('/create-admin', async (req, res) => {
    try {
        const { name, username, role, email, password } = req.body;

        // Check if the username or email already exists
        const existingEmployee = await Employee.findOne({ username });
        const existingUser = await User.findOne({ username });
        if (existingEmployee || existingUser) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        // Create and save a new Employee document
        const newEmployee = new Employee({
            name,
            username,
            role,
            email,
            password
        });
        await newEmployee.save();

        // Save the same data into the User schema for authentication
        const newUser = new User({
            username,
            password
        });
        await newUser.save();

        res.json({ success: true, message: 'Admin created successfully!' });
    } catch (err) {
        console.error('Error creating admin:', err);
        res.status(500).json({ success: false, message: 'An error occurred while creating the admin.' });
    }
});
app.get('/all-admins', async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.json({ success: true, employees });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ success: false, message: 'Error fetching employees' });
    }
});
app.delete('/delete-admin/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Find and delete the employee by username from Employees schema
        const deletedEmployee = await Employee.findOneAndDelete({ username });

        // If the employee is found and deleted, delete the user from Users schema
        if (deletedEmployee) {
            await User.findOneAndDelete({ username });
            return res.json({ success: true, message: 'Admin deleted successfully!' });
        } else {
            return res.status(404).json({ success: false, message: 'Admin not found!' });
        }
    } catch (err) {
        console.error('Error deleting admin:', err);
        res.status(500).json({ success: false, message: 'Error deleting admin' });
    }
});







const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);
// Handle admin login requests
app.post('/admin-login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find admin in the database
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.json({ success: false, message: 'Admin not found?..' });
        }

        // Check if the password matches
        if (admin.password === password) {
            return res.json({ success: true, message: 'Login successful' });
        } else {
            return res.json({ success: false, message: 'Invalid password!..' });
        }
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'An error occurred, please try again' });
    }
});

// Admin Logout Route
app.get('/admin-logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Unable to log out');
        }
        res.redirect('/login.html');  // Redirect to the login page
    });
});








// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Localhost link: http://localhost:${port}`);
});





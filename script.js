'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,

    movementsDates: [
        '2019-10-18T21:31:17.178Z',
        '2019-09-23T07:42:02.383Z',
        '2020-04-28T09:15:04.904Z',
        '2020-07-01T10:17:24.185Z',
        '2020-08-08T14:11:59.604Z',
        '2020-10-27T17:01:17.194Z',
        '2020-11-11T23:36:17.929Z',
        '2020-12-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const formatMovementDates = function(date, locale) {
    const calcDatesPassed = function(date1, date2) {
        return Math.abs(Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)));
    }

    const datesPassed = calcDatesPassed(new Date(), date);

    if (datesPassed === 1) return 'Today';
    if (datesPassed === 2) return 'Yesterday';
    if (datesPassed <= 7) return `${datesPassed} Ago`
    else {
        return new Intl.DateTimeFormat(locale).format(date);
    }
}

const displayMovements = function(acc) {
    containerMovements.innerHTML = '';
    acc.movements.forEach(function(movement, index) {
        let movementType = movement > 0 ? 'deposit' : 'withdrawal';
        const date = new Date(acc.movementsDates[index]);
        const formattedDate = formatMovementDates(date, acc.locale);
        const options = {
            style: 'currency',
            currency: acc.currency
        };
        const formateMove = new Intl.NumberFormat(acc.locale, options).format(movement);
        const movementElement = document.createElement('div');
        movementElement.setAttribute('class', 'movements__row');
        movementElement.insertAdjacentHTML('afterbegin', `
          <div class="movements__type movements__type--${movementType}">${index+1} ${movementType}</div>
          <div class="movements__date">${formattedDate}</div>
          <div class="movements__value">${formateMove}</div>
        `);
        containerMovements.insertAdjacentElement('afterbegin', movementElement);
    });
}

const calcDisplayBalance = function(accout) {
    const balance = accout.movements.reduce((acc, curr) => acc + curr, 0).toFixed(2);
    accout.balance = balance;
    const options = {
        style: 'currency',
        currency: accout.currency
    };
    const formateBalance = new Intl.NumberFormat(accout.locale, options).format(balance);
    labelBalance.textContent = `${formateBalance} `;
}

const displayAccountSummary = function(acc) {
    const totalDeposit = acc.movements
        .filter((mov) => mov > 0)
        .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    const totalWithDraw = acc.movements
        .filter((mov) => mov <= 0)
        .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    const totalInterest = acc.movements
        .filter((mov) => mov > 0)
        .map((deposit) => deposit * (acc.interestRate / 100))
        .filter((int) => int >= 1)
        .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    const options = {
        style: 'currency',
        currency: acc.currency
    };
    labelSumIn.textContent = `${new Intl.NumberFormat(acc.locale, options).format(totalDeposit)}`;
    labelSumOut.textContent = `${new Intl.NumberFormat(acc.locale, options).format(Math.abs(totalWithDraw))}`;
    labelSumInterest.textContent = `${new Intl.NumberFormat(acc.locale, options).format(totalInterest)}`;
}

const createUsernames = function(accounts) {
    accounts.forEach(function(account) {
        account.username = account.owner.toLowerCase().split(' ').map((name) => name[0]).join('');
    });
}

const displayCurrentDate = function() {
    const date = new Date();
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        month: 'long',
        date: 'numeric',
        year: 'numeric'
    }

    const formattedDate = new Intl.DateTimeFormat(currUser.locale, options).format(date);
    labelDate.textContent = formattedDate;
}
const updateUI = function(currUser) {
    calcDisplayBalance(currUser);
    displayMovements(currUser);
    displayAccountSummary(currUser);
}
const logoutUser = function() {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
}
const startLogoutTimer = function() {
    let time = 300,
        tick = function() {
            if (time === 0) {
                clearInterval(timer);
                logoutUser();
            }
            const min = Math.trunc(time / 60);
            const sec = Math.trunc(time % 60);
            labelTimer.textContent = `${min}:${sec}`;
            time--;
        };
    tick();
    let timer = setInterval(tick, 1000);
    return timer
}

createUsernames(accounts);
let currUser, timer;
let sortAcc = true;
btnLogin.addEventListener('click', function(e) {
    const userName = inputLoginUsername.value;
    const pass = Number(inputLoginPin.value);

    if (userName && pass) {
        currUser = accounts.find(acc => acc.username === userName && acc.pin === pass);
        if (currUser) {
            labelWelcome.textContent = `Welcome, ${currUser.owner}`;
            updateUI(currUser)
            displayCurrentDate();
            containerApp.style.opacity = 1;
            inputLoginUsername.value = '';
            inputLoginPin.value = '';
            if (timer) clearInterval(timer);
            timer = startLogoutTimer();
            /*setTimeout(function() {
                logoutUser();
            }, 4000)*/
        }
    }
    e.preventDefault();
});

btnTransfer.addEventListener('click', function(e) {
    const transferTo = inputTransferTo.value;
    const amount = Number(inputTransferAmount.value);

    if (transferTo && amount &&
        amount > 0 && currUser.balance >= amount &&
        transferTo !== currUser.username) {
        const transferUser = accounts.find((acc) => acc.username === transferTo);
        currUser.movements.push(-amount);
        currUser.movementsDates.push(new Date().toISOString());
        transferUser.movements.push(amount);
        transferUser.movementsDates.push(new Date().toISOString());
        updateUI(currUser);
        inputTransferTo.value = inputTransferAmount.value = '';
    }
    clearInterval(timer)
    timer = startLogoutTimer();
    e.preventDefault();

});

btnLoan.addEventListener('click', function(e) {
    const loanAmount = Math.floor(inputLoanAmount.value);
    if (loanAmount > 0 && currUser.movements.some((amm) => amm >= loanAmount * 0.1)) {
        setTimeout(function() {
            currUser.movements.push(loanAmount);
            currUser.movementsDates.push(new Date().toISOString());
            updateUI(currUser);
        }, 2500);
    }
    inputLoanAmount.value = '';
    clearInterval(timer)
    timer = startLogoutTimer();
    e.preventDefault();
})

btnClose.addEventListener('click', function(e) {
    const closeUser = inputCloseUsername.value;
    const closePin = Number(inputClosePin.value);
    if (closePin && closeUser &&
        closeUser === currUser.username &&
        closePin === currUser.pin) {
        const accUserIndex = accounts.findIndex((acc) => acc.username === closeUser && acc.pin === closePin);
        accounts.splice(accUserIndex, 1);
        logoutUser();
    }
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    e.preventDefault();
});

btnSort.addEventListener('click', function(e) {
    let accMovements = currUser.movements.slice();
    accMovements.sort((a, b) => a - b);
    if (!sortAcc) {
        accMovements.reverse();
        btnSort.innerHTML = '&uparrow; SORT'
    } else {
        btnSort.innerHTML = '&downarrow; SORT'
    }
    sortAcc = !sortAcc;
    displayMovements({ movementsDates: currUser.movementsDates, movements: accMovements });
});
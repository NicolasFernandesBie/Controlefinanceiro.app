const TransactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')


const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'))
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
  transactions = transactions
    .filter(transaction => transaction.id !== ID)
  updateLocalStorage()
  init()
}
const addTransactionIntoDOM = (transaction) => {
  const operator = transaction.amount < 0 ? '-' : '+';
  const CSSclass = transaction.amount < 0 ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement('li');

  li.classList.add(CSSclass);
  li.innerHTML = `
  ${transaction.name}
  <span>${operator} R$ ${amountWithoutOperator}</span>
  <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
`;

  TransactionsUl.append(li);
};

const updateBalanceValues = () => {
  const transactionsAmounts = transactions
    .map(transaction => transaction.amount);

  const total = transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);

  const income = transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

  const expense = Math.abs(
    transactionsAmounts
      .filter(value => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0)
  ).toFixed(2);

  console.log(expense)

  console.log('Total:', total);
  console.log('Receitas:', income);
  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$  ${expense}`
};

const init = () => {
  TransactionsUl.innerHTML = ''; // limpa antes de renderizar
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}


const generateID = () => Math.round(Math.random() * 1000)


form.addEventListener('submit', event => {
  event.preventDefault();

  const TransactionName = inputTransactionName.value.trim();
  const TransactionAmount = inputTransactionAmount.value.trim().replace(',', '.');

  if (TransactionName === '' || TransactionAmount === '' || isNaN(TransactionAmount)) {
    alert('Por favor, preencha os dois campos corretamente');
    return;
  }

  const transaction = {
    id: generateID(),
    name: TransactionName,
    amount: parseFloat(TransactionAmount)
  };

  transactions.push(transaction);
  init();
  updateLocalStorage();

  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
});

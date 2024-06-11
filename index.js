#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from "@faker-js/faker";
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accNumber;
    constructor(ftName, lName, age, gender, mob, acc) {
        this.firstName = ftName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
class Bank {
    accounts = [];
    customers = [];
    addCustomer(obj) {
        this.customers.push(obj);
    }
    addAccountNumber(obj) {
        this.accounts.push(obj);
    }
    transaction(accObj) {
        let newAccounts = this.accounts.filter((acc) => acc.accNumber !== accObj.accNumber);
        this.accounts = [...newAccounts, accObj];
    }
}
let myBank = new Bank();
// Create customers and accounts
for (let i = 1; i <= 3; i++) {
    let ftName = faker.person.firstName("male");
    let lastName = faker.person.lastName("male");
    let age = Math.floor(Math.random() * (100 - 18 + 1) + 18);
    let mob = Math.floor(Math.random() * (9999999999 - 100000000) + 20);
    let acc = 1000 + i;
    let gender = "male";
    let cus = new Customer(ftName, lastName, age, gender, mob, acc);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 100 * i });
}
// Banking service
console.log(chalk.bold.yellow(" ****** Welcome to My Bank *****"));
console.log(chalk.bold.yellow("acc no: (1001, 1002, 1003) , Balance: $100, $200, $300"));
async function bankService(bank) {
    do {
        let serv = await inquirer.prompt({
            type: "list",
            name: "service",
            message: "Select a service",
            choices: ["Deposit", "Withdraw", "Check Balance", "View Balance", "Exit"],
        });
        // Deposit
        if (serv.service === "Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "acc",
                message: "Please Enter Your Account Number:",
            });
            let account = myBank.accounts.find((acc) => acc.accNumber === parseInt(res.acc));
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number:"));
            }
            else {
                let amount = await inquirer.prompt({
                    type: "input",
                    name: "amount",
                    message: "Enter Amount to Deposit:",
                });
                let newBalance = account.balance + parseInt(amount.amount);
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(chalk.green.bold(`Deposit Successful! New Balance: $${newBalance}`));
            }
        }
        // Withdraw
        if (serv.service === "Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "acc",
                message: "Please Enter Your Account Number:",
            });
            let account = myBank.accounts.find((acc) => acc.accNumber === parseInt(res.acc));
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number:"));
            }
            else {
                let amount = await inquirer.prompt({
                    type: "input",
                    name: "amount",
                    message: "Enter Amount to Withdraw:",
                });
                if (parseInt(amount.amount) > account.balance) {
                    console.log(chalk.red.bold("Insufficient Balance"));
                }
                else {
                    let newBalance = account.balance - parseInt(amount.amount);
                    bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                    console.log(chalk.green.bold(`Withdrawal Successful! New Balance: $${newBalance}`));
                }
            }
        }
        // Check Balance
        if (serv.service === "Check Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "acc",
                message: "Please Enter Your Account Number:",
            });
            let account = myBank.accounts.find((acc) => acc.accNumber === parseInt(res.acc));
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number:"));
            }
            else {
                console.log(chalk.blue.bold(`Your account balance is: $${account.balance}`));
            }
        }
        // View Balance
        if (serv.service === "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "acc",
                message: "Please Enter Your Account Number:",
            });
            let account = myBank.accounts.find((acc) => acc.accNumber === parseInt(res.acc));
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number:"));
            }
            else {
                let name = myBank.customers.find((item) => item.accNumber === account.accNumber);
                console.log(chalk.cyan.bold(`Dear ${name?.firstName} ${name?.lastName} your account balance is: $${account.balance}`));
            }
        }
        // Exit
        if (serv.service === "Exit") {
            console.log(chalk.yellow("Exiting..."));
            break;
        }
    } while (true);
}
bankService(myBank);

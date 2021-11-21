const record = require("../../models/record")

module.exports = {
  getIconName(categoryName, categories) {
    const category = categories.find((category) => category.name === categoryName)
    return category.icon
  },
   getTotalAmount(records) {
    let totalAmount = 0
    records.forEach(record => {
      totalAmount += record.amount
    })
    return totalAmount
  },
  getIncomeCategorizedSum(records) {
    const result = {
      salary: 0,
      bonus: 0,
      investment: 0,
      others: 0,
    }
    records.forEach((record) => {
      if (record.type === 'income') {
        result[record.category] += record.amount
      }
    })
    return result
  },
  getExpenseCategorizedSum(records) {
    const result = {
      housewares: 0,
      transportation: 0,
      entertainment: 0,
      consumption: 0,
      others: 0,
    }
    records.forEach((record) => {
      if (record.type === 'expense') {
        result[record.category] += record.amount
      }
    })
    return result
  },
  getTotalBalance(records) {
    let totalBalance = 0
    records.forEach((record) => {
      if (record.type === 'income') {
        totalBalance += record.amount
      } else if (record.type === 'expense') {
        totalBalance -= record.amount
      }
    })
    return totalBalance
  },
  getAccountingFormat(amount) {
    return amount.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')
  },
}
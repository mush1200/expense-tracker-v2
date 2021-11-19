const record = require("../../models/record")

module.exports = {
  getIconName(categoryName, categories) {
    const category = categories.find((category) => category.name_cn === categoryName)
    return category.icon
  },
   getTotalAmount(records) {
    let totalAmount = 0
    records.forEach(record => {
      totalAmount += record.amount
    })
    return totalAmount
  },
}
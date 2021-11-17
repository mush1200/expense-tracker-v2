module.exports = {
  toDate: function (date) {
      return new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000))
        .toISOString()
        .split("T")[0]
    },
  eq: function (v1, v2) {
      return v1 === v2
  },
  lt: function (v1, v2) {
      return v1 < v2
  }
}
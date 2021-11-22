const incomeCtx = document.getElementById('income-chart')
const expenseCtx = document.getElementById('expense-chart')
const incomeLabels = ['Salary', 'Bonus', 'Investment', 'Others']
const salary = document.querySelector('.income-salary-sum').value
const bonus = document.querySelector('.income-bonus-sum').value
const investment = document.querySelector('.income-investment-sum').value
const incomeOthers = document.querySelector('.income-others-sum').value
const housewares = document.querySelector('.expense-housewares-sum').value
const transportation = document.querySelector('.expense-transportation-sum').value
const entertainment = document.querySelector('.expense-entertainment-sum').value
const consumption = document.querySelector('.expense-consumption-sum').value
const expenseOthers = document.querySelector('.expense-others-sum').value

showIncomeChart()
showExpenseChart()
function showIncomeChart() {
  const incomeChart = new Chart(incomeCtx, {
    type: 'doughnut',
    data: {
      labels: ['薪資所得',
      '獎金紅利',
      '投資報酬','其他'],
      datasets: [{
        label: 'Income Dataset',
        data: [salary, bonus , investment, incomeOthers],
        backgroundColor: [
          'rgba(255, 0, 0, 0.5)',
          'rgba(0, 0, 255, 0.5)',
          'rgba(255, 140, 0, 0.5)',
          'rgba(46, 139, 87, 0.5)'
        ],
        hoverOffset: 4
      }]
    },
    options: {
      plugins: {
        title: {
          align: 'start',
          display: true,
          text: '收入',
          font: {
            family: "'Arial', sans-serif",
            size: 16,
          }
        },
        legend: {
          position: 'right'
        },
        tooltip: {
          callbacks: {
            footer: (tooltipItem) => {
              let sum = 0
              const dataArr = tooltipItem[0].dataset.data
              dataArr.forEach((data) => {
                sum += Number(data)
              })

              const percentage = ((tooltipItem[0].parsed * 100) / sum).toFixed(2) + '%'
              return `百分比: ${percentage}`
            },
          },
          footerFont: {
            family: "'Arial', sans-serif",
            weight: 'normal',
          },
        },
        subtitle: {
          display: true,
          text: '台幣TWD',
          align: 'start'
        }
      }
    }
  })
}

function showExpenseChart() {
  const expenseChart = new Chart(expenseCtx, {
    type: 'doughnut',
    data: {
      labels: ['家居物業',
      '交通出行',
      '休閒娛樂','餐飲食品', '其他'],
      datasets: [{
        label: 'Expense Dataset',
        data: [housewares, transportation , entertainment, consumption, expenseOthers],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
        hoverOffset: 4
      }]
    },
     options: {
      plugins: {
        title: {
          align: 'start',
          display: true,
          text: '支出',
          font: {
            family: "'Arial', sans-serif",
            size: 16,
          }
        },
        legend: {
          position: 'right'
        },
        tooltip: {
          callbacks: {
            footer: (tooltipItem) => {
              let sum = 0
              const dataArr = tooltipItem[0].dataset.data
              dataArr.forEach((data) => {
                sum += Number(data)
              })

              const percentage = ((tooltipItem[0].parsed * 100) / sum).toFixed(2) + '%'
              return `百分比: ${percentage}`
            },
          },
          footerFont: {
            family: "'Arial', sans-serif",
            weight: 'normal',
          },
        },
        subtitle: {
          display: true,
          text: '台幣TWD',
          align: 'start'
        }
      }
    }
  })
}
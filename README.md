# Expense Tracker
一個用Express和MongoDB所建立的簡單記帳工具應用程式。可以註冊帳號登入，使用者可以創建、編輯、瀏覽支出收入紀錄。

#### 登入畫面
![login image](https://github.com/mush1200/expense-tracker-v2/blob/main/public/images/expenseTracker%E7%99%BB%E5%85%A5%E7%95%AB%E9%9D%A2.png)
<br/><br/>

#### 支出畫面
![balance image](https://github.com/mush1200/expense-tracker-v2/blob/main/public/images/expenseTracker%E6%94%AF%E5%87%BA%E7%95%AB%E9%9D%A2.png)
<br/><br/>

#### 收支平衡畫面
![balance image](https://github.com/mush1200/expense-tracker-v2/blob/main/public/images/expenseTracker%E6%94%B6%E6%94%AF%E5%B9%B3%E8%A1%A1%E7%95%AB%E9%9D%A2.png)
<br/><br/>

#### 後臺使用者清單畫面
![balance image](https://github.com/mush1200/expense-tracker-v2/blob/main/public/images/expenseTracker%E5%BE%8C%E8%87%BA%E4%BD%BF%E7%94%A8%E8%80%85%E6%B8%85%E5%96%AE.png)
<br/><br/>

#### 後臺類別支出排名畫面
![balance image](https://github.com/mush1200/expense-tracker-v2/blob/main/public/images/expenseTracker%E5%BE%8C%E8%87%BA%E9%A1%9E%E5%88%A5%E6%94%AF%E5%87%BA%E6%8E%92%E5%90%8D.png)
<br/><br/>

#### 後臺類別使用者收入排名畫面
![balance image](https://github.com/mush1200/expense-tracker-v2/blob/main/public/images/expenseTracker%E5%BE%8C%E8%87%BA%E4%BD%BF%E7%94%A8%E8%80%85%E6%94%B6%E5%85%A5%E6%8E%92%E5%90%8D.png)
<br/><br/>

## 部屬至Heroku網址
[Expense Tracker](https://rocky-atoll-48620.herokuapp.com/users/login)

## 專案功能
- 註冊/登入/登出
  - 使用者可以用Facebook、Google、GitHub及信箱註冊帳號登入網站
  - 使用者註冊重複/登入/登出失敗時，會看到對應的系統訊
- 使用者
  - 使用者可以瀏覽屬於他自己的所有支出/收入紀錄和支出/收入總金額
  - 使用者可以依據類別或月份來篩選支出/收入紀錄
  - 使用者可以新增一筆支出/收入紀錄
  - 使用者可以編輯一筆支出/收入紀錄
  - 使用者可以刪除一筆支出/收入紀錄
  - 使用者可以編輯自己的姓名、信箱和密碼
- 後台管理
  - 管理者可以瀏覽站內所有的使用者清單
  - 管理者可以瀏覽全站的所有使用者的支出收入清單紀錄
  - 管理者可以看見所有使用者的收入排名、支出排名
  - 管理者可以看見所有類別的收入排名、支出排名


## 環境建置
* nvm & Node.js
* nodemon
* MongoDB

## 安裝流程
1. 開啟終端機將專案存至本機:
```
git clone https://github.com/mush1200/expense-tracker-v2.git
```
2. 進入存放此專案的資料夾
```
cd expense-tracker-v2
```
3. 環境變數設定
將根目錄.env.example檔案中列為SKIP的部分替換為相關ID與金鑰內容,再把.env.example檔案名稱修改為.env 

4. 安裝相關套件
```
npm install
```
5. 安裝 nodemon 套件 (若未安裝)
```
npm install -g nodemon
```
6. 啟動本地 MongoDB 資料庫

7. 新增種子資料
```
npm run seed
```
8. 啟動專案
```
npm run dev
```
9. 當終端機出現以下訊息後 "The Express server is running on http://localhost:3000."
即可在 http://localhost:3000 開始使用


## 預設使用者登入資料
加入種子資料後，可使用下列預設帳號/密碼進行登入
- 使用者: 
  - 信箱 user1@example.com
  - 密碼 12345678
- 後臺管理者: 
  - 信箱 root@example.com
  - 密碼 12345678

## 開發人員
Mush/阿金

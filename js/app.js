"use strict";
const uiController = (function () {

  let incStr = `<div class="table-item" id="%0%" data-type="inc"><h3 class="stuff"> %1% </h3><div class="innerContainer"><div class="amount"> %2% </div><button class="btn--success btn-cross">&cross;</button></div></div>`,
    expStr = `<div class="table-item" id="%0%" data-type="exp"><h3 class="stuff"> %1% </h3><div class="innerContainer"><div class="amount"> %2% </div><button class="btn--error btn-cross">&cross;</button></div></div>`;

  let DomStrings = {
    // all the display
    total: "#total",
    income: "#income",
    expense: "#expense",
    // inputs
    type: "#type",
    description: "#description",
    amount: "#amount",
    btn: "#mainbtn",
    // inserting html for
    incTable: "#incTable",
    expTable: "#expTable"
  };

  let dom = {
    incTable: document.querySelector(DomStrings.incTable),
    expTable: document.querySelector(DomStrings.expTable),
    total: document.querySelector(DomStrings.total),
    income: document.querySelector(DomStrings.income),
    expense: document.querySelector(DomStrings.expense)
  };
  return {
    getDom() {
      return DomStrings;
    },
    getValues() {
      let type, descrip, amount;
      type = document.querySelector(DomStrings.type).value;
      descrip = document.querySelector(DomStrings.description).value;
      amount = document.querySelector(DomStrings.amount).value;

      return {
        type,
        descrip,
        amount
      };
    },
    insertHtml(type, descrip, amount) {
      let str = "";
      if (type == "inc") {
        let index = (dataController.data.budget.inc.length === 0) ? 0 : dataController.data.budget.inc.length - 1;
        str = incStr.replace("%1%", descrip.toUpperCase());
        str = str.replace("%2%", amount);
        str = str.replace("%0%", dataController.data.budget.inc[index][0]);
        dom.incTable.innerHTML += str;
      } else if (type == "exp") {
        let index = (dataController.data.budget.exp.length === 0) ? 0 : dataController.data.budget.exp.length - 1;
        str = expStr.replace("%1%", descrip.toUpperCase());
        str = str.replace("%2%", amount);
        str = str.replace("%0%", dataController.data.budget.exp[index][0]);
        dom.expTable.innerHTML += str;
      }
    },
    insertTotal() {
      dom.income.textContent = dataController.data.totalInc;
      dom.expense.textContent = dataController.data.totalExp;
      dom.total.textContent = dataController.data.total;
    },
    removeItem(ele) {
      let parent = ele,
        type = parent.dataset.type,
        id = parseInt(parent.id);
      let index;

      if (type === "inc") {
        dataController.data.budget.inc.forEach(findIndex);
        dataController.data.budget.inc.splice(index, 1);
      } else if (type === "exp") {
        dataController.data.budget.exp.forEach(findIndex);
        dataController.data.budget.exp.splice(index, 1);
      }
      parent.remove();
      function findIndex(e, i, arr) {
        if (e[0] === id) {
          index = i;
          return false;
        }
      }
    }
  };
})();



// Data controler
const dataController = (function () {

  let data = {
    budget: {
      inc: [],
      exp: []
    },
    total: 0,
    totalInc: 0,
    totalExp: 0
  };

  return {
    data,
    addData(type, amount) {
      if (type == "inc") {
        addInc(amount);
        calcTotal();
      } else if (type == "exp") {
        addExp(amount);
        calcTotal();
      } else {
        calcTotal();
      }
    }
  };

  //functions add Income
  function addInc(inc) {
    let arr = [];
    let id = data.budget.inc.length + 1;
    arr[0] = id;
    arr[1] = Math.round(inc);
    data.budget.inc.push(arr);
  }
  //functions add expense
  function addExp(exp) {
    let arr = [];
    let id = data.budget.exp.length + 1;
    arr[0] = id;
    arr[1] = Math.round(exp);
    data.budget.exp.push(arr);
  }
  //functions calculate total
  function calcTotal() {
    data.totalInc = ((data.budget.inc.length !== 0) ? calcArray(data.budget.inc) : 0);
    data.totalExp = ((data.budget.exp.length !== 0) ? calcArray(data.budget.exp) : 0);
    data.total = data.totalInc - data.totalExp;
  }
  // for calculating Array
  function calcArray(array) {
    let i = array.reduce((a, b) => { return Math.round(a) + Math.round(b[1]); }, 0);
    return i;
  }
})();



// main module
const mainController = (function () {

  let dom = uiController.getDom(),
    btn = document.querySelector(dom.btn),
    tables = document.querySelectorAll(dom.incTable + ", " + dom.expTable);

  return {
    init() {
      eventTrigger();
    }
  };
  // All the functions goes here.
  function eventTrigger() {
    document.addEventListener("keypress", eventHandler);
    btn.addEventListener("click", eventHandler);
    tables[0].addEventListener("click", removeItem);
    tables[1].addEventListener("click", removeItem);
  }
  function eventHandler(e) {

    let values = uiController.getValues();

    if ((e.keyCode == 13 || e.which == 13 || e.srcElement.id == dom.btn.substr(1))
      && (values.amount !== "" && values.descrip !== "" && !isNaN(parseInt(values.amount)) && values.amount !== "0")) {

      if (values.amount.startsWith("-")) {
        values.type = "exp";
        values.amount = Math.abs(values.amount);
      } else if (values.amount.startsWith("+")) {
        values.type = "inc";
        values.amount = Math.abs(values.amount);
      }
      //calculating the data
      dataController.addData(values.type, values.amount);

      //ui controler
      uiController.insertTotal();

      //inserting html to the table
      uiController.insertHtml(values.type, values.descrip, Math.round(values.amount));

    }
  }
  function removeItem(e) {
    let parent = e.target.parentNode.parentNode;
    if (e.target.nodeName === "BUTTON") {

      //remove Element
      parent.classList.add("hide");
      //bug if double clicked on button it will call again
      e.target.remove();
      setTimeout(function () {
        uiController.removeItem(parent);
        //caculat data
        dataController.addData();
        //inserting total
        uiController.insertTotal();
      }, 500);
    }
  }

})();
mainController.init();
//# sourceMappingURL=app.js.map

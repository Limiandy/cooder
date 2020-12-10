/*
 * @Descripttion:
 * @version:
 * @Author: Andy
 * @Date: 2020-03-30 11:46:33
 * @LastEditors: Andy
 * @LastEditTime: 2020-04-16 10:54:30
 */

/**
 * 返回操作节点
 * @param {String} id
 * @returns element
 */
function $_$(selecter) {
  let iden = selecter[0];
  let slt = selecter.slice(1, selecter.length);
  if (iden === "#") {
    return document.getElementById(slt);
  }
  if (iden === ".") {
    return document.getElementsByClassName(slt)[0];
  }
}
/**
 * 阻止冒泡继续发生，影响其它节点
 * @param {e} e
 */
function s(e) {
  e = e || event;
  e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
}

/**
 * 交互弹出层，点击按钮弹出对应交互框，点击其它位置隐藏交互框
 * @param {Array} btns
 */
function popModal(btns) {
  let flag = false;
  btns.map((el) => {
    $_$(el.concat("_btn")).onclick = function (e) {
      if (flag == false) {
        $_$(el.concat("_pop_modal")).style.display = "block";
        flag = true;
      } else {
        btns.map((el) => {
          $_$(el.concat("_pop_modal")).style.display = "none";
        });
        flag = false;
      }
      s(e);
    };
  });
  btns.map((el) => {
    $_$(el.concat("_pop_modal")).onclick = function (e) {
      s(e);
    };
  });
  document.onclick = function () {
    btns.map((el) => {
      $_$(el.concat("_pop_modal")).style.display = "none";
      flag = false;
    });
  };
}

function detailedArticle(id) {
  window.location.href = `http://192.168.100.6:3000/article.html?id=${id}`
  $_xhr.get('/cooderi/article/detailed',{
    'id': id
  }, res => {
    console.log(res)
    
  })
}

window.onload = function () {
  let btns = ["#theme", "#account", "#program", "#mobile"];
  this.popModal(btns);

  /** 控制小屏幕导航弹出层 */
  this.$_$(".navbar-toggler").addEventListener(
    "click",
    (e) => {
      let targ = $_$(".navbar-toggler").getAttribute("data-target");
      this.$_$(".navbar-toggler").focus();
      this.$_$(targ).style.height =
        this.$_$(targ).style.height == "" ? "150px" : "";
      this.$_$(targ).style.transition =
        this.$_$(targ).style.height == "" ? "" : "height .3s";
    },
    false
  );

  /**
   * 页面 夜间模式及字体控制
   */
  const dark_btns = document.getElementsByClassName("switch-btn");
  const htmlStyle = document.documentElement.style;
  dark_btns[0].onclick = function () {
    this.classList.add("active");
    dark_btns[1].classList.remove("active");
    $_$("#moon").style.color = "#c5c513";
    htmlStyle.setProperty("--home-bgcolor", "#3f3f3f");
    htmlStyle.setProperty("--border-bottom-color", "#000");
    htmlStyle.setProperty("--title-font-color", "#c8c8c8");
  };
  dark_btns[1].onclick = function () {
    this.classList.add("active");
    dark_btns[0].classList.remove("active");
    $_$("#moon").style.color = "#969696";
    htmlStyle.setProperty("--home-bgcolor", "#fff");
    htmlStyle.setProperty("--border-bottom-color", "#f1f1f1");
    htmlStyle.setProperty("--title-font-color", "#333333");
  };

  // sidebar 控制
  this.$_$('.js-btn').addEventListener('click', function() {
    $_xhr.get('/cooderi/article/ceatgory', {
      'ceatgory': 'js'
    }, res => {
      console.log(res)
      let html = template(document.getElementById("article-list").innerHTML,
      {'article': res})
      document.getElementById("tplist").innerHTML = html;
    })
  })

  $_$('.es6-btn').addEventListener('click', function() {
    $_xhr.get('/cooderi/article/list', res => {
      let getarticle = res.article
      let article = []
      for (let i in getarticle) {
        if (getarticle[i].creategory === 'ES6') {
          article.push(getarticle[i])
        }
      }
      let html = template(document.getElementById("article-list").innerHTML,
      {'article': article})
      document.getElementById("tplist").innerHTML = html;
    })
  })

  this.$_$('.vue-btn').addEventListener('click', function() {
    $_xhr.get('/cooderi/article/list', res => {
      let getarticle = res.article
      let article = []
      for (let i in getarticle) {
        if (getarticle[i].creategory === 'vue') {
          article.push(getarticle[i])
        }
      }
      let html = template(document.getElementById("article-list").innerHTML,
      {'article': article})
      document.getElementById("tplist").innerHTML = html;
    })
  })
};

/*
 * @Descripttion:
 * @version:
 * @Author: Andy
 * @Date: 2020-04-06 08:27:11
 * @LastEditors: Andy
 * @LastEditTime: 2020-04-07 13:08:04
 */
(function(global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document
      ? factory(global, true)
      : function(w) {
          if (!w.document) {
            throw new Error("xhros requires a window with a document");
          }
          return factory(w);
        };
  } else {
    factory(global);
  }
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
  "use strict";
  const isFunction = function isFunction(obj) {
    return typeof obj === "function" && typeof obj.nodeType !== "number";
  };

  // 封装XMLHttpRequest对象
  const _ajax = function({
    // 定义接口参数
    method = "GET", // 请求方法：get, post, put, delete
    url = "", // 请求连接
    data = null, // post data
    params = null, // get params
    baseURL = "", // domain URL
    withCredentials = false // api验证请求
  } = {}) {
    return new Promise((resolve, reject) => {
      // api URL
      let apiUrl = baseURL + url;
      // create get params
      if (params) {
        let urlParams = [];
        for (let key in params) {
          urlParams.push(`${key}=${params[key]}`);
        }
        apiUrl += `?${urlParams.join("&&")}`;
      }

      // access
      const accessHandler = function() {
        // readState === 4,表示api接口请求完成
        if (this.readyState !== 4) {
          return;
        }
        // 根据status状态码进行相关操作
        if (this.status === 200) {
          let _response = this.response || this.responseText
          if (typeof JSON.parse(this.response) === 'object') {
            resolve(JSON.parse(_response));
          } else {
            resolve(JSON.parse(JSON.stringify(_response)));
          }
        } else {
          reject(new Error(this.statusText));
        }
      };

      // error
      const errorHandler = function() {
        console.error(this.statusText);
      };
      // timeout
      const timeoutHandler = function() {
        console.error(`The request for ${apiUrl} timed out.`);
      };

      // client
      const client = new XMLHttpRequest(); // 生成XMLHttpRequest对象
      client.open(method, apiUrl, true);
      // status
      client.onreadystatechange = accessHandler; // 请求成功
      client.ontimeout = timeoutHandler; // 请求超时
      client.onerror = errorHandler; // 请求错误
      // config
      client.responseType = "json"; // 返回值：json
      client.timeout = 10 * 1000; // 设置超时时间 10s
      client.withCredentials = withCredentials; // 设置验证
      client.setRequestHeader("Accept", "application/json"); // 设置请求头
      // send
      client.send(data); // 发送请求
    });
  };

  const xhros = function() {
    return new xhros.fn.init();
  };

  xhros.fn = xhros.prototype = {
    constructor: xhros,
    // 自定义判断元素类型
    toType: function(obj) {
      return {}.toString
        .call(obj)
        .match(/\s([a-zA-Z]+)/)[1]
        .toLowerCase();
    },
    // 参数过滤器
    filterNull: function(params) {
      for (let key in params) {
        if (params[key] === null) {
          delete params[key];
        }
        if (this.toType(params[key]) === "string") {
          params[key] = params[key].trim();
        } else if (
          this.toType(params[key]) === "object" ||
          this.toType(params[key]) === "array"
        ) {
          params[key] = this.filterNull(params[key]);
        }
      }
      return params;
    },
    root: "",
    // 封装ajax接口
    apiAjax: function(method, url, params, success, failure, withCredentials) {
      if (typeof params === 'function') {
        success = params
        params = undefined
      }
      if (typeof failure === 'boolean') {
        withCredentials = failure
        failure = undefined
      }
      if (params) {
        params = this.filterNull(params);
      }
      let _withCredentials = typeof withCredentials === 'boolean' && withCredentials !== '' ? withCredentials : false
      _ajax({
        method: method,
        url: url,
        data: method === "POST" || method === "PUT" ? params : null,
        params: method === "GET" || method === "DELETE" ? params : null,
        baseURL: this.root,
        withCredentials: _withCredentials
      })
        .then(res => {
          if (success) {
            success(res);
          }
        })
        .catch(err => {
          if (failure) {
            failure(err);
          } else {
            throw err;
          }
        });
    }
  };

  xhros.extend = xhros.fn.extend = function() {
    var options,
      name,
      copy,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
      deep = target;

      // Skip the boolean and the target
      target = arguments[i] || {};
      i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !isFunction(target)) {
      target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if (i === length) {
      target = this;
      i--;
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {
        // Extend the base object
        for (name in options) {
          copy = options[name];
          // Prevent Object.prototype pollution
          // Prevent never-ending loop
          if (name === "__proto__" || target === copy) {
            continue;
          }
          // Recurse if we're merging plain objects or arrays
          if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  };

  const init = (xhros.fn.init = function() {
    return this;
  });
  init.prototype = xhros.fn;

  xhros.extend({
    get: function(url, params, success, failure, withCredentials) {
      return xhros.fn.apiAjax("GET", url, params, success, failure, withCredentials);
    },
    post: function(url, params, success, failure, withCredentials) {
      return xhros.fn.apiAjax("POST", url, params, success, failure, withCredentials);
    },
    put: function(url, params, success, failure, withCredentials) {
      return xhros.fn.apiAjax("PUT", url, params, success, failure, withCredentials);
    },
    delete: function(url, params, success, failure, withCredentials) {
      return xhros.fn.apiAjax("DELETE", url, params, success, failure, withCredentials);
    }
  });

  const $_xhr = xhros;
  if (typeof define === "function" && define.amd()) {
    define("xhros", [], function() {
      return $_xhr;
    });
  }

  if (!noGlobal) {
    window.$_xhr = $_xhr;
  }
  return $_xhr;
});

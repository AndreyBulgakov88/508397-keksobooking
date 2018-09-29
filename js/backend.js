'use strict';

(function () {
  /** @description loads data from server
    * @param {function} onLoad  callback function, triggering when data successfully loads to server
    * @param {function} onError callback function, triggering when an error occured during loading to server
    */
  var load = function (onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка загрузки данных с сервера. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.open('GET', URL);
    xhr.send();
  };

  /** @description sends data to server
    * @param {object} data
    * @param {function} onLoad callback function, triggering when data successfully sends to server
    * @param {function} onError callback function, triggering when an error occured during sending to server
    */
  var save = function (data, onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking';

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad();
      } else {
        onError('Ошибка отправки данных на сервер. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.open('POST', URL);
    xhr.send(data);
  };

  /** @description creates from html template a DOM element that holds error message and adds event listeners to close error window
    * @param {object} errorMessage
    */
  var errorHandler = function (errorMessage) {
    var errorTemplate = document.querySelector('#error').content;
    var errorElement = errorTemplate.cloneNode(true);
    var errorButtonElement = errorElement.querySelector('.error__button');

    errorElement.querySelector('.error__message').textContent = errorMessage;
    document.querySelector('main').appendChild(errorElement);
    errorElement = document.querySelector('.error');

    var documentClickHandler = function (evt) {
      if (evt.target === errorElement) {
        errorElement.remove();
        document.removeEventListener('click', documentClickHandler);
        document.removeEventListener('keydown', documentEscPressHandler);
      }
    };

    var documentEscPressHandler = function (evt) {
      if (window.util.isEscPressed(evt)) {
        errorElement.remove();
        document.removeEventListener('click', documentClickHandler);
        document.removeEventListener('keydown', documentEscPressHandler);
      }
    };

    document.addEventListener('click', documentClickHandler);
    document.addEventListener('keydown', documentEscPressHandler);

    errorButtonElement.addEventListener('click', function () {
      errorElement.remove();
    });

    window.filters.setFiltersAccessibility(true);
  };


  window.backend = {
    load: load,
    save: save,
    errorHandler: errorHandler
  };
})();

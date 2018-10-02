'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  /** @description returns a random array of the definite length from initial array items.
    * @param {array} initialArray
    *  @param {number} valuesCount the result array length.
    * @return {array}
    */
  var getRandomValuesFromArray = function (initialArray, valuesCount) {
    var resultArray = shuffleArray(initialArray);

    return resultArray.slice(0, valuesCount);
  };

  /** @description returns a random array of the same length from initial array items.
    * @param {array} initialArray
    * @return {array}
    */
  var shuffleArray = function (initialArray) {
    var resultArray = initialArray.slice();
    for (var i = 0; i < resultArray.length; i++) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = resultArray[i];
      resultArray[i] = resultArray[j];
      resultArray[j] = tmp;
    }

    return resultArray;
  };

  /** @description returns a document fragment with child nodes rendered from the array using the callback function
    * @param {array} array
    * @param {function} callback
    * @return {array}
    */
  var renderArrayToChildNodes = function (array, callback) {
    var fragment = document.createDocumentFragment();
    array.forEach(function (element, index) {
      fragment.appendChild(callback(element, index));
    });

    return fragment;
  };

  /** @description removes all child nodes from the parent node
    * @param {Node} parentNodeElement
    */
  var removeChildNodes = function (parentNodeElement) {
    while (parentNodeElement.lastChild) {
      parentNodeElement.removeChild(parentNodeElement.lastChild);
    }
  };

  /** @description common debounce function
    * @param {Function} callback
    * @param {Number} debounceInterval
    * @return {Function}
    */
  var debounce = function (callback, debounceInterval) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        callback.apply(null, args);
      }, debounceInterval);
    };
  };

  window.util = {
    getRandomValuesFromArray: getRandomValuesFromArray,
    renderArrayToChildNodes: renderArrayToChildNodes,
    removeChildNodes: removeChildNodes,
    isEnterPressed: function (evt) {
      return evt.keyCode === ENTER_KEYCODE;
    },
    isEscPressed: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    },
    debounce: debounce
  };
})();

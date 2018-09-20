'use strict';

(function () {
  // functions for working with numbers and arrays

  /** @description returns a random value from the range.
    * @param {number} minValue the minimum value of the range.
    * @param {number} maxValue the maximum value of the range.
    * @return {number}
    */
  var getRandomNumber = function (minValue, maxValue) {
    return Math.floor((maxValue + 1 - minValue) * Math.random() + minValue);
  };

  /** @description returns a random item from the arbitrary array.
    * @param {array} array
    * @return {any}
    */
  var getRandomItemFromArray = function (array) {
    return array[getRandomNumber(0, array.length - 1)];
  };

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
  function shuffleArray(initialArray) {
    var resultArray = initialArray.slice();
    for (var i = 0; i < resultArray.length; i++) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = resultArray[i];
      resultArray[i] = resultArray[j];
      resultArray[j] = tmp;
    }

    return resultArray;
  }


  // functions for working with child nodes

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
    * @param {Node} parentNode
    */
  var removeChildNodes = function (parentNode) {
    while (parentNode.lastChild) {
      parentNode.removeChild(parentNode.lastChild);
    }
  };


  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomItemFromArray: getRandomItemFromArray,
    getRandomValuesFromArray: getRandomValuesFromArray,
    shuffleArray: shuffleArray,
    renderArrayToChildNodes: renderArrayToChildNodes,
    removeChildNodes: removeChildNodes
  };
})();

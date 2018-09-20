'use strict';

(function () {
  var roomNumberSelect = document.querySelector('#room_number');
  var capacitySelect = document.querySelector('#capacity');
  var typeSelect = document.querySelector('#type');
  var priceInput = document.querySelector('#price');

  /** @description a common function for synchronizing any two of form controls using the callback function
    * @param {Node} firstControl
    * @param {Node} secondControl
    * @param {any} firstOptions first control options
    * @param {any} secondOptions second control options
    * @param {string} eventType event type for listeners
    * @param {Function} callback
    */
  var syncFormControls = function (firstControl, secondControl, firstOptions, secondOptions, eventType, callback) {
    firstControl.addEventListener(eventType, function (evt) {
      callback(secondControl, secondOptions[firstOptions.indexOf(evt.target.value)]);
    });
  };

  /** @description a callback function for synchronizing values of any two form controls
    * @param {Node} formControl synchronized form control
    * @param {any} value value from other form control to synchronize given form control
    */
  var syncFormControlValues = function (formControl, value) {
    formControl.value = value;
  };

  /** @description a callback function for synchronizing mins and placeholders attributes of any twoform controls
    * @param {Node} formControl synchronized form control
    * @param {any} value value from other form control to synchronize given form control
    */
  var syncFormControlMinsPlaceholders = function (formControl, value) {
    formControl.min = value;
    formControl.placeholder = value;
  };

  /** @description the hotel type form control synchronizes with the min.price in the price form control
    */
  var setPriceFormControlCustomValidity = function () {
    if (priceInput.validity.rangeUnderflow) {
      priceInput.setCustomValidity('Для типа жилья ' + window.data.HOTEL_TYPES_DICTIONARY[typeSelect.value] + ' минимальная цена ' + window.data.HOTEL_TYPES_MIN_PRICE[window.data.HOTEL_TYPES.indexOf(typeSelect.value)]);
    } else if (priceInput.validity.rangeOverflow) {
      priceInput.setCustomValidity('Максимально возможная цена 1 000 000');
    } else {
      priceInput.setCustomValidity('');
    }
  };

  /** @description available capacity form control options synchronizes with the room number form control
    */
  var setCapacityFormControlCustomValidity = function () {
    var capacity = window.data.HOTEL_ROOM_NUMBER_CAPACITY[roomNumberSelect.value];
    if (capacity.indexOf(capacitySelect.value) === -1) {
      capacitySelect.setCustomValidity('Доступно только ' + window.data.HOTEL_ROOM_NUMBER_CAPACITY_DICTIONARY[roomNumberSelect.value]);
    } else {
      capacitySelect.setCustomValidity('');
    }
  };

  /** @description restricting input for advertisement form fields
    */
  var setupAdvertisementFormInputRestrictions = function () {
    // synchronizing timein and timeout form controls
    var timeinSelect = document.querySelector('#timein');
    var timeoutSelect = document.querySelector('#timeout');

    syncFormControls(timeinSelect, timeoutSelect, window.data.CHECKIN_TIMES, window.data.CHECKOUT_TIMES, 'change', syncFormControlValues);
    syncFormControls(timeoutSelect, timeinSelect, window.data.CHECKIN_TIMES, window.data.CHECKOUT_TIMES, 'change', syncFormControlValues);

    // synchronizing hotel type and price form controls
    syncFormControls(typeSelect, priceInput, window.data.HOTEL_TYPES, window.data.HOTEL_TYPES_MIN_PRICE, 'change', syncFormControlMinsPlaceholders);

    priceInput.addEventListener('change', function () {
      setPriceFormControlCustomValidity();
    });

    typeSelect.addEventListener('change', function () {
      setPriceFormControlCustomValidity();
    });

    // synchronizing room number and capacity form controls
    roomNumberSelect.addEventListener('change', function () {
      setCapacityFormControlCustomValidity();
    });

    capacitySelect.addEventListener('change', function () {
      setCapacityFormControlCustomValidity();
    });
  };

  window.form = {
    setupAdvertisementFormInputRestrictions: setupAdvertisementFormInputRestrictions
  };
})();

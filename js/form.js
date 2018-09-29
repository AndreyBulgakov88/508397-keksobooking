'use strict';

(function () {
  var HOTEL_TYPES = ['bungalo', 'flat', 'house', 'palace'];
  var HOTEL_TYPES_MIN_PRICE = ['0', '1000', '5000', '10000'];
  var HOTEL_TYPES_DICTIONARY = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'house': 'Дом',
    'palace': 'Дворец'};

  var HOTEL_ROOM_NUMBER_CAPACITY = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']};
  var HOTEL_ROOM_NUMBER_CAPACITY_DICTIONARY = {
    '1': ['для одного гостя'],
    '2': ['для одного гостя', ' для двух гостей'],
    '3': ['для одного гостя', ' для двух гостей', ' для трех гостей'],
    '100': ['не для гостей']};

  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];

  var PIN_MAIN_INITIAL_POSITION_LEFT = 570;
  var PIN_MAIN_INITIAL_POSITION_TOP = 375;

  var advertisementForm = document.querySelector('.ad-form');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapSection = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');

  var roomNumberSelect = document.querySelector('#room_number');
  var capacitySelect = document.querySelector('#capacity');
  var typeSelect = document.querySelector('#type');
  var priceInput = document.querySelector('#price');

  var disabledFormsElements = document.querySelectorAll('[disabled]');

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
      priceInput.setCustomValidity('Для типа жилья ' + HOTEL_TYPES_DICTIONARY[typeSelect.value] + ' минимальная цена ' + HOTEL_TYPES_MIN_PRICE[HOTEL_TYPES.indexOf(typeSelect.value)]);
    } else if (priceInput.validity.rangeOverflow) {
      priceInput.setCustomValidity('Максимально возможная цена 1 000 000');
    } else {
      priceInput.setCustomValidity('');
    }
  };

  /** @description available capacity form control options synchronizes with the room number form control
    */
  var setCapacityFormControlCustomValidity = function () {
    var capacity = HOTEL_ROOM_NUMBER_CAPACITY[roomNumberSelect.value];
    if (capacity.indexOf(capacitySelect.value) === -1) {
      capacitySelect.setCustomValidity('Доступно только ' + HOTEL_ROOM_NUMBER_CAPACITY_DICTIONARY[roomNumberSelect.value]);
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

    syncFormControls(timeinSelect, timeoutSelect, CHECKIN_TIMES, CHECKOUT_TIMES, 'change', syncFormControlValues);
    syncFormControls(timeoutSelect, timeinSelect, CHECKIN_TIMES, CHECKOUT_TIMES, 'change', syncFormControlValues);

    // synchronizing hotel type and price form controls
    syncFormControls(typeSelect, priceInput, HOTEL_TYPES, HOTEL_TYPES_MIN_PRICE, 'change', syncFormControlMinsPlaceholders);

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


  /** @description handler for submitting advertisement form
    * @param {event} evt
    */
  var advertisementFormSubmitHandler = function (evt) {
    evt.preventDefault();

    window.backend.save(new FormData(advertisementForm), successFormSendHandler, window.backend.errorHandler);
  };

  /** @description handler for resetting advertisement form
    * @param {event} evt
    */
  var advertisementFormResetHandler = function () {
    resetPage();

    advertisementForm.removeEventListener('submit', advertisementFormSubmitHandler);
    advertisementForm.removeEventListener('reset', advertisementFormResetHandler);
  };

  /** @description fades map and forms
    */
  var fadePage = function () {
    mapSection.classList.add('map--faded');
    advertisementForm.classList.add('ad-form--disabled');
  };

  /** @description resets all forms to initial state
    */
  var resetForms = function () {
    mapFiltersForm.reset();
    advertisementForm.reset();

    disabledFormsElements.forEach(function (element) {
      element.disabled = true;
    });
  };

  /** @description resets main pin initial state
    */
  var resetMainPin = function () {
    mapPinMain.style.left = PIN_MAIN_INITIAL_POSITION_LEFT + 'px';
    mapPinMain.style.top = PIN_MAIN_INITIAL_POSITION_TOP + 'px';

    window.map.getPinMainLocation();
  };

  /** @description resets page to initial state
    */
  var resetPage = function () {
    window.map.resetMap();
    resetForms();
    resetMainPin();
    fadePage();
  };


  /** @description handler for successful sending form to server, showing success message and resetting page
    */
  var successFormSendHandler = function () {
    var successTemplate = document.querySelector('#success');
    var successElement = successTemplate.content.cloneNode(true);
    var mainSectionElement = document.querySelector('main');

    mainSectionElement.appendChild(successElement);
    successElement = document.querySelector('.success');

    var documentClickHandler = function (evtSuccess) {
      if (evtSuccess.target === successElement) {
        successElement.remove();
        document.removeEventListener('click', documentClickHandler);
        document.removeEventListener('keydown', documentEscPressHandler);
      }
    };

    var documentEscPressHandler = function (evtSuccess) {
      if (window.util.isEscPressed(evtSuccess)) {
        successElement.remove();
        document.removeEventListener('click', documentClickHandler);
        document.removeEventListener('keydown', documentEscPressHandler);
      }
    };

    document.addEventListener('click', documentClickHandler);
    document.addEventListener('keydown', documentEscPressHandler);

    advertisementForm.removeEventListener('submit', advertisementFormSubmitHandler);
    advertisementForm.removeEventListener('reset', advertisementFormResetHandler);

    resetPage();
  };


  window.form = {
    HOTEL_TYPES: HOTEL_TYPES,
    HOTEL_TYPES_DICTIONARY: HOTEL_TYPES_DICTIONARY,
    CHECKIN_TIMES: CHECKIN_TIMES,
    CHECKOUT_TIMES: CHECKOUT_TIMES,
    disabledFormsElements: disabledFormsElements,
    setupAdvertisementFormInputRestrictions: setupAdvertisementFormInputRestrictions,
    advertisementFormSubmitHandler: advertisementFormSubmitHandler,
    advertisementFormResetHandler: advertisementFormResetHandler,
  };
})();

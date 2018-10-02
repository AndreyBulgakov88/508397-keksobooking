'use strict';

(function () {
  var HOTEL_TYPES = ['bungalo', 'flat', 'house', 'palace'];
  var HOTEL_TYPES_MIN_PRICES = ['0', '1000', '5000', '10000'];

  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];

  var PIN_MAIN_INITIAL_POSITION_LEFT = 570;
  var PIN_MAIN_INITIAL_POSITION_TOP = 375;

  var HotelTypesDictionary = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'house': 'Дом',
    'palace': 'Дворец'};

  var HotelRoomNumberCapacity = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']};

  var HotelRoomNumberCapacityDictionary = {
    '1': ['для одного гостя'],
    '2': ['для одного гостя', ' для двух гостей'],
    '3': ['для одного гостя', ' для двух гостей', ' для трех гостей'],
    '100': ['не для гостей']};

  var mainSectionElement = document.querySelector('main');
  var advertisementFormElement = document.querySelector('.ad-form');
  var resetButtonElement = document.querySelector('.ad-form__reset');
  var mapFiltersFormElement = document.querySelector('.map__filters');
  var mapSectionElement = document.querySelector('.map');
  var mapPinMainElement = document.querySelector('.map__pin--main');

  var roomNumberSelectElement = document.querySelector('#room_number');
  var capacitySelectElement = document.querySelector('#capacity');
  var typeSelectElement = document.querySelector('#type');
  var priceInputElement = document.querySelector('#price');
  var timeinSelect = document.querySelector('#timein');
  var timeoutSelect = document.querySelector('#timeout');

  var disabledFormsElements = document.querySelectorAll('[disabled]');

  var successTemplate = document.querySelector('#success');

  /** @description a common function for synchronizing any two of form controls using the callback function
    * @param {Node} firstControlElement
    * @param {Node} secondControlElement
    * @param {any} firstOptions first control options
    * @param {any} secondOptions second control options
    * @param {string} eventType event type for listeners
    * @param {Function} callback
    */
  var syncFormControls = function (firstControlElement, secondControlElement, firstOptions, secondOptions, eventType, callback) {
    firstControlElement.addEventListener(eventType, function (evt) {
      callback(secondControlElement, secondOptions[firstOptions.indexOf(evt.target.value)]);
    });
  };

  /** @description a callback function for synchronizing values of any two form controls
    * @param {Node} formControlElement synchronized form control
    * @param {any} value value from other form control to synchronize given form control
    */
  var syncFormControlValues = function (formControlElement, value) {
    formControlElement.value = value;
  };

  /** @description a callback function for synchronizing mins and placeholders attributes of any twoform controls
    * @param {Node} formControlElement synchronized form control
    * @param {any} value value from other form control to synchronize given form control
    */
  var syncFormControlMinsPlaceholders = function (formControlElement, value) {
    formControlElement.min = value;
    formControlElement.placeholder = value;
  };

  /** @description the hotel type form control synchronizes with the min.price in the price form control
    */
  var setPriceFormControlCustomValidity = function () {
    if (priceInputElement.validity.rangeUnderflow) {
      priceInputElement.setCustomValidity('Для типа жилья ' + HotelTypesDictionary[typeSelectElement.value] + ' минимальная цена ' + HOTEL_TYPES_MIN_PRICES[HOTEL_TYPES.indexOf(typeSelectElement.value)]);
    } else if (priceInputElement.validity.rangeOverflow) {
      priceInputElement.setCustomValidity('Максимально возможная цена 1 000 000');
    } else {
      priceInputElement.setCustomValidity('');
    }
  };

  /** @description available capacity form control options synchronizes with the room number form control
    */
  var setCapacityFormControlCustomValidity = function () {
    var capacity = HotelRoomNumberCapacity[roomNumberSelectElement.value];
    if (capacity.indexOf(capacitySelectElement.value) === -1) {
      capacitySelectElement.setCustomValidity('Доступно только ' + HotelRoomNumberCapacityDictionary[roomNumberSelectElement.value]);
    } else {
      capacitySelectElement.setCustomValidity('');
    }
  };

  /** @description restricting input for advertisement form fields
    */
  var setupAdvertisementFormInputRestrictions = function () {
    // synchronizing timein and timeout form controls
    syncFormControls(timeinSelect, timeoutSelect, CHECKIN_TIMES, CHECKOUT_TIMES, 'change', syncFormControlValues);
    syncFormControls(timeoutSelect, timeinSelect, CHECKIN_TIMES, CHECKOUT_TIMES, 'change', syncFormControlValues);

    // synchronizing hotel type and price form controls
    syncFormControls(typeSelectElement, priceInputElement, HOTEL_TYPES, HOTEL_TYPES_MIN_PRICES, 'change', syncFormControlMinsPlaceholders);

    priceInputElement.addEventListener('change', function () {
      setPriceFormControlCustomValidity();
    });

    typeSelectElement.addEventListener('change', function () {
      setPriceFormControlCustomValidity();
    });

    // synchronizing room number and capacity form controls
    roomNumberSelectElement.addEventListener('change', function () {
      setCapacityFormControlCustomValidity();
    });

    capacitySelectElement.addEventListener('change', function () {
      setCapacityFormControlCustomValidity();
    });
  };


  /** @description handler for submitting advertisement form
    * @param {event} evt
    */
  var advertisementFormSubmitHandler = function (evt) {
    evt.preventDefault();

    window.backend.save(new FormData(advertisementFormElement), successFormSendHandler, window.backend.errorHandler);
  };

  /** @description handler for resetting advertisement form
    * @param {event} evt
    */
  var advertisementFormResetHandler = function () {
    advertisementFormElement.removeEventListener('submit', advertisementFormSubmitHandler);
    resetButtonElement.removeEventListener('click', advertisementFormResetHandler);

    resetPage();
  };

  /** @description fades map and forms
    */
  var fadePage = function () {
    mapSectionElement.classList.add('map--faded');
    advertisementFormElement.classList.add('ad-form--disabled');
  };

  /** @description resets all forms to initial state
    */
  var resetForms = function () {
    mapFiltersFormElement.reset();
    advertisementFormElement.reset();

    syncFormControlMinsPlaceholders(priceInputElement, HOTEL_TYPES_MIN_PRICES[HOTEL_TYPES.indexOf(typeSelectElement.value)]);

    disabledFormsElements.forEach(function (element) {
      element.disabled = true;
    });
  };

  /** @description resets main pin initial state
    */
  var resetMainPin = function () {
    mapPinMainElement.style.left = PIN_MAIN_INITIAL_POSITION_LEFT + 'px';
    mapPinMainElement.style.top = PIN_MAIN_INITIAL_POSITION_TOP + 'px';

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
    var successElement = successTemplate.content.cloneNode(true);

    mainSectionElement.appendChild(successElement);
    successElement = document.querySelector('.success');

    var documentClickHandler = function () {
      successElement.remove();
      document.removeEventListener('click', documentClickHandler);
      document.removeEventListener('keydown', documentEscPressHandler);
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

    advertisementFormElement.removeEventListener('submit', advertisementFormSubmitHandler);
    resetButtonElement.removeEventListener('click', advertisementFormResetHandler);

    resetPage();
  };


  window.form = {
    HOTEL_TYPES: HOTEL_TYPES,
    HotelTypesDictionary: HotelTypesDictionary,
    CHECKIN_TIMES: CHECKIN_TIMES,
    CHECKOUT_TIMES: CHECKOUT_TIMES,
    disabledFormsElements: disabledFormsElements,
    setupAdvertisementFormInputRestrictions: setupAdvertisementFormInputRestrictions,
    advertisementFormSubmitHandler: advertisementFormSubmitHandler,
    advertisementFormResetHandler: advertisementFormResetHandler,
  };
})();

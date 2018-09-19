'use strict';

var HOTEL_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'];
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
var HOTEL_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var HOTEL_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
var ADVERTISEMENTS_COUNT = 8;

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var PIN_STARTING_COORD_X = 0;
var PIN_ENDING_COORD_X = 1200;
var PIN_STARTING_COORD_Y = 130;
var PIN_ENDING_COORD_Y = 630;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var PIN_MAIN_WIDTH = 62;
var PIN_MAIN_HEIGHT = 62;
var PIN_MAIN_ARROW_HEIGHT = 22;

var mapSection = document.querySelector('.map');
var mapPinMain = document.querySelector('.map__pin--main');

var addressInput = document.querySelector('#address');
var roomNumberSelect = document.querySelector('#room_number');
var capacitySelect = document.querySelector('#capacity');
var typeSelect = document.querySelector('#type');
var priceInput = document.querySelector('#price');
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


// functions for creating advertisements

/** @description creates an autor object for the advertisement.
  * @param {number} advertisementId
  * @return {object}
  */
var createAdvertisementAutor = function (advertisementId) {
  var author = {};
  author.avatar = 'img/avatars/user0' + advertisementId + '.png';

  return author;
};

/** @description creates a location object for the advertisement.
  * @return {object}
  */
var createAdvertisementLocation = function () {
  var location = {};
  location.x = getRandomNumber(PIN_STARTING_COORD_X, PIN_ENDING_COORD_X);
  location.y = getRandomNumber(PIN_STARTING_COORD_Y, PIN_ENDING_COORD_Y);

  return location;
};

/** @description creates features array for advertisement offer.
  * @return {array}
  */
var createHotelFeatures = function () {
  var featuresCount = getRandomNumber(0, HOTEL_FEATURES.length);
  var features = getRandomValuesFromArray(HOTEL_FEATURES, featuresCount);

  return features;
};

/** @description creates an offer object for the advertisement.
  * @param {number} advertisementId
  * @param {object} advertisementLocation the location object of the advertisement.
  * @return {object}
  */
var createAdvertisementOffer = function (advertisementId, advertisementLocation) {
  var offer = {};

  offer.title = HOTEL_TITLES[advertisementId];
  offer.address = advertisementLocation.x + ', ' + advertisementLocation.y;
  offer.price = getRandomNumber(1000, 1000000);
  offer.type = getRandomItemFromArray(HOTEL_TYPES);
  offer.rooms = getRandomNumber(1, 5);
  offer.guests = getRandomNumber(1, 15);
  offer.checkin = getRandomItemFromArray(CHECKIN_TIMES);
  offer.checkout = getRandomItemFromArray(CHECKOUT_TIMES);
  offer.features = createHotelFeatures();
  offer.description = '';
  offer.photos = shuffleArray(HOTEL_PHOTOS);

  return offer;
};

/** @description creates an array of advertisement objects
  * @return {array}
  */
var createAdvertisements = function () {
  var advertisementsArray = [];

  for (var i = 0; i < ADVERTISEMENTS_COUNT; i++) {
    var advertisement = {};
    advertisement.author = createAdvertisementAutor(i + 1);
    advertisement.location = createAdvertisementLocation();
    advertisement.offer = createAdvertisementOffer(i + 1, advertisement.location);

    advertisementsArray.push(advertisement);
  }

  return advertisementsArray;
};


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


// functions for rendering elements

/** @description returns a pin node rendered from the advertisement
  * @param {object} advertisement
  * @param {number} advertisementId
  * @return {Node}
  */
var renderPin = function (advertisement, advertisementId) {
  var pinTemplate = document.querySelector('#pin').content;
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.querySelector('.map__pin').style.left = advertisement.location.x - PIN_WIDTH / 2 + 'px';
  pinElement.querySelector('.map__pin').style.top = advertisement.location.y - PIN_HEIGHT + 'px';
  pinElement.querySelector('.map__pin').children[0].src = advertisement.author.avatar;
  pinElement.querySelector('.map__pin').children[0].alt = advertisement.offer.title;
  pinElement.querySelector('.map__pin').setAttribute('data-id', advertisementId);

  return pinElement;
};

/** @description creates and returns a single offer feature DOMElement
  * @param {string} featureName
  * @return {Node}
  */
var makeFeatureElement = function (featureName) {
  var featureElement = document.createElement('li');
  featureElement.classList.add('popup__feature');
  featureElement.classList.add('popup__feature--' + featureName);

  return featureElement;
};

/** @description creates and returns a single offer photo DOMElement
  * @param {string} photoPath
  * @return {Node}
  */
var makePhotoElement = function (photoPath) {
  var photoElement = document.createElement('img');
  photoElement.classList.add('popup__photo');
  photoElement.width = 45;
  photoElement.height = 40;
  photoElement.src = photoPath;
  photoElement.alt = 'Фотография жилья';

  return photoElement;
};

/** @description creates an empty offer card DOMElement
  */
var makeEmptyCardElement = function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);
  mapSection.insertBefore(cardElement, document.querySelector('.map__filters-container'));
  cardElement.classList.add('hidden');
};

/** @description rendering the advertisement into the offer card DOMElement
  * @param {object} advertisement
  * @return {Node}
  */
var renderCard = function (advertisement) {
  var cardElement = document.querySelector('.map__card');
  cardElement.querySelector('.popup__avatar').src = advertisement.author.avatar;
  cardElement.querySelector('.popup__title').textContent = advertisement.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = advertisement.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = HOTEL_TYPES_DICTIONARY[advertisement.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = advertisement.offer.rooms + ' комнаты для ' + advertisement.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;

  var featuresElement = cardElement.querySelector('.popup__features');
  removeChildNodes(featuresElement);
  featuresElement.appendChild(renderArrayToChildNodes(advertisement.offer.features, makeFeatureElement));

  cardElement.querySelector('.popup__description').textContent = advertisement.offer.description;

  var photosElement = cardElement.querySelector('.popup__photos');
  removeChildNodes(photosElement);
  photosElement.appendChild(renderArrayToChildNodes(advertisement.offer.photos, makePhotoElement));

  return cardElement;
};


// functions for working with the advertisement popup

/** @description returns a data-id attribute from pin DOM element
  * @param {Node} element the pin DOM element.
  * @return {number}
  */
var getAdvertisementId = function (element) {
  if (!element.classList.contains('map__pin')) {
    return element.parentNode.getAttribute('data-id');
  } else {
    return element.getAttribute('data-id');
  }
};

/** @description returns a data-id attribute from pin DOM element
  * @param {object} advertisement
  */
var openAdvertisementPopup = function (advertisement) {
  var cardElement = renderCard(advertisement);
  cardElement.classList.remove('hidden');
};


// setup functions

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

/** @description creating advertisements and adding listeners to advertisements
  */
var configureAdvertisements = function () {
  var mapPins = document.querySelector('.map__pins');

  var advertisementsArray = createAdvertisements();
  mapPins.appendChild(renderArrayToChildNodes(advertisementsArray, renderPin));

  mapPins.addEventListener('click', function (evt) {
    var advertisementId = getAdvertisementId(evt.target);
    if (!advertisementId) {
      return;
    }

    openAdvertisementPopup(advertisementsArray[advertisementId]);

    addPopupCloseListeners();
  });
};


// popup handlers

/** @description a handler for the escape-pressing event when the popup window is open
  * @param {Event} evt
  */
var popupEscPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

/** @description closing the popup and removes the escape-pressing listener from the document
  */
var closePopup = function () {
  var cardElement = document.querySelector('.map__card');
  cardElement.classList.add('hidden');
  document.removeEventListener('keydown', popupEscPressHandler);
};

/** @description adding keydown and click listeners when the popup window is open
  */
var addPopupCloseListeners = function () {
  document.addEventListener('keydown', popupEscPressHandler);

  var popupClose = document.querySelector('.popup__close');
  popupClose.addEventListener('click', function () {
    closePopup();
  });

  popupClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closePopup();
    }
  });
};


// page activation

/** @description the page activation function
  */
var activatePage = function () {
  var advertisementForm = document.querySelector('.ad-form');

  mapSection.classList.remove('map--faded');
  advertisementForm.classList.remove('ad-form--disabled');

  var disabledElements = document.querySelectorAll('[disabled]');
  disabledElements.forEach(function (element) {
    element.disabled = false;
  });

  configureAdvertisements();

  setupAdvertisementFormInputRestrictions();
};


// getting a main pin location

/** @description getting a main pin location and putting it into the address input
  * @param {boolean} arrowActive the indicator of main pin arrow activity.
  */
var getPinMainLocation = function (arrowActive) {
  var locationX = parseInt(mapPinMain.style.left, 10) + PIN_MAIN_WIDTH / 2;
  var locationY = parseInt(mapPinMain.style.top, 10) + PIN_MAIN_HEIGHT / 2;

  if (arrowActive) {
    locationY = locationY + PIN_MAIN_HEIGHT / 2 + PIN_MAIN_ARROW_HEIGHT;
  }

  addressInput.value = locationX + ', ' + locationY;
};


// initial settings
getPinMainLocation();
makeEmptyCardElement();


// adding drag n drop mechanism to main pin
mapPinMain.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var documentMouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();

    if (mapSection.classList.contains('map--faded')) {
      activatePage();
    }

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var mapPinMainCoordX = mapPinMain.offsetLeft - shift.x;
    var mapPinMainCoordY = mapPinMain.offsetTop - shift.y;

    mapPinMainCoordX = Math.max(PIN_STARTING_COORD_X - PIN_MAIN_WIDTH / 2, mapPinMainCoordX);
    mapPinMainCoordX = Math.min(PIN_ENDING_COORD_X - PIN_MAIN_WIDTH / 2, mapPinMainCoordX);
    mapPinMainCoordY = Math.max(PIN_STARTING_COORD_Y - (PIN_MAIN_HEIGHT + PIN_MAIN_ARROW_HEIGHT), mapPinMainCoordY);
    mapPinMainCoordY = Math.min(PIN_ENDING_COORD_Y - (PIN_MAIN_HEIGHT + PIN_MAIN_ARROW_HEIGHT), mapPinMainCoordY);

    mapPinMain.style.top = mapPinMainCoordY + 'px';
    mapPinMain.style.left = mapPinMainCoordX + 'px';

    getPinMainLocation(true);
  };

  var documentMouseUpHandler = function (upEvt) {
    upEvt.preventDefault();

    if (mapSection.classList.contains('map--faded')) {
      activatePage();
      getPinMainLocation(true);
    }

    document.removeEventListener('mousemove', documentMouseMoveHandler);
    document.removeEventListener('mouseup', documentMouseUpHandler);
  };

  document.addEventListener('mousemove', documentMouseMoveHandler);
  document.addEventListener('mouseup', documentMouseUpHandler);
});

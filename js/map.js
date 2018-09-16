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
var HOTEL_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var HOTEL_TYPES_DICTIONARY = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'};
var HOTEL_TYPES_MIN_PRICE = {
  'bungalo': '0',
  'flat': '1000',
  'house': '5000',
  'palace': '10000'};
var HOTEL_ROOM_NUMBER_CAPACITY = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']};
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

var MAP_WIDTH = 1200;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var PIN_MAIN_WIDTH = 62;
var PIN_MAIN_HEIGHT = 62;
var PIN_MAIN_ARROW_HEIGHT = 22;

var mapSection = document.querySelector('.map');
var mapPinMain = document.querySelector('.map__pin--main');


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
  location.x = getRandomNumber(0, MAP_WIDTH);
  location.y = getRandomNumber(130, 630);

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

/** @description links hotel type and price form fields for restrict a price range
  */
var linkHotelTypeAndPriceFormFields = function () {
  var typeSelect = document.querySelector('#type');
  var priceInput = document.querySelector('#price');

  typeSelect.addEventListener('change', function () {
    var minPrice = HOTEL_TYPES_MIN_PRICE[typeSelect.value];
    priceInput.placeholder = minPrice;
    priceInput.min = minPrice;
  });

  priceInput.addEventListener('invalid', function () {
    if (priceInput.validity.rangeUnderflow) {
      priceInput.setCustomValidity('Для типа жилья ' + HOTEL_TYPES_DICTIONARY[typeSelect.value] + ' минимальная цена ' + HOTEL_TYPES_MIN_PRICE[typeSelect.value]);
    } else if (priceInput.validity.rangeOverflow) {
      priceInput.setCustomValidity('Максимально возможная цена 1 000 000');
    } else {
      priceInput.setCustomValidity('');
    }
  });
};

/** @description timein and timeout form fields synchronizes if the user changes any of them
  */
var synchronizeCheckinAndCheckoutFormFields = function () {
  var timeinSelect = document.querySelector('#timein');
  var timeoutSelect = document.querySelector('#timeout');

  timeinSelect.addEventListener('change', function () {
    timeoutSelect.value = timeinSelect.value;
  });

  timeoutSelect.addEventListener('change', function () {
    timeinSelect.value = timeoutSelect.value;
  });
};

/** @description available capacity form field options synchronizes with the room number form field
  */
var synchronizeRoomNumberAndCapacityFormFields = function () {
  var roomNumberSelect = document.querySelector('#room_number');
  var capacitySelect = document.querySelector('#capacity');

  roomNumberSelect.addEventListener('change', function () {
    var capacity = HOTEL_ROOM_NUMBER_CAPACITY[roomNumberSelect.value];

    for (var i = 0; i < capacitySelect.options.length; i++) {
      capacitySelect.options[i].disabled = false;

      if (capacity.indexOf(capacitySelect.options[i].value) === -1) {
        capacitySelect.options[i].disabled = true;
      }
    }

    if (capacity.indexOf(capacitySelect.value) === -1) {
      capacitySelect.value = null;
    }
  });
};

/** @description restricting input for advertisement form fields
  */
var setupAdvertisementFormInputRestrictions = function () {
  linkHotelTypeAndPriceFormFields();
  synchronizeCheckinAndCheckoutFormFields();
  synchronizeRoomNumberAndCapacityFormFields();
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


// page activation handler

/** @description a handler for page activation by clicking on main pin
  */
var mapPinMainMouseUpHandler = function () {
  var advertisementForm = document.querySelector('.ad-form');

  mapSection.classList.remove('map--faded');
  advertisementForm.classList.remove('ad-form--disabled');

  var disabledElements = document.querySelectorAll('[disabled]:not(option)');
  disabledElements.forEach(function (element) {
    element.disabled = false;
  });

  configureAdvertisements();

  setupAdvertisementFormInputRestrictions();

  getPinMainLocation(true);

  mapPinMain.removeEventListener('mouseup', mapPinMainMouseUpHandler);
};


// getting a main pin location

/** @description getting a main pin location and putting it into the address input
  * @param {boolean} arrowActive the indicator of main pin arrow activity.
  */
var getPinMainLocation = function (arrowActive) {
  var addressInput = document.querySelector('#address');

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
mapPinMain.addEventListener('mouseup', mapPinMainMouseUpHandler);

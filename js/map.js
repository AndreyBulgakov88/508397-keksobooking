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
var mapPins = document.querySelector('.map__pins');
var mapPinMain = document.querySelector('.map__pin--main');

var advertisementForm = document.querySelector('.ad-form');
var addressInput = document.querySelector('input[name=address]');

var pinTemplate = document.querySelector('#pin').content;
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');


// functions for working with numbers and arrays
var getRandomNumber = function (minValue, maxValue) {
  return Math.floor((maxValue + 1 - minValue) * Math.random() + minValue);
};

var getRandomItemFromArray = function (array) {
  return array[getRandomNumber(0, array.length - 1)];
};

var getRandomValuesFromArray = function (initialArray, valuesCount) {
  var resultArray = shuffleArray(initialArray);

  return resultArray.slice(0, valuesCount);
};

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


// functions for generating advertisements
var generateAdvertisementAutor = function (advertisementNumber) {
  var author = {};
  author.avatar = 'img/avatars/user0' + advertisementNumber + '.png';

  return author;
};

var generateAdvertisementLocation = function () {
  var location = {};
  location.x = getRandomNumber(0, MAP_WIDTH);
  location.y = getRandomNumber(130, 630);

  return location;
};

var generateAdvertisementOffer = function (advertisementNumber, advertisementLocation) {
  var offer = {};

  offer.title = HOTEL_TITLES[advertisementNumber];
  offer.address = advertisementLocation.x + ', ' + advertisementLocation.y;
  offer.price = getRandomNumber(1000, 1000000);
  offer.type = getRandomItemFromArray(HOTEL_TYPES);
  offer.rooms = getRandomNumber(1, 5);
  offer.guests = getRandomNumber(1, 15);
  offer.checkin = getRandomItemFromArray(CHECKIN_TIMES);
  offer.checkout = getRandomItemFromArray(CHECKOUT_TIMES);
  offer.features = generateHotelFeatures();
  offer.description = '';
  offer.photos = shuffleArray(HOTEL_PHOTOS);

  return offer;
};

var generateHotelFeatures = function () {
  var featuresCount = getRandomNumber(0, HOTEL_FEATURES.length);
  var features = getRandomValuesFromArray(HOTEL_FEATURES, featuresCount);

  return features;
};

var generateAdvertisements = function () {
  var advertisementsArray = [];

  for (var i = 0; i < ADVERTISEMENTS_COUNT; i++) {
    var advertisement = {};
    advertisement.author = generateAdvertisementAutor(i + 1);
    advertisement.location = generateAdvertisementLocation();
    advertisement.offer = generateAdvertisementOffer(i + 1, advertisement.location);

    advertisementsArray.push(advertisement);
  }

  return advertisementsArray;
};


// functions for working with child nodes
var renderArrayToChildNodes = function (array, callback) {
  var fragment = document.createDocumentFragment();
  array.forEach(function (element, index) {
    fragment.appendChild(callback(element, index));
  });

  return fragment;
};

var removeChildNodes = function (parentNode) {
  while (parentNode.lastChild) {
    parentNode.removeChild(parentNode.lastChild);
  }
};


// functions for rendering elements
var renderPin = function (advertisement, index) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.querySelector('.map__pin').style.left = advertisement.location.x - PIN_WIDTH / 2 + 'px';
  pinElement.querySelector('.map__pin').style.top = advertisement.location.y - PIN_HEIGHT + 'px';
  pinElement.querySelector('.map__pin').children[0].src = advertisement.author.avatar;
  pinElement.querySelector('.map__pin').children[0].alt = advertisement.offer.title;
  pinElement.querySelector('.map__pin').setAttribute('data-id', index);

  return pinElement;
};

var makeFeatureElement = function (feature) {
  var featureElement = document.createElement('li');
  featureElement.classList.add('popup__feature');
  featureElement.classList.add('popup__feature--' + feature);

  return featureElement;
};

var makePhotoElement = function (photo) {
  var photoElement = document.createElement('img');
  photoElement.classList.add('popup__photo');
  photoElement.width = 45;
  photoElement.height = 40;
  photoElement.src = photo;
  photoElement.alt = 'Фотография жилья';

  return photoElement;
};

var renderCard = function (advertisement) {
  var cardElement = cardTemplate.cloneNode(true);

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


// functions for working with advertisements popup
var getAdvertisementId = function (element) {
  if (!element.classList.contains('map__pin')) {
    return element.parentNode.getAttribute('data-id');
  } else {
    return element.getAttribute('data-id');
  }
};

var openAdvertisementPopup = function (advertisement) {
  var currentAdvertisement = document.querySelector('.popup');

  if (!currentAdvertisement) {
    currentAdvertisement = renderCard(advertisement);
    mapSection.insertBefore(currentAdvertisement, document.querySelector('.map__filters-container'));
  } else {
    var newAdvertisement = renderCard(advertisement);
    mapSection.replaceChild(newAdvertisement, currentAdvertisement);
    currentAdvertisement = newAdvertisement;
  }
};

var thisIsPin = function (element) {
  if ((!element.classList.contains('map__pin') && !element.parentNode.classList.contains('map__pin'))
       || element.classList.contains('map__pin--main')
       || element.parentNode.classList.contains('map__pin--main')) {
    return false;
  }

  return true;
};


// generating advertisements, adding listeners to advertisements
var configureAdvertisements = function () {
  var advertisementsArray = generateAdvertisements();
  mapPins.appendChild(renderArrayToChildNodes(advertisementsArray, renderPin));

  mapPins.addEventListener('click', function (evt) {
    if (!thisIsPin(evt.target)) {
      return;
    }

    openAdvertisementPopup(advertisementsArray[getAdvertisementId(evt.target)]);

    addPopupCloseListeners();
  });
};


// popup handlers
var popupEscPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var closePopup = function () {
  mapSection.removeChild(document.querySelector('.popup'));
  document.removeEventListener('keydown', popupEscPressHandler);
};

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
var mapPinMainMouseUpHandler = function () {
  mapSection.classList.remove('map--faded');
  advertisementForm.classList.remove('ad-form--disabled');

  var disabledElements = document.querySelectorAll('[disabled]');
  disabledElements.forEach(function (element) {
    element.disabled = false;
  });

  configureAdvertisements();

  addressInput.value = getPinMainLocation(true);

  mapPinMain.removeEventListener('mouseup', mapPinMainMouseUpHandler);
};


// getting main pin location
var getPinMainLocation = function (arrowActive) {
  var locationX = parseInt(mapPinMain.style.left, 10) + PIN_MAIN_WIDTH / 2;
  var locationY = parseInt(mapPinMain.style.top, 10) + PIN_MAIN_HEIGHT / 2;

  if (arrowActive) {
    locationY = locationY + PIN_MAIN_HEIGHT / 2 + PIN_MAIN_ARROW_HEIGHT;
  }

  return locationX + ', ' + locationY;
};


// initial settings
addressInput.value = getPinMainLocation();
mapPinMain.addEventListener('mouseup', mapPinMainMouseUpHandler);

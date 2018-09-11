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
var HOTEL_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var HOTEL_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
var ADVERTISEMENTS_COUNT = 8;
var MAP_WIDTH = 1200;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var mapSection = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content;
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');


var getRandomNumber = function (minValue, maxValue) {
  return Math.floor((maxValue + 1 - minValue) * Math.random() + minValue);
};

var getRandomItemFromArray = function (array) {
  return array[getRandomNumber(0, array.length - 1)];
};

function shuffleArray(array) {
  for (var i = 0; i < array.length; i++) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
}

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

var generateAdvertisementAutor = function (advertisementNumber) {
  var author = {};
  author.avatar = 'img/avatars/user0' + advertisementNumber + '.png';

  return author;
};

var generateAdvertisementLocation = function () {
  var location = {};
  location.x = getRandomNumber(0, MAP_WIDTH) - PIN_WIDTH / 2;
  location.y = getRandomNumber(130, 630) - PIN_HEIGHT;

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

  offer.photos = HOTEL_PHOTOS.slice();
  shuffleArray(offer.photos);

  return offer;
};

var generateHotelFeatures = function () {
  var features = [];
  var featuresCount = getRandomNumber(0, HOTEL_FEATURES.length);
  var featuresTempArray = HOTEL_FEATURES.slice();
  shuffleArray(featuresTempArray);
  featuresTempArray = featuresTempArray.slice(0, featuresCount);

  featuresTempArray.forEach(function (element) {
    features.push(element);
  });

  return features;
};

var renderArrayToChildNodes = function (features, callback) {
  var fragment = document.createDocumentFragment();
  features.forEach(function (element) {
    fragment.appendChild(callback(element));
  });

  return fragment;
};

var renderPin = function (advertisement) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.querySelector('.map__pin').style.left = advertisement.location.x + 'px';
  pinElement.querySelector('.map__pin').style.top = advertisement.location.y + 'px';
  pinElement.querySelector('.map__pin').children[0].src = advertisement.author.avatar;
  pinElement.querySelector('.map__pin').children[0].alt = advertisement.offer.title;

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

var removeChildNodes = function (parentNode) {
  while (parentNode.lastChild) {
    parentNode.removeChild(parentNode.lastChild);
  }
};

var formatOfferType = function (advertisement) {
  switch (advertisement.offer.type) {
    case 'flat': return 'Квартира';
    case 'bungalo': return 'Бунгало';
    case 'house': return 'Дом';
    case 'palace': return 'Дворец';
    default: return '';
  }
};

var renderCard = function (advertisement) {
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.popup__avatar').src = advertisement.author.avatar;
  cardElement.querySelector('.popup__title').textContent = advertisement.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = advertisement.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = formatOfferType(advertisement);
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

mapSection.classList.remove('map--faded');

var advertisementsArray = generateAdvertisements();

mapPins.appendChild(renderArrayToChildNodes(advertisementsArray, renderPin));
mapSection.insertBefore(renderCard(advertisementsArray[0]), document.querySelector('.map__filters-container'));

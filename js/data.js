'use strict';

(function () {
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

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var PIN_STARTING_COORD_X = 0;
  var PIN_ENDING_COORD_X = 1200;
  var PIN_STARTING_COORD_Y = 130;
  var PIN_ENDING_COORD_Y = 630;

  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 62;
  var PIN_MAIN_ARROW_HEIGHT = 22;

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
    location.x = window.util.getRandomNumber(PIN_STARTING_COORD_X, PIN_ENDING_COORD_X);
    location.y = window.util.getRandomNumber(PIN_STARTING_COORD_Y, PIN_ENDING_COORD_Y);

    return location;
  };

  /** @description creates features array for advertisement offer.
    * @return {array}
    */
  var createHotelFeatures = function () {
    var featuresCount = window.util.getRandomNumber(0, HOTEL_FEATURES.length);
    var features = window.util.getRandomValuesFromArray(HOTEL_FEATURES, featuresCount);

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
    offer.price = window.util.getRandomNumber(1000, 1000000);
    offer.type = window.util.getRandomItemFromArray(HOTEL_TYPES);
    offer.rooms = window.util.getRandomNumber(1, 5);
    offer.guests = window.util.getRandomNumber(1, 15);
    offer.checkin = window.util.getRandomItemFromArray(CHECKIN_TIMES);
    offer.checkout = window.util.getRandomItemFromArray(CHECKOUT_TIMES);
    offer.features = createHotelFeatures();
    offer.description = '';
    offer.photos = window.util.shuffleArray(HOTEL_PHOTOS);

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


  window.data = {
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,
    PIN_MAIN_ARROW_HEIGHT: PIN_MAIN_ARROW_HEIGHT,
    PIN_MAIN_WIDTH: PIN_MAIN_WIDTH,
    PIN_MAIN_HEIGHT: PIN_MAIN_HEIGHT,
    PIN_STARTING_COORD_X: PIN_STARTING_COORD_X,
    PIN_ENDING_COORD_X: PIN_ENDING_COORD_X,
    PIN_STARTING_COORD_Y: PIN_STARTING_COORD_Y,
    PIN_ENDING_COORD_Y: PIN_ENDING_COORD_Y,
    HOTEL_TYPES: HOTEL_TYPES,
    HOTEL_TYPES_MIN_PRICE: HOTEL_TYPES_MIN_PRICE,
    HOTEL_TYPES_DICTIONARY: HOTEL_TYPES_DICTIONARY,
    HOTEL_ROOM_NUMBER_CAPACITY: HOTEL_ROOM_NUMBER_CAPACITY,
    HOTEL_ROOM_NUMBER_CAPACITY_DICTIONARY: HOTEL_ROOM_NUMBER_CAPACITY_DICTIONARY,
    CHECKIN_TIMES: CHECKIN_TIMES,
    CHECKOUT_TIMES: CHECKOUT_TIMES,
    createAdvertisements: createAdvertisements
  };
})();

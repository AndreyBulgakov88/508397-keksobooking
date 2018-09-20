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

  var HOTEL_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var HOTEL_PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var ADVERTISEMENTS_COUNT = 8;


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
    location.x = window.util.getRandomNumber(window.map.PIN_STARTING_COORD_X, window.map.PIN_ENDING_COORD_X);
    location.y = window.util.getRandomNumber(window.map.PIN_STARTING_COORD_Y, window.map.PIN_ENDING_COORD_Y);

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
    offer.type = window.util.getRandomItemFromArray(window.form.HOTEL_TYPES);
    offer.rooms = window.util.getRandomNumber(1, 5);
    offer.guests = window.util.getRandomNumber(1, 15);
    offer.checkin = window.util.getRandomItemFromArray(window.form.CHECKIN_TIMES);
    offer.checkout = window.util.getRandomItemFromArray(window.form.CHECKOUT_TIMES);
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
    createAdvertisements: createAdvertisements
  };
})();

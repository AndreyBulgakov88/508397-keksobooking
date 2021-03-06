'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var PIN_STARTING_COORD_X = 0;
  var PIN_ENDING_COORD_X = 1200;
  var PIN_STARTING_COORD_Y = 130;
  var PIN_ENDING_COORD_Y = 630;

  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 62;
  var PIN_MAIN_ARROW_HEIGHT = 22;

  var MAX_RENDERED_ADVERTISEMENTS = 5;

  var mapPinMainElement = document.querySelector('.map__pin--main');
  var addressInputElement = document.querySelector('#address');

  /** @description returns a data-id attribute from pin DOM element
    * @param {Node} element the pin DOM element.
    * @return {number}
    */
  var getAdvertisementId = function (element) {
    if (!element.classList.contains('map__pin')) {
      return element.parentNode.getAttribute('data-id');
    }

    return element.getAttribute('data-id');
  };

  /** @description renders advertisement card
    * @param {object} advertisement
    */
  var openAdvertisementPopup = function (advertisement) {
    var cardElement = window.render.renderCard(advertisement);
    cardElement.classList.remove('hidden');
  };

  /** @description a handler for the escape-pressing event when the popup window is open
    * @param {Event} evt
    */
  var popupEscPressHandler = function (evt) {
    if (window.util.isEscPressed(evt)) {
      closePopup();
    }
  };

  /** @description closing the popup and removes the escape-pressing listener from the document
    */
  var closePopup = function () {
    var cardElement = document.querySelector('.map__card');
    cardElement.classList.add('hidden');

    var activePinElement = document.querySelector('.map__pin--active');
    if (activePinElement) {
      activePinElement.classList.remove('map__pin--active');
    }

    document.removeEventListener('keydown', popupEscPressHandler);
  };

  /** @description adding keydown and click listeners when the popup window is open
    */
  var addPopupCloseListeners = function () {
    document.addEventListener('keydown', popupEscPressHandler);

    var popupCloseElement = document.querySelector('.popup__close');
    popupCloseElement.addEventListener('click', function () {
      closePopup();
    });

    popupCloseElement.addEventListener('keydown', function (evt) {
      if (window.util.isEnterPressed(evt)) {
        closePopup();
      }
    });
  };

  /** @description sets current pin element to active condition
    * @param {Node} element the pin DOM element.
    */
  var setActivePin = function (element) {
    var activePinElement = document.querySelector('.map__pin--active');
    if (activePinElement) {
      activePinElement.classList.remove('map__pin--active');
    }

    if (!element.classList.contains('map__pin')) {
      element.parentNode.classList.add('map__pin--active');
    } else {
      element.classList.add('map__pin--active');
    }
  };

  /** @description clearing card DOMElement
    */
  var clearCard = function () {
    var cardElement = document.querySelector('.map__card');
    cardElement.querySelector('.popup__avatar').src = '';
    cardElement.querySelector('.popup__title').textContent = '';
    cardElement.querySelector('.popup__text--address').textContent = '';
    cardElement.querySelector('.popup__text--price').textContent = '';
    cardElement.querySelector('.popup__type').textContent = '';
    cardElement.querySelector('.popup__text--capacity').textContent = '';
    cardElement.querySelector('.popup__text--time').textContent = '';

    var featuresElement = cardElement.querySelector('.popup__features');
    window.util.removeChildNodes(featuresElement);

    var descriptionElement = cardElement.querySelector('.popup__description');
    descriptionElement.textContent = '';

    var photosElement = cardElement.querySelector('.popup__photos');
    window.util.removeChildNodes(photosElement);

    cardElement.classList.add('hidden');
  };


  /** @description handler for successful loading advertisements and setup pins event listeners
    * @param {array} advertisements
    */
  var successAdvertisementsLoadHandler = function (advertisements) {
    window.map.advertisementsAll = advertisements;

    var randomAdvertisements = window.util.getRandomValuesFromArray(advertisements, MAX_RENDERED_ADVERTISEMENTS);
    setAdvertisements(randomAdvertisements);

    window.render.renderMapPins(window.map.advertisementsOnMap);

    var mapPins = document.querySelector('.map__pins');
    mapPins.addEventListener('click', function (evt) {
      var advertisementId = getAdvertisementId(evt.target);
      if (!advertisementId) {
        return;
      }

      openAdvertisementPopup(window.map.advertisementsOnMap[advertisementId]);
      setActivePin(evt.target);
      addPopupCloseListeners();
    });
  };

  /** @description loading advertisements from server
    */
  var loadAdvertisements = function () {
    window.backend.load(successAdvertisementsLoadHandler, window.backend.errorHandler);
  };

  /** @description sets advertisements array to the variable that holding advertisements to render on map
    * @param {array} advertisements
    */
  var setAdvertisements = function (advertisements) {
    window.map.advertisementsOnMap = advertisements;
  };


  /** @description removes map pins and closes open advertisement card
    */
  var resetMap = function () {
    var pinsElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinsElements.forEach(function (element) {
      element.remove();
    });

    clearCard();
  };


  /** @description getting a main pin location and putting it into the address input
    * @param {boolean} arrowActive the indicator of main pin arrow activity.
    */
  var getPinMainLocation = function (arrowActive) {
    var locationX = parseInt(mapPinMainElement.style.left, 10) + PIN_MAIN_WIDTH / 2;
    var locationY = parseInt(mapPinMainElement.style.top, 10) + PIN_MAIN_HEIGHT / 2;

    if (arrowActive) {
      locationY = locationY + PIN_MAIN_HEIGHT / 2 + PIN_MAIN_ARROW_HEIGHT;
    }

    addressInputElement.value = locationX + ', ' + locationY;
  };

  window.map = {
    MAX_RENDERED_ADVERTISEMENTS: MAX_RENDERED_ADVERTISEMENTS,
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,
    PIN_MAIN_ARROW_HEIGHT: PIN_MAIN_ARROW_HEIGHT,
    PIN_MAIN_WIDTH: PIN_MAIN_WIDTH,
    PIN_MAIN_HEIGHT: PIN_MAIN_HEIGHT,
    PIN_STARTING_COORD_X: PIN_STARTING_COORD_X,
    PIN_ENDING_COORD_X: PIN_ENDING_COORD_X,
    PIN_STARTING_COORD_Y: PIN_STARTING_COORD_Y,
    PIN_ENDING_COORD_Y: PIN_ENDING_COORD_Y,
    advertisementsAll: [],
    advertisementsOnMap: [],
    loadAdvertisements: loadAdvertisements,
    setAdvertisements: setAdvertisements,
    getPinMainLocation: getPinMainLocation,
    resetMap: resetMap
  };

})();

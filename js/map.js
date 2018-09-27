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

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var mapPinMain = document.querySelector('.map__pin--main');
  var addressInput = document.querySelector('#address');


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

  /** @description renders advertisement card
    * @param {object} advertisement
    */
  var openAdvertisementPopup = function (advertisement) {
    var cardElement = window.render.renderCard(advertisement);
    cardElement.classList.remove('hidden');
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

  // setup functions

  /** @description handler for successful loading advertisements and setup pins event listeners
    * @param {array} advertisementsArray
    */
  var successAdvertisementsLoadHandler = function (advertisementsArray) {
    var mapPins = document.querySelector('.map__pins');

    mapPins.appendChild(window.util.renderArrayToChildNodes(advertisementsArray, window.render.renderPin));

    mapPins.addEventListener('click', function (evt) {
      var advertisementId = getAdvertisementId(evt.target);
      if (!advertisementId) {
        return;
      }

      openAdvertisementPopup(advertisementsArray[advertisementId]);

      setActivePin(evt.target);

      addPopupCloseListeners();
    });
  };


  /** @description loading advertisements from server
    */
  var loadAdvertisements = function () {
    window.backend.load(successAdvertisementsLoadHandler, window.backend.errorHandler);
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

  window.map = {
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,
    PIN_MAIN_ARROW_HEIGHT: PIN_MAIN_ARROW_HEIGHT,
    PIN_MAIN_WIDTH: PIN_MAIN_WIDTH,
    PIN_MAIN_HEIGHT: PIN_MAIN_HEIGHT,
    PIN_STARTING_COORD_X: PIN_STARTING_COORD_X,
    PIN_ENDING_COORD_X: PIN_ENDING_COORD_X,
    PIN_STARTING_COORD_Y: PIN_STARTING_COORD_Y,
    PIN_ENDING_COORD_Y: PIN_ENDING_COORD_Y,
    loadAdvertisements: loadAdvertisements,
    getPinMainLocation: getPinMainLocation
  };

})();

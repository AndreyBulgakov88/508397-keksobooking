'use strict';

(function () {
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

  /** @description returns a data-id attribute from pin DOM element
    * @param {object} advertisement
    */
  var openAdvertisementPopup = function (advertisement) {
    var cardElement = window.render.renderCard(advertisement);
    cardElement.classList.remove('hidden');
  };


  // setup functions

  /** @description creating advertisements and adding listeners to advertisements
    */
  var configureAdvertisements = function () {
    var mapPins = document.querySelector('.map__pins');

    var advertisementsArray = window.data.createAdvertisements();
    mapPins.appendChild(window.util.renderArrayToChildNodes(advertisementsArray, window.render.renderPin));

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


  // getting a main pin location

  /** @description getting a main pin location and putting it into the address input
    * @param {boolean} arrowActive the indicator of main pin arrow activity.
    */
  var getPinMainLocation = function (arrowActive) {
    var locationX = parseInt(mapPinMain.style.left, 10) + window.data.PIN_MAIN_WIDTH / 2;
    var locationY = parseInt(mapPinMain.style.top, 10) + window.data.PIN_MAIN_HEIGHT / 2;

    if (arrowActive) {
      locationY = locationY + window.data.PIN_MAIN_HEIGHT / 2 + window.data.PIN_MAIN_ARROW_HEIGHT;
    }

    addressInput.value = locationX + ', ' + locationY;
  };

  window.map = {
    configureAdvertisements: configureAdvertisements,
    getPinMainLocation: getPinMainLocation
  };

})();

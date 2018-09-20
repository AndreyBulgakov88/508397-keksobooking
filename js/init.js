'use strict';

(function () {
  var mapSection = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');

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

    window.map.configureAdvertisements();

    window.form.setupAdvertisementFormInputRestrictions();
  };

  // initial settings
  window.map.getPinMainLocation();
  window.render.makeEmptyCardElement();


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

      mapPinMainCoordX = Math.max(window.map.PIN_STARTING_COORD_X - window.map.PIN_MAIN_WIDTH / 2, mapPinMainCoordX);
      mapPinMainCoordX = Math.min(window.map.PIN_ENDING_COORD_X - window.map.PIN_MAIN_WIDTH / 2, mapPinMainCoordX);
      mapPinMainCoordY = Math.max(window.map.PIN_STARTING_COORD_Y - (window.map.PIN_MAIN_HEIGHT + window.map.PIN_MAIN_ARROW_HEIGHT), mapPinMainCoordY);
      mapPinMainCoordY = Math.min(window.map.PIN_ENDING_COORD_Y - (window.map.PIN_MAIN_HEIGHT + window.map.PIN_MAIN_ARROW_HEIGHT), mapPinMainCoordY);

      mapPinMain.style.top = mapPinMainCoordY + 'px';
      mapPinMain.style.left = mapPinMainCoordX + 'px';

      window.map.getPinMainLocation(true);
    };

    var documentMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      if (mapSection.classList.contains('map--faded')) {
        activatePage();
        window.map.getPinMainLocation(true);
      }

      document.removeEventListener('mousemove', documentMouseMoveHandler);
      document.removeEventListener('mouseup', documentMouseUpHandler);
    };

    document.addEventListener('mousemove', documentMouseMoveHandler);
    document.addEventListener('mouseup', documentMouseUpHandler);
  });
})();

'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var mapSectionElement = document.querySelector('.map');
  var mapPinMainElement = document.querySelector('.map__pin--main');
  var mapFiltersFormElement = document.querySelector('.map__filters');
  var advertisementFormElement = document.querySelector('.ad-form');
  var ResetButtonElement = document.querySelector('.ad-form__reset');

  /** @description the page activation function
    */
  var activatePage = function () {
    mapSectionElement.classList.remove('map--faded');

    mapFiltersFormElement.addEventListener('change', window.util.debounce(window.filters.mapFiltersChangeHandler, DEBOUNCE_INTERVAL));

    advertisementFormElement.classList.remove('ad-form--disabled');
    advertisementFormElement.addEventListener('submit', window.form.advertisementFormSubmitHandler);
    ResetButtonElement.addEventListener('click', window.form.advertisementFormResetHandler);

    window.form.disabledFormsElements.forEach(function (element) {
      element.disabled = false;
    });

    window.map.loadAdvertisements();
    window.form.setupAdvertisementFormInputRestrictions();
  };


  // initial settings
  window.map.getPinMainLocation();
  window.render.makeEmptyCardElement();


  // adding drag n drop mechanism to main pin
  mapPinMainElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var documentMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      if (mapSectionElement.classList.contains('map--faded')) {
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

      var mapPinMainCoordX = mapPinMainElement.offsetLeft - shift.x;
      var mapPinMainCoordY = mapPinMainElement.offsetTop - shift.y;

      mapPinMainCoordX = Math.max(window.map.PIN_STARTING_COORD_X - window.map.PIN_MAIN_WIDTH / 2, mapPinMainCoordX);
      mapPinMainCoordX = Math.min(window.map.PIN_ENDING_COORD_X - window.map.PIN_MAIN_WIDTH / 2, mapPinMainCoordX);
      mapPinMainCoordY = Math.max(window.map.PIN_STARTING_COORD_Y - (window.map.PIN_MAIN_HEIGHT + window.map.PIN_MAIN_ARROW_HEIGHT), mapPinMainCoordY);
      mapPinMainCoordY = Math.min(window.map.PIN_ENDING_COORD_Y - (window.map.PIN_MAIN_HEIGHT + window.map.PIN_MAIN_ARROW_HEIGHT), mapPinMainCoordY);

      mapPinMainElement.style.top = mapPinMainCoordY + 'px';
      mapPinMainElement.style.left = mapPinMainCoordX + 'px';

      window.map.getPinMainLocation(true);
    };

    var documentMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      if (mapSectionElement.classList.contains('map--faded')) {
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

'use strict';

(function () {

  var mapSectionElement = document.querySelector('.map');
  var mapFiltersContainerElement = document.querySelector('.map__filters-container');
  var pinTemplateElement = document.querySelector('#pin').content;
  var cardTemplateElement = document.querySelector('#card').content.querySelector('.map__card');

  /** @description returns a pin node rendered from the advertisement
    * @param {object} advertisement
    * @param {number} advertisementId
    * @return {Node}
    */
  var renderPin = function (advertisement, advertisementId) {
    var pinElement = pinTemplateElement.cloneNode(true);

    pinElement.querySelector('.map__pin').style.left = advertisement.location.x - window.map.PIN_WIDTH / 2 + 'px';
    pinElement.querySelector('.map__pin').style.top = advertisement.location.y - window.map.PIN_HEIGHT + 'px';
    pinElement.querySelector('.map__pin').children[0].src = advertisement.author.avatar;
    pinElement.querySelector('.map__pin').children[0].alt = advertisement.offer.title;
    pinElement.querySelector('.map__pin').setAttribute('data-id', advertisementId);

    return pinElement;
  };

  /** @description renders advertisements array to map pins
    * @param {array} advertisementsToRender
    */
  var renderMapPins = function (advertisementsToRender) {
    window.map.resetMap();

    var mapPinsElement = document.querySelector('.map__pins');
    mapPinsElement.appendChild(window.util.renderArrayToChildNodes(advertisementsToRender, renderPin));
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
    var cardElement = cardTemplateElement.cloneNode(true);
    mapSectionElement.insertBefore(cardElement, mapFiltersContainerElement);
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
    cardElement.querySelector('.popup__type').textContent = window.form.HotelTypesDictionary[advertisement.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = advertisement.offer.rooms + ' комнаты для ' + advertisement.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;

    var featuresElement = cardElement.querySelector('.popup__features');
    window.util.removeChildNodes(featuresElement);
    featuresElement.appendChild(window.util.renderArrayToChildNodes(advertisement.offer.features, makeFeatureElement));

    var descriptionElement = cardElement.querySelector('.popup__description');
    descriptionElement.textContent = advertisement.offer.description;

    var photosElement = cardElement.querySelector('.popup__photos');
    window.util.removeChildNodes(photosElement);
    photosElement.appendChild(window.util.renderArrayToChildNodes(advertisement.offer.photos, makePhotoElement));

    return cardElement;
  };


  window.render = {
    makeEmptyCardElement: makeEmptyCardElement,
    renderCard: renderCard,
    renderMapPins: renderMapPins
  };
})();

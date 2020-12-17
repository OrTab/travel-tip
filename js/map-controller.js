'use strict'

import { locationService } from './services/location-service.js'



var gGoogleMap;
var gCurrPos;

window.onload = () => {
    initMap()
        .then(getUserPosition)
        .then((pos) => {
            pos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            gCurrPos = pos
            panTo(pos.lat, pos.lng)
        }).catch(err => console.log('Sorry', err))

    .catch(err => console.log('Sorry', err));

    document.querySelector('.btn').addEventListener('click', (ev) => {
        console.log('Aha', ev.target);
        panTo(35.6895, 139.6917);
    })
    document.querySelector('.my-loc-btn').addEventListener('click', () => {
        getUserPosition()
            .then((pos) => {
                pos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                gCurrPos = pos
                panTo(pos.lat, pos.lng)
            })

    })
    onLoadLocations()
    events()
}


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            // console.log('google available');
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            gGoogleMap.addListener('click', (ev) => {
                gCurrPos = { lat: ev.latLng.lat(), lng: ev.latLng.lng() }
                onShowModal()
            })
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
    addMarker({ lat, lng })
}

function getUserPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDs8M2i56LyMS9Ed6BSGsL3VngR3EEuvDw';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function onShowModal() {
    const elbtn = document.querySelector('.add-location-btn')
    elbtn.addEventListener('click', onAddLoction)
    document.querySelector('.modal').style.display = 'flex'
    const elModal = document.querySelector('.modal')
    const elAddLocBtn = document.querySelector('.add-location-btn')
    elAddLocBtn.addEventListener('click', onAddLoction)
    document.querySelector('.close-modal').addEventListener('click', () => {
        elModal.style.display = 'none'
    })
    elModal.style.display = 'flex'
}

function onAddLoction() {
    var elInputLocation = document.querySelector('input[name=selected-loc]')
    document.querySelector('.modal').style.display = 'none'
    locationService.createLocation(elInputLocation.value, gCurrPos.lat, gCurrPos.lng)
    addMarker(gCurrPos)
    elInputLocation.value = ''
    onLoadLocations();
}


function onLoadLocations() {
    locationService.getLocations()
        .then(locations => {
            renderLocationsToTable(locations)
        })
}

function onGoToLocation() {
    const locLat = this.dataset.lat;
    const locLng = this.dataset.lng;
    gCurrPos = { lat: locLat, lng: locLng };
    panTo(+locLat, +locLng);
}

function onDeleteLocation() {
    const locId = this.parentNode.dataset.id;
    locationService.deleteLocation(locId);
    onLoadLocations();
}

function onEditLocation() {
    const locId = this.parentNode.dataset.id;
    const elEditContainer = document.querySelector(`.edit-${locId}`);
    const elEditInput = document.querySelector(`.edit-${locId} input`);
    elEditContainer.style.display = '';
    elEditInput.value = locationService.getLocationById(locId).name;
}

function onSaveEdit() {
    const locId = this.dataset.id;
    const elEditContainer = document.querySelector(`.edit-${locId}`);
    const inputValue = document.querySelector(`.edit-${locId} input`).value;
    locationService.saveEdit(locId, inputValue);
    elEditContainer.style.display = 'none';
    onLoadLocations();
}

function renderLocationsToTable(locations) {
    let strHTMLs = locations.map(location => {
        return `
        <div class="location-item">
        <h3 class="location-name">${location.name}</h3>
        <div class="edit-input-container edit-${location.id}" style="display:none;">
        <input type="text">
        <button class="save-edit-btn" data-id="${location.id}">Save</button>
        </div>
        <div class="location-btns-container" data-id="${location.id}">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
        <button class="go-to-btn" data-lat="${location.lat}" data-lng="${location.lng}">Go</button>
        </div>
        </div>
        `
    }).join('');
    document.querySelector('.locations-inner-container').innerHTML = strHTMLs;
    addBtnEventListeners();
}

function addBtnEventListeners() {
    const elEditBtns = document.querySelectorAll('.edit-btn')
    const elSaveBtns = document.querySelectorAll('.save-edit-btn')
    const elDeleteBtns = document.querySelectorAll('.delete-btn')
    const elGoToBtns = document.querySelectorAll('.go-to-btn')
    elEditBtns.forEach(btn => btn.addEventListener('click', onEditLocation))
    elSaveBtns.forEach(btn => btn.addEventListener('click', onSaveEdit))
    elDeleteBtns.forEach(btn => btn.addEventListener('click', onDeleteLocation))
    elGoToBtns.forEach(btn => btn.addEventListener('click', onGoToLocation))
}

function onSearchLocation(ev) {
    ev.preventDefault()
    const elSearchLocation = document.querySelector('input[name=search-loc]')
    locationService.getSearchCords(elSearchLocation.value)
        .then(moveToSearchLocation)
        .catch(err => console.log('Sorry', err))
}


function moveToSearchLocation(adress) {
    const searchedCords = adress.results[0].geometry.location
    panTo(searchedCords.lat, searchedCords.lng)
    gCurrPos = searchedCords
    onShowModal()
}

function events() {
    document.querySelector('.onSearch').addEventListener('submit', onSearchLocation)
    document.querySelector('.copy-url-btn').addEventListener('click', onCopyUrl)
}

function onCopyUrl() {
    var copyUrl = window.location.href;
    if (gCurrPos) copyUrl += `?lat=${gCurrPos.lat}&lng=${gCurrPos.lng}`;
    navigator.clipboard.writeText(copyUrl)
        .then(() => { console.log(`Copied!`) })
        .catch((error) => { console.log(`Copy failed! ${error}`) })
}

function getLatLngParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const latParam = urlParams.get('lat');
    const lngParam = urlParams.get('lng');
    return new Promise((resolve, reject) => {
        if (latParam && lngParam) resolve(latParam, lngParam)
        else reject('No starting location params found');
    })
}
import { locationService } from './services/location-service.js'



var gGoogleMap;
var currPos;

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 })
        })
        .catch(console.log('INIT MAP ERROR'));

    getUserPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!!!!', err);
        })

    document.querySelector('.btn').addEventListener('click', (ev) => {
        console.log('Aha', ev.target);
        panTo(35.6895, 139.6917);
    })
    locationService.loadLocationsFromStorage();
    renderLocationsToTable();
}


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            gGoogleMap.addListener('click', (ev) => {
                currPos = { lat: ev.latLng.lat(), lng: ev.latLng.lng() }
                addMarker(currPos)
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
}

function onAddLoction() {
    var elInputLocation = document.querySelector('input[name=selected-loc]')
    document.querySelector('.modal').style.display = 'none'
    locationService.createLocation(elInputLocation.value, currPos.lat, currPos.lng)
    onLocationsChange();
}


function onLocationsChange() {
    locationService.getLocations()
        .then(renderLocationsToTable)
}

function renderLocationsToTable(locations) {
    if (!locations || locations.length === 0) return;
    let strHTMLs = locations.map(location => {
        return `
        <div class="location-item">
                <h3 class="location-name">${location.name}</h3>
                <div class="location-edit-delete-container">
                    <button class="edit-btn" onclick>edit</button>
                    <button class="delete-btn">delete</button>
                </div>
            </div>
        `
    }).join('');
    document.querySelector('.locations-inner-container').innerHTML = strHTMLs;
}
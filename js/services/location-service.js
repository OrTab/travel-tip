'use strict'

export const locationService = {
    getLocations,
    createLocation,
    getLocationById,
    deleteLocation,
    saveEdit,
    getSearchCords,
    getWeather
}

const STORAGE_KEY = 'locationsDB'


import { utilService } from '../../util/travel-tip-util.js'
import { storageService } from '../../util/travel-tip-storage.js'

var gLocations = [];

function getLocations() {
    if (!gLocations.length) loadLocationsFromStorage()
    return Promise.resolve(gLocations)
}

function loadLocationsFromStorage() {
    const loadedLocations = storageService.loadFromStorage(STORAGE_KEY);
    gLocations = (loadedLocations) ? loadedLocations : [];
}

function createLocation(name, lat, lng) {
    const location = {
        id: utilService.makeId(),
        name,
        lat,
        lng,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
    gLocations.push(location)
    storageService.saveToStorage(STORAGE_KEY, gLocations)
}

function getLocationById(id) {
    const location = gLocations.find(location => {
        return location.id === id
    })
    return location
}

function getLocationIdxById(id) {
    const location = gLocations.findIndex(location => {
        return location.id === id
    })
    return location
}

function deleteLocation(locId) {
    const locIdx = getLocationIdxById(locId);
    gLocations.splice(locIdx, 1);
    storageService.saveToStorage(STORAGE_KEY, gLocations)
}

function saveEdit(locId, newName) {
    const locIdx = getLocationIdxById(locId);
    gLocations[locIdx].name = newName;
    gLocations.updatedAt = Date.now()
    storageService.saveToStorage(STORAGE_KEY, gLocations)
}

function getSearchCords(address) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCEJl0w5I2nD7X9lQvtBWN5f02Xp1skT1A`)
        .then(res => {
            // console.log('Axios res:', res);
            return res.data
        })
        .catch(err => err)
}



// function getWeather(lat, lng) {
// api.openweathermap.org/data/2.5/weather?q={London}&appid={b58171250156a2219b063a6a71af7b4a}
//     const hi = `api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=b58171250156a2219b063a6a71af7b4a`
//     console.log(hi);
//     fetch(hi)
//         .then(response => console.log(response.status))
//         .then(data => console.log(data))
// }

// .catch(err => console.log(err))
// b58171250156a2219b063a6a71af7b4a
//     console.log(hi);
//     return axios.get(hi)
//         .then(res => {
//             console.log('Axios res:', res);
//             return res.data
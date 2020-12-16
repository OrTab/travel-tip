export const locationService = {
    getLocations
}
import { utilService } from '../../util/travel-tip-util.js'
import { storageService } from '../../util/travel-tip-storage.js'

// const gLocations = [{ id, name: 'Puki Home', lat: 17, lng: 19, createdAt, updatedAt }];

function getLocations() {
    return Promise.resolve(gLocations)
}

function createLocation() {
    return {
        id,
        name: '',
        lat,
        lang,
        createdAt: Date.now(),
        updatedAt,
    }

}
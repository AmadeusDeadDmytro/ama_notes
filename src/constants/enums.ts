export enum Actions {
    ADD_NOTE = 'ADD_NOTE',
    SWAP_NOTE = 'SWAP_NOTE',
    UPDATE_NOTE = 'UPDATE_NOTE',
    SEND_NOTE_TO_TRASH = 'SEND_NOTE_TO_TRASH',
    DELETE_NOTE = 'DELETE_NOTE',
    PRUNE_NOTES = 'PRUNE_NOTES',
    ADD_CATEGORY_TO_NOTE = 'ADD_CATEGORY_TO_NOTE',
    PRUNE_CATEGORY_FROM_NOTES = 'PRUNE_CATEGORY_FROM_NOTES',
    SWAP_FOLDER = 'SWAP_FOLDER',

    ADD_CATEGORY = 'ADD_CATEGORY',
    SWAP_CATEGORY = 'SWAP_CATEGORY',
    UPDATE_CATEGORY = 'UPDATE_CATEGORY',
    DELETE_CATEGORY = 'DELETE_CATEGORY',

    // Sagas
    LOAD_NOTES = 'LOAD_NOTES',
    LOAD_NOTES_SUCCESS = 'LOAD_NOTES_SUCCESS',
    LOAD_NOTES_ERROR = 'LOAD_NOTES_ERROR',

    LOAD_CATEGORIES = 'LOAD_CATEGORY',
    LOAD_CATEGORIES_SUCCESS = 'LOAD_CATEGORY_SUCCESS',
    LOAD_CATEGORIES_ERROR = 'LOAD_CATEGORY_ERROR',

    SYNC_STATE = 'SYNC_STATE',
    SYNC_STATE_SUCCESS = 'SYNC_STATE_SUCCESS',
    SYNC_STATE_ERROR = 'SYNC_STATE_ERROR',
}

export enum Folders {
    ALL = 'ALL',
    TRASH = 'TRASH',
    FAVORITES = 'FAVORITES',
    NONE = 'NONE',
}

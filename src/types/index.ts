export interface NoteItem {
    id: string
    text: string
    created: string
    lastUpdated: string
    category?: string
}

export interface NoteState {
    notes: NoteItem[]
    loading: boolean
    active: string
    error: string
}

export interface CategoryItem {
    id: string
    name: string
}

export interface CategoryState {
    categories: CategoryItem[]
    active: string
    error: string
    loading: boolean
}

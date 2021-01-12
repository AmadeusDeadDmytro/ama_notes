import { Folders } from 'constants/enums'
import { NoteItem } from 'types'
import moment from 'moment'
import { v4 as uuid } from 'uuid'

export const getNoteTitle = (text: string): string => {
    const noteTitleRegEx = /[\w`?!., ]{1,50}/

    let noteTitle: string
    let noteText = text.match(noteTitleRegEx)

    if (!noteText) {
        noteTitle = 'Новая запись'
    } else {
        noteTitle = noteText[0]
    }
    return noteTitle
}

export function noteWithFrontmatter(note: NoteItem): string {
    return `---
Заголовок: ${getNoteTitle(note.text)}
Создано: ${note.created}
Изменено: ${note.lastUpdated}
Категория: ${note.category ? note.category : ''}
---

${note.text}
`
}

export const downloadNote = (filename: string, note: NoteItem): void => {
    const pom = document.createElement('a')
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(noteWithFrontmatter(note)))
    pom.setAttribute('download', `${filename}.md`)

    if (document.createEvent) {
        const event = document.createEvent('MouseEvents')
        event.initEvent('click', true, true)
        pom.dispatchEvent(event)
    } else {
        pom.click()
    }
}

export const sortByLastUpdated = (a: NoteItem, b: NoteItem) => {
    let dateA = new Date(a.lastUpdated)
    let dateB = new Date(b.lastUpdated)

    return dateA > dateB ? -1 : dateA < dateB ? 1 : 0
}

export const newNote = (categoryId?: string, folder?: string) => ({
    id: uuid(),
    text: '',
    created: moment().format(),
    lastUpdated: moment().format(),
    category: categoryId,
    favorite: folder === Folders.FAVORITES,
})

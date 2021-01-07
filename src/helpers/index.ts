import { NoteItem } from 'types'

export const getNoteTitle = (text: string): string => {
    let noteTitle: string
    let noteText = text[0] === '#' && text[1] === '' ? text.slice(2, 52) : text.slice(0, 50)

    if (!noteText) {
        noteTitle = 'Новая запись'
    } else if (noteText.indexOf('\n') !== -1) {
        noteTitle = noteText.slice(0, noteText.indexOf('\n'))
    } else {
        noteTitle = noteText.slice(0, 50)
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

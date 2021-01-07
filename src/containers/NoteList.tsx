import { ApplicationState, CategoryItem, NoteItem } from 'types'
import React, { useEffect, useRef, useState } from 'react'
import { addCategoryToNote, addNote, pruneNotes, swapCategory, swapNote } from 'actions'

import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import { Folders } from 'constants/enums'
import { MoreHorizontal } from 'react-feather'
import NoteOptions from 'containers/NoteOptions'
import { connect } from 'react-redux'
import { getNoteTitle } from 'helpers'
import styled from 'styled-components'

interface NoteListProps {
    activeCategoryId: string
    activeNoteId: string
    notes: NoteItem[]
    filteredNotes: NoteItem[]
    filteredCategories: CategoryItem[]
    swapNote: (noteId: string) => void
    swapCategory: (category: string) => void
    pruneNotes: () => void
    addCategoryToNote: (categoryId: string, noteId: string) => void
}

const NoteList: React.FC<NoteListProps> = ({ activeCategoryId, activeNoteId, notes, filteredNotes, filteredCategories, swapNote, swapCategory, pruneNotes, addCategoryToNote }) => {
    const [noteOptionsId, setNoteOptionsId] = useState('')
    const node = useRef<HTMLDivElement>(null)

    const handleNoteOptionsClick = (event: MouseEvent | React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLSelectElement>, noteId: string = '') => {
        event.stopPropagation()

        if (node.current) {
            if (node.current.contains(event.target as HTMLDivElement)) return
        }

        if (!noteOptionsId) {
            setNoteOptionsId(noteId)
        } else if (noteOptionsId !== noteId) {
            setNoteOptionsId(noteId)
        } else {
            setNoteOptionsId('')
        }
    }

    const searchNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filteredResults = filteredNotes.filter((note) => note.text.toLowerCase().search(event.target.value.toLowerCase()) !== -1)
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleNoteOptionsClick)

        return () => {
            document.removeEventListener('mousedown', handleNoteOptionsClick)
        }
    }, [])

    return (
        <NoteSidebar>
            <Searchbar placeholder="Найти запись" onChange={searchNotes} type="search" />
            <NoteListContainer>
                {filteredNotes.map((note) => {
                    const noteTitle = getNoteTitle(note.text)

                    return (
                        <NoteEach
                            key={note.id}
                            active={note.id === activeNoteId}
                            onClick={() => {
                                if (note.id !== activeNoteId) {
                                    swapNote(note.id)
                                    pruneNotes()
                                }
                            }}
                        >
                            {noteTitle}
                            <NoteOptionsDiv active={noteOptionsId === note.id} onClick={(event) => handleNoteOptionsClick(event, note.id)}>
                                <MoreHorizontal size={15} />
                            </NoteOptionsDiv>
                            {noteOptionsId === note.id && (
                                <NoteOptionsContext ref={node}>
                                    <ContextActionTitle>Переместить в категорию</ContextActionTitle>

                                    <SelectElement
                                        defaultValue=""
                                        onChange={(event) => {
                                            addCategoryToNote(event.target.value, note.id)

                                            if (event.target.value !== activeCategoryId) {
                                                swapCategory(event.target.value)
                                                swapNote(note.id)
                                            }

                                            setNoteOptionsId('')
                                        }}
                                    >
                                        <SelectElementOption disabled value="">
                                            Выберите категорию
                                        </SelectElementOption>

                                        {filteredCategories
                                            .filter((category) => category.id !== note.category)
                                            .map((category) => (
                                                <SelectElementOption key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectElementOption>
                                            ))}
                                        {note.category && (
                                            <SelectElementOption key="none" value="">
                                                Удалить категорию записи
                                            </SelectElementOption>
                                        )}
                                    </SelectElement>
                                    <NoteOptions />
                                </NoteOptionsContext>
                            )}
                        </NoteEach>
                    )
                })}
            </NoteListContainer>
        </NoteSidebar>
    )
}

const mapStateToProps = (state: ApplicationState) => {
    const { noteState, categoryState } = state
    let filteredNotes: NoteItem[]

    if (noteState.activeFolder === Folders.CATEGORY) {
        filteredNotes = noteState.notes.filter((note) => !note.trash && note.category === noteState.activeCategoryId)
    } else if (noteState.activeFolder === Folders.TRASH) {
        filteredNotes = noteState.notes.filter((note) => note.trash)
    } else {
        filteredNotes = noteState.notes.filter((note) => !note.trash)
    }

    filteredNotes.sort(function (a, b) {
        let dateA = new Date(a.lastUpdated)
        let dateB = new Date(b.lastUpdated)
        return dateA > dateB ? -1 : dateA < dateB ? 1 : 0
    })

    return {
        activeCategoryId: noteState.activeCategoryId,
        activeNoteId: noteState.activeNoteId,
        notes: noteState.notes,
        filteredNotes,
        activeNote: state.noteState.notes.find((note) => note.id === state.noteState.activeNoteId),
        filteredCategories: categoryState.categories.filter((category) => category.id !== noteState.activeCategoryId),
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addNote: (note: NoteItem) => dispatch(addNote(note)),
    swapNote: (noteId: string) => dispatch(swapNote(noteId)),
    swapCategory: (categoryId: string) => dispatch(swapCategory(categoryId)),
    pruneNotes: () => dispatch(pruneNotes()),
    addCategoryToNote: (categoryId: string, noteId: string) => dispatch(addCategoryToNote(categoryId, noteId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteList)

const Searchbar = styled.input`
    -webkit-appearance: textfield;
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 1rem;
    padding: 1rem;
    height: 2.5rem;
    line-height: 2.5rem;
    background-color: white;
    outline: none;
    border-radius: 0;
    border-width: 1px;
    border-style: solid;
    border-image: initial;
    border-color: ${Colors.A_COLOR_TWO};
`

const NoteSidebar = styled.aside`
    grid-area: note-sidebar;
    background: ${Colors.BACKGROUND};
    border-right: 1px solid ${Colors.A_COLOR_NINE};
`

const NoteListContainer = styled.div``

const NoteEach = styled.div<{ active: boolean }>`
    position: relative;
    cursor: pointer;
    padding: 0.5rem;
    border-bottom: 1px solid ${Colors.HOVER};
    background: ${({ active }) => active && Colors.A_COLOR_TWO};
    font-weight: ${({ active }) => active && 600};
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
        background: ${Colors.A_COLOR_NINE};
    }
`

const NoteOptionsDiv = styled.div<{ active: boolean }>`
    color: ${Colors.A_COLOR_FOUR};
    padding: 0.5rem;
    z-index: 1;
    cursor: pointer;
`

const NoteOptionsContext = styled.div`
    cursor: default;
    position: absolute;
    color: ${Colors.A_COLOR_FOUR};
    top: 32px;
    left: 200px;
    min-width: 350px;
    padding: 1rem;
    background: white;
    border: 1px solid ${Colors.A_COLOR_TWO};
    z-index: 5;
    box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.1);
`

const ContextActionTitle = styled.h2`
    margin-top: 0;
    font-size: 1rem;
`

const SelectElement = styled.select`
    -webkit-appearance: none;
    font-size: 1rem;
    padding: 0.5rem;
    width: 100%;
`

const SelectElementOption = styled.option``

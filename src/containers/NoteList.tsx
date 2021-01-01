import { ApplicationState, CategoryItem, NoteItem } from 'types'
import React, { useEffect, useRef, useState } from 'react'
import { addCategoryToNote, pruneNotes, swapCategory, swapNote } from 'actions'

import Colors from 'styles/colors'
import { Dispatch } from 'redux'
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

    const handleNoteOptionsClick = (event, noteId: string = '') => {
        event.stopPropagation()

        if (node.current) {
            if (node.current.contains(event.target)) return
        }

        if (!noteOptionsId) {
            setNoteOptionsId(noteId)
        } else if (noteOptionsId !== noteId) {
            setNoteOptionsId(noteId)
        } else {
            setNoteOptionsId('')
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleNoteOptionsClick)

        return () => {
            document.removeEventListener('mousedown', handleNoteOptionsClick)
        }
    }, [])

    return (
        <NoteSidebar>
            <NoteListContainer>
                {filteredNotes.map((note) => {
                    const noteTitle: string = getNoteTitle(note.text)

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
                            <NoteOptions active={noteOptionsId === note.id} onClick={(event) => handleNoteOptionsClick(event, note.id)}>
                                ...
                            </NoteOptions>
                            {noteOptionsId === note.id && (
                                <NoteOptionsContext>
                                    <ContextActionTitle>Переместить в категорию</ContextActionTitle>

                                    <SelectElement
                                        defaultValue=""
                                        onChange={(event) => {
                                            addCategoryToNote(event.target.value, note.id)
                                            const notesForNewCategory = notes.filter((note) => note.category === event.target.value)
                                            const newNoteId = notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''

                                            if (event.target.value !== activeCategoryId) {
                                                swapCategory(event.target.value)
                                                swapNote(newNoteId)
                                            }
                                        }}
                                    >
                                        <SelectElementOption disabled value="">
                                            Выберите категорию
                                        </SelectElementOption>

                                        {filteredCategories.map((category) => (
                                            <SelectElementOption key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectElementOption>
                                        ))}
                                    </SelectElement>
                                </NoteOptionsContext>
                            )}
                        </NoteEach>
                    )
                })}
            </NoteListContainer>
        </NoteSidebar>
    )
}

const mapStateToProps = (state: ApplicationState) => ({
    activeCategoryId: state.categoryState.activeCategoryId,
    activeNoteId: state.noteState.activeNoteId,
    notes: state.noteState.notes,
    filteredNotes: state.categoryState.activeCategoryId ? state.noteState.notes.filter((note) => note.category === state.categoryState.activeCategoryId) : state.noteState.notes,
    filteredCategories: state.categoryState.categories.filter((category) => category.id !== state.categoryState.activeCategoryId),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    swapNote: (noteId: string) => dispatch(swapNote(noteId)),
    swapCategory: (categoryId: string) => dispatch(swapCategory(categoryId)),
    pruneNotes: () => dispatch(pruneNotes()),
    addCategoryToNote: (categoryId: string, noteId: string) => dispatch(addCategoryToNote(categoryId, noteId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteList)

const NoteSidebar = styled.aside`
    grid-area: note-sidebar;
    background: ${Colors.BACKGROUND};
`

const NoteListContainer = styled.div``

const NoteEach = styled.div<{ active: boolean }>`
    position: relative;
    cursor: pointer;
    padding: 0 0.5rem;
    border-bottom: 2px solid ${Colors.HOVER};
    background: ${({ active }) => active && Colors.ACTIVE};
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
        background: ${Colors.HOVER};
    }
`

const NoteOptions = styled.div<{ active: boolean }>`
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
    min-width: 150px;
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

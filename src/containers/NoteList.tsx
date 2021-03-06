import { ApplicationState, CategoryItem, NoteItem } from 'types'
import React, { useEffect, useRef, useState } from 'react'
import { addCategoryToNote, addNote, pruneNotes, swapCategory, swapNote } from 'actions'
import { getNoteTitle, sortByLastUpdated } from 'helpers'

import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import { Folders } from 'constants/enums'
import { MoreHorizontal } from 'react-feather'
import NoteOptions from 'containers/NoteOptions'
import { connect } from 'react-redux'
import { folderMap } from 'constants/index'
import styled from 'styled-components'

interface NoteListProps {
    activeFolder: string
    activeCategoryId: string
    activeCategory?: CategoryItem
    activeNoteId: string
    filteredNotes: NoteItem[]
    filteredCategories: CategoryItem[]
    swapNote: (noteId: string) => void
    swapCategory: (category: string) => void
    pruneNotes: () => void
    addCategoryToNote: (categoryId: string, noteId: string) => void
    isDarkTheme: boolean
}

const NoteList: React.FC<NoteListProps> = ({
    activeFolder,
    activeCategory,
    activeCategoryId,
    activeNoteId,
    filteredNotes,
    filteredCategories,
    swapNote,
    swapCategory,
    pruneNotes,
    addCategoryToNote,
    isDarkTheme,
}) => {
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

    useEffect(() => {
        document.addEventListener('mousedown', handleNoteOptionsClick)

        return () => {
            document.removeEventListener('mousedown', handleNoteOptionsClick)
        }
    })

    return (
        <NoteSidebar darkTheme={isDarkTheme}>
            <NoteSidebarHeader darkTheme={isDarkTheme}>{activeFolder === 'CATEGORY' ? activeCategory && activeCategory.name : folderMap[activeFolder]}</NoteSidebarHeader>
            <NoteListContainer>
                {filteredNotes.map((note) => {
                    const noteTitle = getNoteTitle(note.text)

                    return (
                        <NoteEach
                            key={note.id}
                            active={note.id === activeNoteId}
                            darkTheme={isDarkTheme}
                            onClick={() => {
                                if (note.id !== activeNoteId) {
                                    swapNote(note.id)
                                    pruneNotes()
                                }
                            }}
                        >
                            {noteTitle}
                            <NoteOptionsDiv active={noteOptionsId === note.id} onClick={(event) => handleNoteOptionsClick(event, note.id)} darkTheme={isDarkTheme}>
                                <MoreHorizontal size={15} />
                            </NoteOptionsDiv>
                            {noteOptionsId === note.id && (
                                <NoteOptionsContext ref={node} onClick={(event) => event.stopPropagation()} darkTheme={isDarkTheme}>
                                    {!note.trash && (
                                        <>
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
                                        </>
                                    )}
                                    <NoteOptions clickedNote={note} />
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
    const { noteState, categoryState, themeState } = state
    let filteredNotes: NoteItem[]

    if (noteState.activeFolder === Folders.CATEGORY) {
        filteredNotes = noteState.notes.filter((note) => !note.trash && note.category === noteState.activeCategoryId)
    } else if (noteState.activeFolder === Folders.FAVORITES) {
        filteredNotes = noteState.notes.filter((note) => !note.trash && note.favorite)
    } else if (noteState.activeFolder === Folders.TRASH) {
        filteredNotes = noteState.notes.filter((note) => note.trash)
    } else {
        filteredNotes = noteState.notes.filter((note) => !note.trash)
    }

    filteredNotes.sort(sortByLastUpdated)

    return {
        activeFolder: noteState.activeFolder,
        activeCategoryId: noteState.activeCategoryId,
        activeCategory: categoryState.categories.find((category) => category.id === noteState.activeCategoryId),
        activeNoteId: noteState.activeNoteId,
        notes: noteState.notes,
        filteredNotes,
        activeNote: state.noteState.notes.find((note) => note.id === state.noteState.activeNoteId),
        filteredCategories: categoryState.categories.filter((category) => category.id !== noteState.activeCategoryId),
        isDarkTheme: themeState.dark,
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

const NoteSidebarHeader = styled.div<{ darkTheme?: boolean }>`
    text-align: center;
    padding: 0.5rem;
    ${({ darkTheme }) => darkTheme && 'color: white'};
    ${({ darkTheme }) => darkTheme && 'border-bottom: 1px solid ' + Colors.A_COLOR_EIGHT(true)};
`

const NoteSidebar = styled.aside<{ darkTheme: boolean }>`
    grid-area: note-sidebar;
    background: ${({ darkTheme }) => Colors.A_COLOR_TWO(darkTheme)};
    border-right: 1px solid ${({ darkTheme }) => Colors.A_COLOR_NINE(darkTheme)};
`

const NoteListContainer = styled.div``

const NoteEach = styled.div<{ active: boolean; darkTheme: boolean }>`
    position: relative;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-bottom: 1px solid ${({ darkTheme }) => Colors.A_COLOR_EIGHT(darkTheme)};
    background: ${({ active, darkTheme }) => active && Colors.A_COLOR_EIGHT(darkTheme)};
    color: ${({ active, darkTheme }) => (active ? Colors.A_COLOR_FIVE(darkTheme) : Colors.A_COLOR_SIX(darkTheme))};
    font-weight: ${({ active }) => active && 600};
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
        background: ${({ darkTheme }) => Colors.A_COLOR_NINE(darkTheme)};
        color: ${({ darkTheme }) => Colors.A_COLOR_FIVE(darkTheme)};
    }
`

const NoteOptionsDiv = styled.div<{ active: boolean; darkTheme: boolean }>`
    color: ${({ darkTheme }) => Colors.A_COLOR_FOUR(darkTheme)};
    padding: 0.5rem;
    z-index: 1;
    cursor: pointer;
`

const NoteOptionsContext = styled.div<{ darkTheme: boolean }>`
    cursor: default;
    position: absolute;
    color: ${({ darkTheme }) => Colors.A_COLOR_FOUR(darkTheme)};
    top: 32px;
    left: 200px;
    min-width: 250px;
    padding: 1rem;
    background: white;
    border: 1px solid ${({ darkTheme }) => Colors.A_COLOR_ELEVEN(darkTheme)};
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

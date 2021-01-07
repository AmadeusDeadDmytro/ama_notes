import { ApplicationState, CategoryItem, NoteItem } from 'types'
import { Book, Cloud, Folder, PlusCircle, Trash2, X } from 'react-feather'
import React, { useState } from 'react'
import { addCategory, addNote, deleteCategory, pruneCategoryFromNotes, swapCategory, swapFolder, swapNote, syncState } from 'actions'

import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import { Folders } from 'constants/enums'
import { connect } from 'react-redux'
import kebabCase from 'lodash/kebabCase'
import moment from 'moment'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'

const iconColor = 'rgba(255, 255, 255, 0.4)'

interface AppProps {
    addNote: (note: NoteItem) => void
    addCategory: (category: CategoryItem) => void
    deleteCategory: (categoryId: string) => void
    pruneCategoryFromNotes: (categoryId: string) => void
    swapCategory: (categoryId: string) => void
    swapFolder: (folder: string) => void
    swapNote: (swapNote: string) => void
    syncState: (notes: NoteItem[], categories: CategoryItem[]) => void
    activeNote?: NoteItem
    notes: NoteItem[]
    categories: CategoryItem[]
    activeCategoryId: string
    activeFolder: string
}

const AppSidebar: React.FC<AppProps> = ({
    addNote,
    activeNote,
    syncState,
    addCategory,
    deleteCategory,
    pruneCategoryFromNotes,
    swapCategory,
    swapFolder,
    swapNote,
    notes,
    categories,
    activeCategoryId,
    activeFolder,
}) => {
    const [addingTempCategory, setAddingTempCategory] = useState(false)
    const [tempCategory, setTempCategory] = useState('')

    const newTempCategoryHandler = () => {
        !addingTempCategory && setAddingTempCategory(true)
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>) => {
        event.preventDefault()

        const category = { id: kebabCase(tempCategory), name: tempCategory }

        if (!categories.find((cat) => cat.id === kebabCase(tempCategory))) {
            addCategory(category)
            setTempCategory('')
            setAddingTempCategory(false)
        }
    }

    const newNoteHandler = () => {
        const note: NoteItem = {
            id: uuid(),
            text: '',
            created: moment().format(),
            lastUpdated: moment().format(),
            category: activeCategoryId ? activeCategoryId : undefined,
        }

        if ((activeNote && activeNote.text !== '') || !activeNote) {
            addNote(note)
            swapNote(note.id)
        }
    }

    const syncNotesHandler = () => {
        syncState(notes, categories)
    }

    return (
        <AppSidebarContainer>
            <AppSidebarMain>
                <AppSidebarLink onClick={newNoteHandler}>
                    <PlusCircle size={15} style={{ marginRight: '.5rem' }} color={iconColor} />
                    Добавить заметку
                </AppSidebarLink>
                <AppSidebarLink onClick={() => swapFolder(Folders.ALL)} active={activeFolder === Folders.ALL}>
                    <Book size={15} style={{ marginRight: '.5rem' }} color={iconColor} />
                    Заметки
                </AppSidebarLink>
                <AppSidebarLink onClick={() => swapFolder(Folders.TRASH)} active={activeFolder === Folders.TRASH}>
                    <Trash2 size={15} style={{ marginRight: '.5rem' }} color={iconColor} />
                    Корзина
                </AppSidebarLink>

                <CategoryTitle>
                    <CategoryTitleH2>Категории</CategoryTitleH2>
                    <AddButton onClick={newTempCategoryHandler}>
                        <PlusCircle size={15} color={iconColor} />
                    </AddButton>
                </CategoryTitle>

                <CategoryListContainer>
                    {categories.map((category) => {
                        return (
                            <CategoryEach
                                key={category.id}
                                active={category.id === activeCategoryId}
                                onClick={() => {
                                    const notesForNewCategory = notes.filter((note) => !note.trash && note.category === category.id)
                                    const newNoteId = notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''

                                    if (category.id !== activeCategoryId) {
                                        swapCategory(category.id)
                                        swapNote(newNoteId)
                                    }
                                }}
                            >
                                <CategoryEachName>
                                    <Folder size={15} style={{ marginRight: '.5rem' }} color={iconColor} />
                                    {category.name}
                                </CategoryEachName>
                                <CategoryOptions
                                    onClick={() => {
                                        const newNoteId = notes.length > 0 ? notes[0].id : ''
                                        deleteCategory(category.id)
                                        pruneCategoryFromNotes(category.id)
                                        swapFolder(Folders.ALL)
                                        swapNote(newNoteId)
                                    }}
                                >
                                    <X size={12} />
                                </CategoryOptions>
                            </CategoryEach>
                        )
                    })}
                </CategoryListContainer>

                {addingTempCategory && (
                    <AddCategoryForm onSubmit={onSubmit}>
                        <CategoryNameInput
                            placeholder="Имя категории..."
                            autoFocus
                            onChange={(event) => {
                                setTempCategory(event.target.value)
                            }}
                            onBlur={(event) => {
                                if (!tempCategory) {
                                    setAddingTempCategory(false)
                                } else {
                                    onSubmit(event)
                                }
                            }}
                        />
                    </AddCategoryForm>
                )}
                <AppSidebarLink onClick={syncNotesHandler}>
                    <Cloud size={15} style={{ marginRight: '.5rem' }} color={iconColor} />
                    Синхронизировать
                </AppSidebarLink>
            </AppSidebarMain>
        </AppSidebarContainer>
    )
}

const mapStateToProps = (state: ApplicationState) => ({
    activeNote: state.noteState.notes.find((note) => note.id === state.noteState.activeNoteId),
    activeFolder: state.noteState.activeFolder,
    activeCategoryId: state.noteState.activeCategoryId,
    categories: state.categoryState.categories,
    notes: state.noteState.notes,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addNote: (note: NoteItem) => dispatch(addNote(note)),
    swapNote: (noteId: string) => dispatch(swapNote(noteId)),
    swapCategory: (categoryId: string) => dispatch(swapCategory(categoryId)),
    swapFolder: (folder: string) => dispatch(swapFolder(folder)),
    addCategory: (category: CategoryItem) => dispatch(addCategory(category)),
    deleteCategory: (categoryId: string) => dispatch(deleteCategory(categoryId)),
    pruneCategoryFromNotes: (categoryId: string) => dispatch(pruneCategoryFromNotes(categoryId)),
    syncState: (notes: NoteItem[], categories: CategoryItem[]) => dispatch(syncState(notes, categories)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppSidebar)

const AppSidebarContainer = styled.aside`
    padding: 1rem 0 0.25rem;
    grid-area: app-sidebar;
    background: ${Colors.BACKGROUND_DARK_ONE};
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
`

const AppSidebarLink = styled.div<{ active?: boolean }>`
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    background: ${({ active }) => (active ? Colors.A_COLOR_SIX : '')};

    &:hover {
        background: ${Colors.A_COLOR_THREE};
    }
`

const AppSidebarMain = styled.section`
    flex: 1;
`

const Title = styled.h1`
    font-size: 1.3rem;
    padding: 0.5rem;
    margin: 0;
`
const AllNotes = styled.p`
    padding: 0 0.5rem;
`
const CategoryTitle = styled.div`
    margin-top: 1rem;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const CategoryTitleH2 = styled.h2`
    margin: 0;
    color: ${Colors.A_COLOR_ONE};
    text-transform: uppercase;
    font-size: 0.7rem;
`

const AppSidebarButton = styled.section`
    width: 100%;
    align-self: flex-end;
`

const AddButton = styled.button`
    cursor: pointer;
    -webkit-appearance: none;
    padding: 0 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    background: transparent;
    font-size: 1rem;
    border: none;
    line-height: 1;
`

const AddCategoryButton = styled.button`
    display: block;
    cursor: pointer;
    background: transparent;
    font-weight: 600;
    border: none;
    font-size: 1rem;
    color: white;
    width: 100%;
    text-align: center;
    padding: 1rem;

    &:hover {
        background: rgba(0, 0, 0, 0.2);
    }
`

const CategoryListContainer = styled.div`
    font-size: 0.9rem;
`

const CategoryOptions = styled.div`
    color: transparent;
    z-index: 1;
    cursor: pointer;
`

const CategoryEach = styled.div<{ active: boolean }>`
    cursor: pointer;
    padding: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    background: ${({ active }) => active && Colors.A_COLOR_FIVE};
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:last-of-type {
        border-bottom: none;
    }

    &:hover {
        background: ${Colors.BACKGROUND_DARK_THREE};

        ${CategoryOptions} {
            color: ${Colors.A_COLOR_FIVE};
        }
    }
`

const AddCategoryForm = styled.form``

const CategoryNameInput = styled.input`
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid ${Colors.A_COLOR_ONE};
    padding: 0.5rem;
    font-size: 0.9rem;
    -webkit-appearance: none;
    color: ${Colors.A_COLOR_TWO};
`

const CategoryEachName = styled.div`
    display: flex;
    align-items: center;
`

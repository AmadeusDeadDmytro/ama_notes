import { ApplicationState, CategoryItem, NoteItem } from 'types'
import { Book, Bookmark, Folder, Plus, Settings, Trash2, UploadCloud, X } from 'react-feather'
import React, { useState } from 'react'
import { addCategory, addNote, pruneCategoryFromNotes, swapCategory, swapFolder, swapNote, syncState } from 'actions'

import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import { Folders } from 'constants/enums'
import { connect } from 'react-redux'
import kebabCase from 'lodash/kebabCase'
import { newNote } from 'helpers'
import styled from 'styled-components'
import { useKeyboard } from 'contexts/KeyboardContext'

const iconColor = 'rgba(255, 255, 255, 0.3)'

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
    const { addingTempCategory, setAddingTempCategory } = useKeyboard()
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
        if ((activeNote && activeNote.text !== '') || !activeNote) {
            const note = newNote(activeCategoryId, activeFolder)

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
                <AppSidebarLink onClick={() => swapFolder(Folders.ALL)} active={activeFolder === Folders.ALL}>
                    <Book size={15} style={{ marginRight: '.5rem' }} color={iconColor} />
                    Все заметки
                </AppSidebarLink>
                <AppSidebarLink onClick={() => swapFolder(Folders.FAVORITES)} active={activeFolder === Folders.FAVORITES}>
                    <Bookmark size={15} style={{ marginRight: '.5rem' }} color={iconColor} />
                    Избранные
                </AppSidebarLink>
                <AppSidebarLink onClick={() => swapFolder(Folders.TRASH)} active={activeFolder === Folders.TRASH}>
                    <Trash2 size={15} style={{ marginRight: '.5rem' }} color={iconColor} />
                    Корзина
                </AppSidebarLink>

                <CategoryTitle>
                    <CategoryTitleH2>Категории</CategoryTitleH2>
                    <AddCategoryButton onClick={newTempCategoryHandler}>
                        <Plus size={15} color={iconColor} />
                    </AddCategoryButton>
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
                                        const notesNotTrash = notes.filter((note) => !note.trash)
                                        const newNoteId = notesNotTrash.length > 0 ? notesNotTrash[0].id : ''

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
                <AppSidebarActions onClick={syncNotesHandler}>
                    <ActionButton onClick={newNoteHandler}>
                        <Plus size={18} style={{ marginRight: '.5rem' }} color={iconColor} />
                        {/* <AppSidebarActionsH1>Новая заметка</AppSidebarActionsH1> */}
                    </ActionButton>
                    <ActionButton onClick={syncNotesHandler}>
                        <UploadCloud size={18} style={{ marginRight: '.5rem' }} color={iconColor} />
                        {/* <AppSidebarActionsH1>Синхронизировать</AppSidebarActionsH1> */}
                    </ActionButton>
                    <ActionButton>
                        <Settings size={18} style={{ marginRight: '.5rem' }} color={iconColor} />
                        {/* <AppSidebarActionsH1>Настройки</AppSidebarActionsH1> */}
                    </ActionButton>
                </AppSidebarActions>
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
    pruneCategoryFromNotes: (categoryId: string) => dispatch(pruneCategoryFromNotes(categoryId)),
    syncState: (notes: NoteItem[], categories: CategoryItem[]) => dispatch(syncState(notes, categories)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppSidebar)

const AppSidebarActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
`

const ActionButton = styled.div`
    svg {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${Colors.A_COLOR_SEVEN};
        padding: 0.7rem;
        border-radius: 50%;
        stroke: rgba(255, 255, 255, 0.7);
        margin: 0 0.25rem;

        &:hover {
            stroke: ${Colors.A_COLOR_EIGHT};
            background: ${Colors.A_COLOR_FOUR};
        }
    }
`

const AppSidebarContainer = styled.aside`
    padding: 1rem 0 0.25rem;
    grid-area: app-sidebar;
    background: ${Colors.A_COLOR_FOUR};
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
    background: ${({ active }) => (active ? Colors.A_COLOR_SEVEN : '')};

    &:hover {
        background: ${Colors.A_COLOR_THREE};
    }
`

const AppSidebarMain = styled.section`
    flex: 1;
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

const AddCategoryButton = styled.button`
    cursor: pointer;
    -webkit-appearance: none;
    padding: 0;
    color: rgba(255, 255, 255, 0.8);
    background: transparent;
    font-size: 1rem;
    border: none;
    line-height: 1;

    svg:hover {
        stroke: white;
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
    background: ${({ active }) => active && Colors.A_COLOR_SEVEN};
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:last-of-type {
        border-bottom: none;
    }

    &:hover {
        background: ${Colors.A_COLOR_THREE};

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

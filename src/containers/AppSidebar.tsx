import { ApplicationState, CategoryItem, NoteItem } from 'types'
import React, { useState } from 'react'
import { addCategory, deleteCategory, pruneCategoryFromNotes, swapCategory, swapNote } from 'actions'

import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import kebabCase from 'lodash/kebabCase'
import styled from 'styled-components'

interface AppProps {
    addCategory: (category: CategoryItem) => void
    deleteCategory: (categoryId: string) => void
    pruneCategoryFromNotes: (categoryId: string) => void
    swapCategory: (categoryId: string) => void
    swapNote: (swapNote: string) => void
    notes: NoteItem[]
    categories: CategoryItem[]
    activeCategoryId: string
}

const AppSidebar: React.FC<AppProps> = ({ addCategory, deleteCategory, pruneCategoryFromNotes, swapCategory, swapNote, notes, categories, activeCategoryId }) => {
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

    return (
        <AppSidebarContainer>
            <AppSidebarMain>
                <AppSidebarLink
                    onClick={() => {
                        const newNoteId = notes.length > 0 ? notes[0].id : ''
                        swapCategory('')
                        swapNote(newNoteId)
                    }}
                >
                    Все записи
                </AppSidebarLink>

                <AllCategories>Категории</AllCategories>

                <CategoryListContainer>
                    {categories.map((category) => {
                        return (
                            <CategoryEach
                                key={category.id}
                                active={category.id === activeCategoryId}
                                onClick={() => {
                                    const notesForNewCategory = notes.filter((note) => note.category === category.id)
                                    const newNoteId = notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''

                                    if (category.id !== activeCategoryId) {
                                        swapCategory(category.id)
                                        swapNote(newNoteId)
                                    }
                                }}
                            >
                                <CategoryName>{category.name}</CategoryName>
                                <CategoryOptions
                                    onClick={() => {
                                        deleteCategory(category.id)
                                        pruneCategoryFromNotes(category.id)
                                    }}
                                >
                                    X
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

                <AppSidebarButton>
                    <AddCategoryButton onClick={newTempCategoryHandler}>Добавить категорию</AddCategoryButton>
                </AppSidebarButton>
            </AppSidebarMain>
        </AppSidebarContainer>
    )
}

const mapStateToProps = (state: ApplicationState) => ({
    activeCategoryId: state.categoryState.activeCategoryId,
    categories: state.categoryState.categories,
    notes: state.noteState.notes,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    swapNote: (noteId: string) => dispatch(swapNote(noteId)),
    swapCategory: (categoryId: string) => dispatch(swapCategory(categoryId)),
    addCategory: (category: CategoryItem) => dispatch(addCategory(category)),
    deleteCategory: (categoryId: string) => dispatch(deleteCategory(categoryId)),
    pruneCategoryFromNotes: (categoryId: string) => dispatch(pruneCategoryFromNotes(categoryId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppSidebar)

const AppSidebarContainer = styled.aside`
    padding: 1rem 0;
    grid-area: app-sidebar;
    background: ${Colors.BACKGROUND_DARK_ONE};
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
`

const AppSidebarLink = styled.div`
    padding: 0 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;

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
const AllCategories = styled.h2`
    margin: 1rem 0 0;
    color: ${Colors.A_COLOR_ONE};
    text-transform: uppercase;
    font-size: 0.7rem;
    padding: 0.5rem;
`

const AppSidebarButton = styled.section`
    width: 100%;
    align-self: flex-end;
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

const CategoryName = styled.div``

import React, { useState } from 'react'

import { CategoryItem } from 'types'
import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import { addCategory } from 'actions'
import { connect } from 'react-redux'
import kebabCase from 'lodash/kebabCase'
import styled from 'styled-components'

interface AppProps {
    addCategory: (categoryName: CategoryItem) => void
    categories: CategoryItem[]
}

const AppSidebar: React.FC<AppProps> = ({ addCategory, categories }) => {
    const [addingTempCategory, setAddingTempCategory] = useState(false)
    const [tempCategory, setTempCategory] = useState('')

    const newTempCategoryHandler = () => {
        !addingTempCategory && setAddingTempCategory(true)
    }

    return (
        <AppSidebarContainer>
            <AppSidebarMain>
                <Title>AmaNote</Title>
                <AllNotes>Все записи</AllNotes>
                <AllCategories>Категории</AllCategories>

                <CategoryListContainer>
                    {categories.map((category) => {
                        return (
                            <CategoryEach key={category.id} active={!category}>
                                {category.name}
                            </CategoryEach>
                        )
                    })}
                </CategoryListContainer>

                {addingTempCategory && (
                    <AddCategoryForm
                        onSubmit={(event) => {
                            event.preventDefault()

                            const category = { id: kebabCase(tempCategory), name: tempCategory }

                            addCategory(category)

                            setTempCategory('')
                            setAddingTempCategory(false)
                        }}
                    >
                        <CategoryNameInput
                            placeholder="Имя категории..."
                            autoFocus
                            onChange={(event) => {
                                setTempCategory(event.target.value)
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

const mapStateToProps = (state) => ({
    categories: state.categoryState.categories,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addCategory: (category) => dispatch(addCategory(category)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppSidebar)

const AppSidebarContainer = styled.aside`
    grid-area: app-sidebar;
    background: ${Colors.BACKGROUND_DARK_ONE};
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
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
    margin: 2rem 0 0;
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
const CategoryEach = styled.div<{ active: boolean }>`
    cursor: pointer;
    padding: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    border-bottom: 2px solid ${Colors.BACKGROUND_DARK_TWO};
    background: ${({ active }) => active && Colors.ACTIVE};

    &:last-of-type {
        border-bottom: none;
    }

    &:hover {
        background: ${Colors.BACKGROUND_DARK_THREE};
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

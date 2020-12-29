import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const AppSidebar: React.FC = () => {
    return (
        <AppSidebarContainer>
            <AllCategories>Все записи</AllCategories>
            <CategoryListContainer>
                {[1, 2, 3].map((category) => {
                    return (
                        <CategoryEach key={category} active={!category}>
                            Category
                        </CategoryEach>
                    )
                })}
            </CategoryListContainer>
            <AddCategory>Добавить категорию</AddCategory>
        </AppSidebarContainer>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(AppSidebar)

const AppSidebarContainer = styled.aside`
    grid-area: app-sidebar;
    background: ${Colors.BACKGROUND_DARK_ONE};
`

const AllCategories = styled.div``
const AddCategory = styled.div``

const CategoryListContainer = styled.div``
const CategoryEach = styled.div<{ active: boolean }>`
    cursor: pointer;
    padding: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    border-bottom: 2px solid ${Colors.BACKGROUND_DARK_TWO};
    background: ${({ active }) => active && Colors.ACTIVE};

    &:hover {
        background: ${Colors.BACKGROUND_DARK_THREE};
    }
`

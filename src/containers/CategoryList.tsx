import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const CategoryList: React.FC = () => {
    return (
        <CategorySidebar>
            <CategoryListContainer>
                {[1, 2, 3].map((category) => {
                    return (
                        <CategoryEach key={category} active={!category}>
                            Category
                        </CategoryEach>
                    )
                })}
            </CategoryListContainer>
        </CategorySidebar>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList)

const CategorySidebar = styled.aside`
    grid-area: category-sidebar;
    background: ${Colors.BACKGROUND_DARK_ONE};
`

const CategoryListContainer = styled.div``
const CategoryEach = styled.div<{ active: boolean }>`
    cursor: pointer;
    padding: 0.5rem;
    border-bottom: 2px solid ${Colors.BACKGROUND_DARK_TWO};
    background: ${({ active }) => active && Colors.ACTIVE};

    &:hover {
        background: ${Colors.BACKGROUND_DARK_THREE};
    }
`

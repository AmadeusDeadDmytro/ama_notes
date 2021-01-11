import { ApplicationState, NoteItem } from 'types'
import { ArrowUp, Bookmark, Download, Trash } from 'react-feather'
import { downloadNote, getNoteTitle } from 'helpers'
import { toggleTrashedNote, toggleFavoriteNote } from 'actions'

import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

interface NoteOptionsProps {
    toggleTrashedNote: (noteId: string) => void
    toggleFavoriteNote: (noteId: string) => void
    clickedNote: NoteItem
}

const NoteOptions: React.FC<NoteOptionsProps> = ({ toggleFavoriteNote, clickedNote, toggleTrashedNote }) => {
    const trashNoteHandler = () => {
        toggleTrashedNote(clickedNote.id)
    }

    const downloadNoteHandler = () => {
        if (clickedNote) {
            downloadNote(getNoteTitle(clickedNote.text), clickedNote)
        }
    }

    const favoriteNoteHandler = () => {
        toggleFavoriteNote(clickedNote.id)
    }

    return (
        <NoteOptionsNav>
            {!clickedNote.trash && (
                <NavButton onClick={favoriteNoteHandler}>
                    <Bookmark size={15} />
                    {clickedNote.favorite ? 'Удалить из Избранного' : 'Добавить в Избранное'}
                </NavButton>
            )}
            <NavButton onClick={trashNoteHandler}>
                {clickedNote.trash ? (
                    <>
                        <ArrowUp size={15} />
                        Восстановить
                    </>
                ) : (
                    <>
                        <Trash size={15} />В корзину
                    </>
                )}
            </NavButton>
            <NavButton onClick={downloadNoteHandler}>
                <Download size={15} />
                Скачать
            </NavButton>
        </NoteOptionsNav>
    )
}

const mapStateToProps = (state: ApplicationState) => ({
    activeCategoryId: state.noteState.activeCategoryId,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    toggleTrashedNote: (noteId: string) => dispatch(toggleTrashedNote(noteId)),
    toggleFavoriteNote: (noteId: string) => dispatch(toggleFavoriteNote(noteId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteOptions)

const NoteOptionsNav = styled.nav`
    margin-top: 1rem;

    svg {
        margin-right: 0.5rem;
    }
`

const NavButton = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    background: transparent;
    font-weight: 600;
    border: none;
    font-size: 1rem;
    padding: 0 0.5rem;

    div {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
    }

    svg {
        height: 18px;
        width: 18px;
        margin-right: 0.3rem;
    }

    &:hover {
        background: rgba(0, 0, 0, 0.1);
    }
`

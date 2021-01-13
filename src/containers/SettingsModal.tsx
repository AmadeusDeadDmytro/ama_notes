import React, { useEffect, useRef } from 'react'
import { ApplicationState } from 'types'
import { Dispatch } from 'redux'
import { toggleDarkTheme, toggleSettingsModal } from 'actions'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Buttons } from 'styles/base'

export interface SettingsModalProps {
    isOpen: boolean
    dark: boolean
    toggleSettingsModal: () => {}
    toggleDarkTheme: () => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, dark, toggleDarkTheme, toggleSettingsModal }) => {
    const node = useRef<HTMLDivElement>(null)

    const handleDomClick = (event: MouseEvent | React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLSelectElement>) => {
        event.stopPropagation()

        if (node.current && node.current.contains(event.target as HTMLDivElement)) return

        if (isOpen) {
            toggleSettingsModal()
        }
    }

    const toggleDarkThemeHandler = () => {
        toggleDarkTheme()
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleDomClick)
        return () => {
            document.removeEventListener('mousedown', handleDomClick)
        }
    })

    return isOpen ? (
        <Dimmer>
            <SettingsModalContainer ref={node}>
                <H2>Настройки</H2>
                <Button onClick={toggleDarkThemeHandler}>Включить темную тему</Button>
            </SettingsModalContainer>
        </Dimmer>
    ) : null
}

const mapStateToProps = (state: ApplicationState) => ({
    isOpen: state.settingsState.isOpen,
    dark: state.themeState.dark,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    toggleSettingsModal: () => dispatch(toggleSettingsModal()),
    toggleDarkTheme: () => dispatch(toggleDarkTheme()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal)

const Dimmer = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.6);
    line-height: 1;
    user-select: none;
    z-index: 99;
`

const SettingsModalContainer = styled.div`
    border-radius: 4px;
    background: white;
    padding: 1.5rem;
    box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
    min-height: 300px;
    width: 600px;
    max-width: 90%;
    user-select: text;
    z-index: 100;
`

const H2 = styled.h2`
    margin-top: 0;
`

const Button = styled(Buttons)``

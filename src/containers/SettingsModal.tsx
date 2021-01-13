import React, { useEffect, useRef } from 'react'
import { ApplicationState } from 'types'
import { Dispatch } from 'redux'
import { toggleDarkTheme, toggleSettingsModal, updateCodeMirrorOption } from 'actions'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Buttons, Vbetween, Switch, SwitchInput, Slider } from 'styles/base'
import Colors from 'styles/colors'

export interface SettingsModalProps {
    isOpen: boolean
    dark: boolean
    toggleSettingsModal: () => {}
    toggleDarkTheme: () => void
    updateCodeMirrorOption: (key: string, value: string) => void
    codeMirrorOptions: { [key: string]: any }
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, dark, toggleDarkTheme, toggleSettingsModal, updateCodeMirrorOption, codeMirrorOptions }) => {
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

        if (!dark) {
            updateCodeMirrorOption('theme', 'zenburn')
        } else {
            updateCodeMirrorOption('theme', 'base16-light')
        }
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

                <SettingsOptions>
                    <SettingsLabel>Темный режим</SettingsLabel>
                    <Switch>
                        <SwitchInput type="checkbox" checked={dark} onChange={toggleDarkThemeHandler} />
                        <Slider round />
                    </Switch>
                </SettingsOptions>
                <SettingsOptions>
                    <SettingsLabel>Vim Mode</SettingsLabel>
                    <Switch>
                        <SwitchInput
                            type="checkbox"
                            checked={codeMirrorOptions.keyMap === 'vim'}
                            onChange={() => {
                                if (codeMirrorOptions.keyMap === 'vim') {
                                    updateCodeMirrorOption('keyMap', 'default')
                                } else {
                                    updateCodeMirrorOption('keyMap', 'vim')
                                }
                            }}
                        />
                        <Slider round />
                    </Switch>
                </SettingsOptions>
            </SettingsModalContainer>
        </Dimmer>
    ) : null
}

const mapStateToProps = (state: ApplicationState) => ({
    isOpen: state.settingsState.isOpen,
    dark: state.themeState.dark,
    codeMirrorOptions: state.settingsState.codeMirrorOptions,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    toggleSettingsModal: () => dispatch(toggleSettingsModal()),
    toggleDarkTheme: () => dispatch(toggleDarkTheme()),
    updateCodeMirrorOption: (key: string, value: string) => dispatch(updateCodeMirrorOption(key, value)),
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
    margin-bottom: 1.5rem;
`

const SettingsOptions = styled(Vbetween)`
    padding: 0.5rem 0;
    border-bottom: 2px solid ${Colors.A_COLOR_ELEVEN()};

    &:last-of-type {
        border-bottom: 0;
    }
`

const SettingsLabel = styled.div`
    font-weight: 600;
    font-size: 1.1rem;
`

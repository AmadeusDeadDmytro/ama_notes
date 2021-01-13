import styled from 'styled-components'
import Colors from 'styles/colors'

export const Buttons = styled.a`
    -webkit-appearance: none;
    display: inline-block;
    border: 2px solid ${Colors.PRIMARY};
    background: ${Colors.PRIMARY};
    border-radius: 4px;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
    margin: 0 0 0.5rem 0;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    line-height: 1;

    &:hover {
        border: 2px solid ${Colors.PRIMARY};
        border-radius: 4px;
        background: ${Colors.PRIMARY};
        text-decoration: none;
    }

    &:focus {
        border: 2px solid ${Colors.PRIMARY};
        border-radius: 4px;
        background: ${Colors.PRIMARY};
        text-decoration: none;
    }

    &:active {
        border: 2px solid ${Colors.PRIMARY};
        border-radius: 4px;
        background: ${Colors.PRIMARY};
        text-decoration: none;
    }
`

export const Icon = styled.div`
    color: rgba(255, 255, 255, 0.7);
`

export const Vcenter = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

export const Vbetween = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const Switch = styled.label`
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
`

export const Slider = styled.span<{ round?: boolean }>`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${Colors.A_COLOR_NINE()};
    -webkit-transition: 0.4s;
    transition: 0.4s;
    ${({ round }) => round && 'border-radius: 34px;'};

    &:before {
        position: absolute;
        content: '';
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        ${({ round }) => round && 'border-radius: 50%;'};
    }
`

export const SwitchInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + ${Slider} {
        background-color: ${Colors.PRIMARY};
    }

    &:focus + ${Slider} {
        box-shadow: 0 0 1px ${Colors.PRIMARY};
    }

    &:checked + ${Slider}:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }
`

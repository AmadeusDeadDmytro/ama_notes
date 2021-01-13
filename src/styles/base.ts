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

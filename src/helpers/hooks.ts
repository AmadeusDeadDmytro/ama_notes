import 'mousetrap-global-bind'

import { useEffect, useRef } from 'react'

import mousetrap from 'mousetrap'

const noop = () => {}

export const useInterval = (callback: () => void, delay: number | null) => {
    const savedCallback = useRef(noop)

    // Запоминаем последний коллбэк
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        const tick = () => savedCallback.current()

        if (delay !== null) {
            const id = setInterval(tick, delay)

            return () => clearInterval(id)
        }
    }, [delay])
}

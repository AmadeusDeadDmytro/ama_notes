import 'mousetrap-global-bind'

import { useEffect, useRef } from 'react'

import mousetrap from 'mousetrap'

const noop = () => {}

export const useInterval = (callback: () => void, delay: number | null, immediate?: boolean) => {
    const savedCallback = useRef(noop)

    // Запоминаем последний коллбэк
    useEffect(() => {
        savedCallback.current = callback
    })

    // Если immediate то выполняем коллбэк
    useEffect(() => {
        if (!immediate) return
        if (delay === null) return

        savedCallback.current()
    }, [immediate])

    useEffect(() => {
        if (delay === null) return undefined
        const tick = () => savedCallback.current()
        const id = setInterval(tick, delay)

        return () => clearInterval(id)
    }, [delay])
}

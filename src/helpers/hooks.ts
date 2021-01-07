import mousetrap from 'mousetrap'
import 'mousetrap-global-bind'

import { useEffect, useRef } from 'react'

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

export const useKey = (key: string, action: () => void) => {
    let actionRef = useRef(noop)
    actionRef.current = action

    useEffect(() => {
        mousetrap.bindGlobal(key, () => {
            if (!actionRef.current) return
            actionRef.current()
        })
        return () => {
            mousetrap.unbind(key)
        }
    }, [key])
}

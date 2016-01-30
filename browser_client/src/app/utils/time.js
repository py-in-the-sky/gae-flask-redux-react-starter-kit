// why?  minimize reliance on sinon and its fake timers for testing
export function wrappedSetTimeout (fn, delay) {
    if (__TEST__)
        return fn()

    return setTimeout(fn, delay)
}

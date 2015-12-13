def compose(*functions):
    "e.g., compose(f1, f2, f3)(x) == f1(f2(f3(x)))"
    reducer = lambda value, fn: fn(value)
    return lambda arg: reduce(reducer, reversed(functions), arg)

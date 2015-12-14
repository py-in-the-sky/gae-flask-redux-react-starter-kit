def string_length(min_len=None, max_len=None):
    plural_min = '' if min_len == 1 else 's'
    plural_max = '' if max_len == 1 else 's'

    min_message = 'must be at least {} character{} long'
    max_message = 'must be no more than {} character{} long'

    def _f(string):
        string_len = len(string)

        if min_len is not None and string_len < min_len:
            raise ValueError(min_message.format(min_len, plural_min))
        elif max_len is not None and max_len < string_len:
            raise ValueError(max_message.format(max_len, plural_max))

        return string

    return _f

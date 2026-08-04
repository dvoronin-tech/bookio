import { useEffect } from 'react';

type DigitKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type LowercaseLetterKey =
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z';

type UppercaseLetterKey =
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z';

type FunctionKey =
    | 'F1'
    | 'F2'
    | 'F3'
    | 'F4'
    | 'F5'
    | 'F6'
    | 'F7'
    | 'F8'
    | 'F9'
    | 'F10'
    | 'F11'
    | 'F12';

type KnownKeyboardKey =
    | 'Enter'
    | 'Escape'
    | 'Tab'
    | ' '
    | 'Backspace'
    | 'Delete'
    | 'ArrowUp'
    | 'ArrowDown'
    | 'ArrowLeft'
    | 'ArrowRight'
    | 'Home'
    | 'End'
    | 'PageUp'
    | 'PageDown'
    | 'Control'
    | 'Alt'
    | 'Shift'
    | 'Meta'
    | DigitKey
    | LowercaseLetterKey
    | UppercaseLetterKey
    | FunctionKey;

export type KeyboardKey = KnownKeyboardKey | (string & {});

export const useOnPress = (key: KeyboardKey, callback: () => void, enabled = true) => {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === key) {
                event.preventDefault();
                callback();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [key, callback, enabled]);
};
